import * as recast from 'recast';
import * as stripBOM from 'strip-bom';
import * as slash from 'slash';
import { File } from './types';

export default function parse(file : File){
  console.log('parse', file.name);
  return recast.parse(
    stripBOM(file.contents),
    {
      sourceFileName: slash(file.name)
    }
  );
};