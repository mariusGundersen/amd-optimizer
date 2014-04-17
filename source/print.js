var recast = require('recast');

module.exports = function(module){
  return recast.print(module);
};