const typeBuilders = require('recast').types.builders;
const recast = require('recast');

module.exports = function(source, name, initialSourceMap){
  return recast.print(
    typeBuilders.program(source),
    {
      sourceMapName: name+'.js',
      inputSourceMap: initialSourceMap || null
    }
  );
};