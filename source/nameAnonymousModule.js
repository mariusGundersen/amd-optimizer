var typeBuilders = require('recast').types.builders;
var path = require('path');

module.exports = function(module, file, base){
  if(module.arguments[0].type != 'Literal'){
    module.arguments.unshift(typeBuilders.literal(file));
  }
};