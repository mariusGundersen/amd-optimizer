var _ = require('lodash');

module.exports = function(){
  
  var q = [];
  
  return {
    add: function(name){
      if(this.has(name)){
        return;
      }
      q.push(name);
    },
    remove: function(name){
      return _.pull(q, name);
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