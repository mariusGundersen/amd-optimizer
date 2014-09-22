var parse = require('./source/parse');
var locateModules = require('./source/locateModules');
var findDependencies = require('./source/findDependencies');
var nameAnonymousModule = require('./source/nameAnonymousModule');
var print = require('./source/print');
var moduleTree = require('./source/moduleTree');
var dependencyQueue = require('./source/dependencyQueue');
var path = require('path');
var requirejs = require('requirejs');
var EventEmitter = require('events').EventEmitter;
var slash = require('slash');
var _ = require('lodash');

module.exports = function(config, options){
  
  var context = requirejs(config || {});
  
  var modules = moduleTree();
  
  var pendingModules = dependencyQueue();
  
  return _.extend(new EventEmitter(), {
    addFile: function(file){
      
      if('contents' in file == false){
        this.emit('error', 'File object must contain content');
        return;
      }
      if('name' in file == false){
        this.emit('error', 'File object must contain property name');
        return;
      }
      if('relative' in file == false){
        this.emit('error', 'File object must contain property relative');
        return;
      }
            
      if(modules.has(file.name)) return;
      
      locateModules(parse(file), options.umd).map(function(module){
        
        if(module.isModule){
          var dependencies = findDependencies(module.defineCall).map(function(name){
            return {path: path.relative(config.baseUrl, context.toUrl(name)), name: name};
          });
          
          nameAnonymousModule(module.defineCall, file.name);
        }else{
          var dependencies = [];
        }
        
        modules.defineModule(file.name, module.rootAstNode, dependencies.map(function(dep){ return dep.name; }), file);
                
        return dependencies;
        
      }).reduce(function(a, b){
        return a.concat(b);
      }, []).filter(function(dependency){
        return modules.has(dependency.name) == false && pendingModules.isMissing(dependency);        
      }).forEach(function(dependency){
        pendingModules.push(dependency);
        this.emit('dependency', {path: path.join(config.baseUrl, dependency.path + '.js'), name: dependency.name});
      }, this);
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
    
  });
  
};

function removeExt(file){
  return /^(.*)(\.js)$/.exec(file)[1];
}