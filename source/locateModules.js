


function isDefineNodeWithArgs (node) {
  return node && node.type === 'CallExpression' &&
         node.callee && node.callee.type === 'Identifier' &&
         node.callee.name === 'define';
};

function isRequireNodeWithArgs (node) {
  return node && node.type === 'CallExpression' &&
         node.callee && node.callee.type === 'Identifier' &&
         node.callee.name === 'require';
};

function findCallExpression(node){
  return node.type === 'CallExpression' ? node : 
         node.type === 'ExpressionStatement' ? findCallExpression(node.expression) :
         null;
}


module.exports = function(ast){
  
  var topLevel = ast.program.body;
    
  return topLevel.map(function(node){
        
    if(isDefineNodeWithArgs(node.expression) || isRequireNodeWithArgs(node.expression)){
      return {
        isModule: true,
        node: node
      }
    }else{
      return {
        isModule: false,
        node: node
      }
    }
    
  });
  
};