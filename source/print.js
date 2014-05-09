var typeBuilders = require('recast').types.builders;
var recast = require('recast');

module.exports = function(module, name){
  
  var module = typeBuilders.program (module);
  
  return recast.print(module, {sourceMapName: name});
};