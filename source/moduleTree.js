var toposort = require('toposort');

module.exports = function(){
  
  var modules = Object.create(null);
  
  return {
    addModule: function(name){
      if(!(name in modules)){
        modules[name] = {
          name: name,
          dependencies: [],
          source: [],
          defined: false
        };
      }
    },
    
    defineModule: function(name, source, dependencies, file){
      modules[name] = {
        name: name,
        source: name in modules ? modules[name].source.concat([source]) : [source],
        dependencies: dependencies,
        file: file,
        defined: true
      };
    },
    
    has: function(name){
      return name in modules;
    },
    
    hasDefined: function(name){
      return (name in modules) && modules[name].defined; 
    },
    
    leafToRoot: function(){
      var edges = [];
      var nodes = [];
      
      for(var name in modules){
        if(modules[name].dependencies.length > 0){
          edges = edges.concat(modules[name].dependencies.map(function(dep){
            return [name, dep];
          }));
        }
        nodes.push(name);
      }
      
      return toposort.array(nodes, edges).reverse().filter(function(name){
        return name in modules && modules[name].defined;
      }).map(function(name){
        return modules[name];
      });
    }
  };
  
};