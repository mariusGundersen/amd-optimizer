var recast = require('recast');


module.exports = function(file){
  
  var ast = recast.parse(file.source, { sourceFileName: file.name+'.js' });
  
  return ast;
  
};