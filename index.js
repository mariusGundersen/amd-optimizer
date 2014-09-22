var parse = require('./source/parse');
var path = require('path');
var locateModules = require('./source/locateModules');
var findDependencies = require('./source/findDependencies');
var nameAnonymousModule = require('./source/nameAnonymousModule');
var print = require('./source/print');
var moduleTree = require('./source/moduleTree');
var requirejs = require('requirejs');
var EventEmitter = require('events').EventEmitter;
var slash = require('slash');

function extend(target, parent){
  var targetDefinition = {};
  
  for(var name in target){
    if (target.hasOwnProperty(name)) {
      targetDefinition[name] = {value: target[name], enumerable: true};
    }
  }
  
  return Object.create(parent, targetDefinition);
}


module.exports = function(config, options){
  
  var eventEmitter = new EventEmitter();
  
  var context = requirejs(config || {});
  
  var modules = moduleTree();
  
  return extend({
    addFile: function(file){
      
      if('contents' in file == false){
        eventEmitter.emit('error', 'File object must contain content');
        return;
      }
      if('path' in file == false){
        eventEmitter.emit('error', 'File object must contain property path');
        return;
      }
      if('relative' in file == false){
        eventEmitter.emit('error', 'File object must contain property relative');
        return;
      }
            
      if(modules.hasDefined(file.relative)) return;
      
      var dependenciesToLoad = locateModules(parse(file), options.umd).map(function(module){
        
        if(module.isModule){
          var dependencies = findDependencies(module.defineCall).map(function(name){
            return {path: path.relative(config.baseUrl, context.toUrl(name)), name: name};
          });
          
          nameAnonymousModule(module.defineCall, file.name);
          var name = removeExt(file.relative);
        }else{
          var dependencies = [];
          var name = removeExt(file.relative);
        }
        
        modules.defineModule(name, module.rootAstNode, dependencies.map(function(dep){ return dep.path; }), file);
                
        return dependencies;
        
      }).reduce(function(a, b){
        return a.concat(b);
      }, []);
            
      dependenciesToLoad.filter(function(dependency){
        return modules.has(dependency.path) == false;        
      }).forEach(function(dependency){
        modules.addModule(dependency.path);
        eventEmitter.emit('dependency', {path: path.join(config.baseUrl, dependency.path + '.js'), name: dependency.name});
      });
    },
    optimize: function(){
      return modules.leafToRoot().map(function(module){
        var code = print(module.source, module.name);
        return {
          content: code.code,
          map: code.map,
          name: slash(module.name),
          source: module.file.source
        };
      });
    }
    
  }, eventEmitter);
  
};

function removeExt(file){
  return /^(.*)(\.js)$/.exec(file)[1];
}