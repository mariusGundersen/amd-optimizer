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

module.exports = function(config, options){

  config = config || {};
  options = options || {};

  const toExclude = getExclude(config, options);

  const context = requirejs(config);

  const modules = new ModuleTree();

  const pendingModules = new MissingModules();

  const onDone = null;

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

        if(!module.isModule){
          modules.defineModule(filename, module.rootAstNode, [], file);
          return [];
        }

        const moduleName = nameAnonymousModule(module.defineCall, filename);

        const dependencies = findDependencies(module.defineCall)
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
    done: async function(loadFile){
      while(!pendingModules.isEmpty()){
        const files = await Promise.all(pendingModules.map(m => loadFile(m)));
        for(const file of files){
          this.addFile(file);
        }
      }

      return optimize();
    }
  };

  function optimize(){
    return modules.leafToRoot().map(function(module){
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

  // match to "http://", "https://", etc...
  function hasProtocol(targetUrl){
    return /^[a-z]+:\/\//.test(targetUrl);
  }

};

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