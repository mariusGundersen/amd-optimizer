var recast = require('recast');
var stripBOM = require('strip-bom');
var slash = require('slash');

module.exports = function(file){
  return recast.parse(
    stripBOM(file.contents.toString('utf8')),
    {
      sourceFileName: slash(file.relative)
    }
  );
};