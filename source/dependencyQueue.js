var _ = require('lodash');

module.exports = function(){
  
  var q = [];
  
  return {
    push: function(item){
      if(_.any(q, {name: item.name}) || _.any(q, {path: item.path})){
        return;
      }
      q.push({
        name: item.name,
        path: item.path
      });
    },
    pop: function(){
      return q.shift();
    },
    isEmpty: function(){
      return q.length == 0;
    },
    isMissing: function(item){
      return !_.any(q, {name: item.name}) && !_.any(q, {path: item.path})
    }
  };
  
};