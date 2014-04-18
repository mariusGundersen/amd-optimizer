var toposort = require('toposort');

module.exports = function(){
  
  var modules = Object.create(null);
  
  return {
    addModule: function(name){
      if(!(name in modules)){
        modules[name] = {
          name: name,
          defined: false
        };
      }
    },
    
    defineModule: function(name, source, dependencies, file){
      modules[name] = {
        name: name,
        source: source,
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
      for(var name in modules){
        if(modules[name].dependencies.length > 0){
          edges = edges.concat(modules[name].dependencies.map(function(dep){
            return [name, dep];
          }));
        }
      }
      
      return toposort(edges).reverse().map(function(name){
        return modules[name];
      });
    }
  };
  
};