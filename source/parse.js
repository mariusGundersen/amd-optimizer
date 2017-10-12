const recast = require('recast');
const stripBOM = require('strip-bom');
const slash = require('slash');

module.exports = function(file){
  return recast.parse(
    stripBOM(file.contents),
    {
      sourceFileName: slash(file.relative)
    }
  );
};