var parse = require('./source/parse');
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


module.exports = function(config){
  
  var eventEmitter = new EventEmitter();
  
  var context = requirejs(config || {});
  
  var modules = moduleTree();
  
  return extend({
    addFile: function(file){
      locateModules(parse(file)).map(function(module){
        var dependencies = findDependencies(module.expression).map(function(name){
          var url = context.toUrl(name + '.js');
          
          modules.addModule(name);
          
          return {url:url, name: name};
        });
        
        dependencies.filter(function(dependency){
          return modules.hasDefined(dependency.name) == false;
        }).forEach(function(dependency){
          eventEmitter.emit('dependency', dependency);
        });

        nameAnonymousModule(module.expression, file.name);
        
        var name = module.expression.arguments[0].value;

        modules.defineModule(name, print(module, name), dependencies.map(function(dep){ return dep.name; }), file);
      });
    },
    optimize: function(){
      return modules.leafToRoot().map(function(module){
        return module.source;
      });
    }
    
  }, eventEmitter);
  
};