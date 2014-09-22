var _ = require('lodash');

module.exports = function(){
  
  var q = [];
  
  return {
    push: function(name){
      if(this.isMissing(name)){
        return;
      }
      q.push(name);
    },
    pop: function(){
      return q.shift();
    },
    isEmpty: function(){
      return q.length == 0;
    },
    has: function(name){
      return _.contains(q, name);
    },
    isMissing: function(name){
      return !this.has(name);
    }
  };
  
};