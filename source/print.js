var recast = require('recast');

module.exports = function(module, name){
  return recast.print(module, {sourceMapName: name});
};