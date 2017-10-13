
export interface Element {
  readonly type : string,
  readonly value : string
}

export interface DefineCall {
  readonly type : string,
  readonly arguments : {
    readonly type : string,
    readonly elements : Element[]
  }[],
}

function getLiterals(arrayExpression : {elements : Element[]}){
  return arrayExpression.elements
    .filter(element => element.type == 'Literal')
    .map(element => element.value);
}


export default function findDependencies(defineCall : any){
  if(defineCall.type === 'CallExpression'){
    if(defineCall.arguments.length == 1){
      return [];
    }else if(defineCall.arguments.length == 2){
      if(defineCall.arguments[0].type == 'ArrayExpression'){
        return getLiterals(defineCall.arguments[0])
      }else if(defineCall.arguments[0].type == 'Literal'){
        return [];
      }else{
        return [];
      }
    }else if(defineCall.arguments.length == 3){
      if(defineCall.arguments[1].type == 'ArrayExpression'){
        return getLiterals(defineCall.arguments[1])
      }else{
        return [];
      }
    }else{
      return [];
    }
  }else if(defineCall.type === 'Identifier'){
    return [];
  }else{
    throw "oops"
  }
};