var parse = require('./source/parse');
var path = require('path');
var locateModules = require('./source/locateModules');
var findDependencies = require('./source/findDependencies');
var nameAnonymousModule = require('./source/nameAnonymousModule');
var print = require('./source/print');
var moduleTree = require('./source/moduleTree');
var requirejs = require('requirejs');
var EventEmitter = require('events').EventEmitter;

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
      
      if('source' in file == false){
        eventEmitter.emit('error', 'File object must contain source');
        return;
      }
      if('path' in file == false){
        eventEmitter.emit('error', 'File object must contain property path');
        return;
      }
      if('name' in file == false){
        eventEmitter.emit('error', 'File object must contain property name');
        return;
      }
      
      if(modules.hasDefined(file.name)) return;
      
      var dependenciesToLoad = locateModules(parse(file), options.umd).map(function(module){
        
        if(module.isModule){
          var dependencies = findDependencies(module.defineCall).map(function(name){
            return {url:context.toUrl(name + '.js'), name: name};
          });

          var name = nameAnonymousModule(module.defineCall, file.name, config.baseUrl);
        }else{
          var dependencies = [];
          var name = file.name;
        }
        
        modules.defineModule(name, module.rootAstNode, dependencies.map(function(dep){ return dep.name; }), file);
                
        return dependencies;
        
      }).reduce(function(a, b){
        return a.concat(b);
      }, []);
      
      dependenciesToLoad.filter(function(dependency){
        return modules.has(dependency.name) == false;        
      }).forEach(function(dependency){
        modules.addModule(dependency.name);
        eventEmitter.emit('dependency', dependency);
      });
    },
    optimize: function(){
      return modules.leafToRoot().map(function(module){
        var code = print(module.source, module.name);
        return {
          code: code.code,
          map: code.map,
          name: module.name,
          source: module.file.source
        };
      });
    }
    
  }, eventEmitter);
  
};