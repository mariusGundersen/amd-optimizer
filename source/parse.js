var recast = require('recast');


module.exports = function(file){
  
  var ast = recast.parse(file.source);
  
  return {
    name: file.name,
    path: file.path,
    ast: ast,
    source: file.source
  };
  
};