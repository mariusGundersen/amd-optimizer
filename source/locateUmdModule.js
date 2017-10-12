const traverse = require('ast-traverse');

module.exports = function(astExpression){

  let hasBeenFound = false;
  let defineCall = null;

  traverse(astExpression, {
    pre(node, parent, prop, idx){
      const result = findDefine(node);
      if(result){
        hasBeenFound = true;
        defineCall = result;
      }
    },
    skipProperty(){
      return hasBeenFound;
    }
  });


  return defineCall;
};

function findDefine(node){
  return isIfDefineAndAmd(node)
      || isConditionalDefineAndAmd(node);
}

//if(<isUmdTest>){<containsDefineStatement>}
function isIfDefineAndAmd(node){
  return node && node.type === 'IfStatement'
      && isUmdTest(node.test)
      && containsDefineStatement(node.consequent);
}

//else if(<isUmdTest>){<containsDefineStatement>}
function isElseIfDefineAndAmd(node){
  console.log(node.type);
  return node && node.type === 'ElseIfStatement'
      && isUmdTest(node.test)
      && containsDefineStatement(node.consequent);
}

//<isUmdTest> ? define
function isConditionalDefineAndAmd(node){
  return node && node.type === 'ConditionalExpression'
      && isUmdTest(node.test)
      && (node.consequent.type === 'Identifier'
      && node.consequent.name === 'define'
      && (node.consequent.parent = node, node.consequent)
      || isDefineNodeWithArgs(node.consequent));
}

//<isTypeofFunction> && <isDefineAmd>
function isUmdTest(expression){
  return expression && expression.type === 'LogicalExpression'
      && expression.operator === '&&'
      && (isTypeofFunction(expression.left)
      || isSecondLevelUmdTest(expression.left)
      ) && isDefineAmd(expression.right);
}

function isSecondLevelUmdTest(expression){
  return expression && expression.type === 'LogicalExpression'
      && expression.operator === '&&'
      && isTypeofFunction(expression.left);
}

//<isTypeofDefine> === <isFunctionLiteral>
//<isFunctionLiteral> === <isTypeofDefine>
function isTypeofFunction(expression){
  return expression && expression.type === 'BinaryExpression'
      && (
           expression.operator === '==='
        || expression.operator === '=='
      ) && (
           (isTypeofDefine(expression.left) && isFunctionLiteral(expression.right))
        || (isTypeofDefine(expression.right) && isFunctionLiteral(expression.left))
      );
}

//typeof define
function isTypeofDefine(expression){
  return expression.type === 'UnaryExpression'
      && expression.operator === 'typeof'
      && expression.argument
      && expression.argument.type === 'Identifier'
      && expression.argument.name === 'define';
}

//'function'
function isFunctionLiteral(expression){
  return expression.type === 'Literal'
      && expression.value === 'function';
}

//define.amd
//define['amd']
function isDefineAmd(expression){
  return expression && expression.type === 'MemberExpression'
      && expression.object && expression.object.type === 'Identifier'
      && expression.object.name === 'define'
      && expression.property
      && (expression.property.type === 'Identifier' && expression.property.name === 'amd'
      || expression.property.type === 'Literal' && expression.property.value === 'amd' );
}

//{<isDefineStatement>}
function containsDefineStatement(statement){
  return statement && (
         (statement.type === 'BlockStatement' && first(statement.body, isDefineStatement))
      || isDefineStatement(statement));
}

//define(...)
function isDefineStatement(statement){
  return statement && statement.type === 'ExpressionStatement'
      && statement.expression
      && isDefineNodeWithArgs(statement.expression);
}

//define(...)
function isDefineNodeWithArgs (node) {
  return node && node.type === 'CallExpression'
      && node.callee && node.callee.type === 'Identifier'
      && node.callee.name === 'define' && node;
}

function first(array, func){
  for(const entry of array){
    const result = func(entry);
    if(result) return result;
  }
  return null;
}