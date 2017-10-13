const recast = require('recast');
const stripBOM = require('strip-bom');
const slash = require('slash');

module.exports = function(contents, name){
  return recast.parse(
    stripBOM(contents),
    {
      sourceFileName: slash(name)
    }
  );
};