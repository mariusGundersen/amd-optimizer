


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


module.exports = function(file){
  
  var topLevel = file.ast.program.body;
  
  
  file.modules = topLevel.filter(function(node){
        
    return isDefineNodeWithArgs(node.expression) || isRequireNodeWithArgs(node.expression);
    
    
  });
  
  return file;
  
};