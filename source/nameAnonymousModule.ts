import { types } from 'recast';
import * as path from "path";

export default function(defineCall : any, filename : string){
  if(defineCall.type === 'CallExpression'){
    if(defineCall.arguments.length > 0 && defineCall.arguments[0].type == 'Literal'){
      return defineCall.arguments[0].value
    }else{
      if(defineCall.callee.name == 'define'){
        defineCall.arguments.unshift(types.builders.literal(filename));
      }
      return filename;
    }
  }else if(defineCall.type === 'Identifier' && defineCall.parent.type === 'ConditionalExpression'){
    defineCall.parent['consequent'] = types.builders.callExpression(
      types.builders.memberExpression(
        types.builders.identifier('define'),
        types.builders.identifier('bind'),
        false
      ),
      [
        types.builders.literal(null),
        types.builders.literal(filename)
      ]
    )
    return filename;
  }
};