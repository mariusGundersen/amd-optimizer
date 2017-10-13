const parse = require('./source/parse');
const locateModules = require('./source/locateModules');
const findDependencies = require('./source/findDependencies');
const nameAnonymousModule = require('./source/nameAnonymousModule');
const print = require('./source/print');
const ModuleTree = require('./source/ModuleTree');
const MissingModules = require('./source/MissingModules');
const path = require('path');
const url = require('url');
const requirejs = require('requirejs');
const EventEmitter = require('events').EventEmitter;
const slash = require('slash');
const _ = require('lodash');
const createPluginRunner = require('./source/plugin');

module.exports = function(config = {}, options = {}){
  const toExclude = getExclude(config, options);

  const context = requirejs(config);

  const modules = new ModuleTree();

  const pendingModules = new MissingModules();

  const plugin = createPluginRunner(options.plugins);

  return {
    addFile: function(file){
      if('contents' in file == false){
        throw new Error('File object must contain content');
      }
      if('name' in file == false){
        throw new Error('File object must contain property name');
      }
      if('relative' in file == false){
        throw new Error('File object must contain property relative');
      }

      const filename = slash(file.name);
      if(!modules.isMissing(filename)) return;

      pendingModules.remove(filename);

      const dependencies = locateModules(parse(file), options.umd)
      .map(function(module){
        console.log(file.name, module);

        if(!module.isModule){
          modules.defineModule(filename, module.rootAstNode, [], file);
          return [];
        }

        const moduleName = nameAnonymousModule(module.defineCall, filename);

        const dependencies = findDependencies(module.defineCall)
        .filter(name => !excluded(toExclude, name))
        .map(name => ({
          name,
          requiredBy: moduleName
        }));

        modules.defineModule(moduleName, module.rootAstNode, dependencies.map(dep => dep.name), file);
        return dependencies;
      })
      .reduce(flatmap)
      .filter(dep => !modules.has(dep.name)
                  && !pendingModules.has(dep.name));

      pendingModules.add(dependencies);
    },
    done: async function(loadFile){

      const loadModule = ({name, requiredBy, path}) => loadFile({
        name,
        requiredBy,
        path: toPath(path || name + '.js')
      });

      while(!pendingModules.isEmpty()){
        const files = await Promise.all(pendingModules.map(m => plugin(m, loadModule)));
        for(const file of files){
          console.log(file.contents.toString());
          this.addFile(file);
        }
      }

      return optimize();
    }
  };

  function optimize(){
    console.log(modules.modules)
    return modules.leafToRoot().map(function(module){
      console.log('module', module);
      const code = print(module.source, module.name, module.file.sourceMap);
      return {
        content: code.code,
        map: code.map,
        name: slash(module.name),
        source: module.file.source,
        file: module.file
      };
    });
  }

  function toPath(name){
    return hasProtocol(config.baseUrl)
    ? url.resolve(config.baseUrl, context.toUrl(name))
    : path.join(config.baseUrl, path.relative(config.baseUrl, context.toUrl(name)))
  }
};

// match to "http://", "https://", etc...
function hasProtocol(targetUrl){
  return /^[a-z]+:\/\//.test(targetUrl);
}

function excluded(exclude, name){
  const path = name.split('/');
  return exclude.some(function(prefix){
    const prefixPath = prefix.split('/');
    if(prefixPath.length > path.length) return false;
    const startOfPath = _.take(path, prefixPath.length);
    return _.zip(startOfPath, prefixPath)
      .every(segment => segment[0] === segment[1]);
  });
}

function getExclude(config, options){
  if('exclude' in config && 'exclude' in options){
    return _.uniq(config.exclude.concat(options.exclude))
  }else if('exclude' in config){
    return config.exclude;
  }else if('exclude' in options){
    return options.exclude;
  }else{
    return [];
  }
}

function flatmap(a, b){
  return (a || []).concat(b || []);
}