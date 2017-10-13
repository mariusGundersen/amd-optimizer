import * as recast from 'recast';
import * as stripBOM from 'strip-bom';
import * as slash from 'slash';
import { File } from './types';

export default function parse(file : File){
  return recast.parse(
    stripBOM(file.contents),
    {
      sourceFileName: slash(file.relative)
    }
  );
};