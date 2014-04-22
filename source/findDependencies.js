
function getLiterals(arrayExpression){
  return arrayExpression.elements.filter(function(element){
    return element.type == 'Literal';
  }).map(function(element){
    return element.value;
  });
}


module.exports = function(module){
  if(module.arguments.length == 1){
    return [];
  }else if(module.arguments.length == 2){
    if(module.arguments[0].type == 'ArrayExpression'){
      return getLiterals(module.arguments[0])
    }else if(module.arguments[0].type == 'Literal'){
      return [];
    }
  }else if(module.arguments.length == 3){
    if(module.arguments[1].type == 'ArrayExpression'){
      return getLiterals(module.arguments[1])
    } 
  }
};