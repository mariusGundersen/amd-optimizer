var typeBuilders = require('recast').types.builders;

module.exports = function(module, name){
  if(module.arguments[0].type != 'Literal'){
    module.arguments.unshift(typeBuilders.literal(name));
  }
};