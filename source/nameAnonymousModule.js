var typeBuilders = require('recast').types.builders;
var path = require('path');

module.exports = function(defineCall, filename, base){
  if(defineCall.arguments[0].type == 'Literal'){
    return defineCall.arguments[0].value
  }else{
    defineCall.arguments.unshift(typeBuilders.literal(filename));
    return filename;
  }
};