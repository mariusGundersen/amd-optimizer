import { print, types } from 'recast';

export default function(source : {}, name : string, initialSourceMap? : {}){
  console.log('print', source);
  return print(
    types.builders.program(source),
    {
      sourceMapName: name+'.js',
      inputSourceMap: initialSourceMap || null
    }
  );
};