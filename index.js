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
            return path.relative(config.baseUrl, context.toUrl(name));
          });
          var name = nameAnonymousModule(module.defineCall, removeExt(file.relative));
        }else{
          var dependencies = [];
          var name = file.relative;
        }
        
        modules.defineModule(name, module.rootAstNode, dependencies.map(function(dep){ return dep; }), file);
                
        return dependencies;
        
      }).reduce(function(a, b){
        return a.concat(b);
      }, []);
            
      dependenciesToLoad.filter(function(dependency){
        return modules.has(dependency) == false;        
      }).forEach(function(dependency){
        modules.addModule(dependency);
        eventEmitter.emit('dependency', path.join(config.baseUrl, dependency + '.js'));
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

function removeExt(file){
  return /^(.*)(\.js)$/.exec(file)[1];
}