var typeBuilders = require('recast').types.builders;
var path = require('path');

var baseName = /^(.*?)\.\w+/;

module.exports = function(module, file, base){
  if(module.arguments[0].type != 'Literal'){
    
    file = path.relative(base, file).replace("\\", "/");
    var name = baseName.exec(file)[1];
    
    module.arguments.unshift(typeBuilders.literal(name));
  }
};