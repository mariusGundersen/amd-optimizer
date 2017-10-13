"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parse_1 = require("./parse");
const locateModules_1 = require("./locateModules");
const findDependencies_1 = require("./findDependencies");
const nameAnonymousModule_1 = require("./nameAnonymousModule");
const print_1 = require("./print");
const ModuleTree_1 = require("./ModuleTree");
const MissingModules_1 = require("./MissingModules");
const path = require("path");
const url = require("url");
const requirejs = require("requirejs");
const slash = require("slash");
const _ = require("lodash");
function default_1(config, options) {
    config = config || {};
    options = options || {};
    const toExclude = getExclude(config, options);
    const context = requirejs(config);
    const modules = new ModuleTree_1.default();
    const pendingModules = new MissingModules_1.default();
    const onDone = null;
    return {
        addFile: function (file) {
            if ('contents' in file == false) {
                throw new Error('File object must contain content');
            }
            if ('name' in file == false) {
                throw new Error('File object must contain property name');
            }
            if ('relative' in file == false) {
                throw new Error('File object must contain property relative');
            }
            const filename = slash(file.name);
            if (!modules.isMissing(filename))
                return;
            pendingModules.remove(filename);
            const dependencies = locateModules_1.default(parse_1.default(file), options.umd)
                .map(function (module) {
                if (!module.isModule) {
                    modules.defineModule(filename, module.rootAstNode, [], file);
                    return [];
                }
                const moduleName = nameAnonymousModule_1.default(module.defineCall, filename);
                const dependencies = findDependencies_1.default(module.defineCall)
                    .filter(name => !excluded(toExclude, name))
                    .map(name => ({
                    name,
                    requiredBy: moduleName,
                    path: hasProtocol(config.baseUrl)
                        ? url.resolve(config.baseUrl, context.toUrl(name)) + '.js'
                        : path.join(config.baseUrl, path.relative(config.baseUrl, context.toUrl(name))) + '.js'
                }));
                modules.defineModule(moduleName, module.rootAstNode, dependencies.map(dep => dep.name), file);
                return dependencies;
            })
                .reduce(flatmap)
                .filter(dep => !modules.has(dep.name)
                && !pendingModules.has(dep.name));
            pendingModules.add(dependencies);
        },
        done: async function (loadFile) {
            while (!pendingModules.isEmpty()) {
                const files = await Promise.all(pendingModules.map(m => loadFile(m)));
                for (const file of files) {
                    this.addFile(file);
                }
            }
            return optimize();
        }
    };
    function optimize() {
        return modules.leafToRoot().map(function (module) {
            const code = print_1.default(module.source, module.name, module.file.sourceMap);
            return {
                content: code.code,
                map: code.map,
                name: slash(module.name),
                source: module.file.source,
                file: module.file
            };
        });
    }
    // match to "http://", "https://", etc...
    function hasProtocol(targetUrl) {
        return /^[a-z]+:\/\//.test(targetUrl);
    }
}
exports.default = default_1;
;
function excluded(exclude, name) {
    const path = name.split('/');
    return exclude.some(function (prefix) {
        const prefixPath = prefix.split('/');
        if (prefixPath.length > path.length)
            return false;
        const startOfPath = _.take(path, prefixPath.length);
        return _.zip(startOfPath, prefixPath)
            .every(segment => segment[0] === segment[1]);
    });
}
function getExclude(config, options) {
    if ('exclude' in config && config.exclude && 'exclude' in options && options.exclude) {
        return _.uniq(config.exclude.concat(options.exclude));
    }
    else if ('exclude' in config && config.exclude) {
        return config.exclude;
    }
    else if ('exclude' in options && options.exclude) {
        return options.exclude;
    }
    else {
        return [];
    }
}
function flatmap(a, b) {
    return (a || []).concat(b || []);
}
//# sourceMappingURL=index.js.map