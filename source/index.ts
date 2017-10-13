import parse from './parse';
import locateModules from './locateModules';
import findDependencies from './findDependencies';
import nameAnonymousModule from './nameAnonymousModule';
import print from './print';
import ModuleTree from './ModuleTree';
import MissingModules from './MissingModules';
import * as path from 'path';
import * as url from 'url';
import * as requirejs from 'requirejs';
import * as slash from 'slash';
import * as _ from 'lodash';

import { Module, Dependency, File } from './types';

export interface Config {
  readonly baseUrl : string
  readonly exclude? : string[]

}

export interface Options {
  readonly umd? : boolean
  readonly exclude? : string[]
}

export type LoadFile = (Dependency : Dependency) => File

export interface Result {
  readonly name : string,
  readonly content : string,
  readonly map : {}
}

export default function(config : Config, options : Options){

  config = config || {};
  options = options || {};

  const toExclude = getExclude(config, options);

  const context = requirejs(config);

  const modules = new ModuleTree();

  const pendingModules = new MissingModules();

  const onDone = null;

  return {
    addFile: function(file : File){
      if('contents' in file == false){
        throw new Error('File object must contain content');
      }
      if('name' in file == false){
        throw new Error('File object must contain property name');
      }

      const filename = slash(file.name);
      if(!modules.isMissing(filename)) return;

      pendingModules.remove(filename);

      const dependencies = locateModules(parse(file), options.umd)
      .map(function(module){

        if(!module.isModule){
          modules.defineModule(filename, module.rootAstNode, [], file.sourceMap);
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

        modules.defineModule(moduleName, module.rootAstNode, dependencies.map(dep => dep.name), file.sourceMap);
        return dependencies;
      })
      .reduce(flatmap)
      .filter(dep => !modules.has(dep.name)
                  && !pendingModules.has(dep.name));

      pendingModules.add(dependencies);
    },
    done: async function(loadFile : LoadFile){
      while(!pendingModules.isEmpty()){
        const files = await Promise.all(pendingModules.map(m => loadFile(m)));
        for(const file of files){
          this.addFile(file);
        }
      }

      return optimize();
    }
  };

  function optimize() : Result[] {
    return modules.leafToRoot().map(function(module){
      const code = print(module.source, module.name, module.sourceMap);
      console.log(code.map);
      return {
        content: code.code,
        map: {
          ...code.map,
          sourcesContent: module.source
        },
        name: slash(module.name)
      };
    });
  }

  // match to "http://", "https://", etc...
  function hasProtocol(targetUrl : string){
    return /^[a-z]+:\/\//.test(targetUrl);
  }

};

function excluded(exclude : string[], name : string){
  const path = name.split('/');
  return exclude.some(function(prefix){
    const prefixPath = prefix.split('/');
    if(prefixPath.length > path.length) return false;
    const startOfPath = _.take(path, prefixPath.length);
    return _.zip(startOfPath, prefixPath)
      .every(segment => segment[0] === segment[1]);
  });
}

function getExclude(config : Config, options : Options){
  if('exclude' in config && config.exclude && 'exclude' in options && options.exclude){
    return _.uniq(config.exclude.concat(options.exclude))
  }else if('exclude' in config && config.exclude){
    return config.exclude;
  }else if('exclude' in options && options.exclude){
    return options.exclude;
  }else{
    return [];
  }
}

function flatmap<T>(a? : T[], b? : T[]){
  return (a || []).concat(b || []);
}