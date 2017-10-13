import locateUmdDefine from './locateUmdModule';

function isDefineNodeWithArgs (node : any) {
  return node && node.type === 'CallExpression' &&
         node.callee && node.callee.type === 'Identifier' &&
         node.callee.name === 'define';
};

function isRequireNodeWithArgs (node : any) {
  return node && node.type === 'CallExpression' &&
         node.callee && node.callee.type === 'Identifier' &&
         node.callee.name === 'require';
};

export interface ModuleLocation {
  readonly isModule : boolean,
  readonly rootAstNode : {},
  readonly defineCall : {}
}

export default function locateModule(ast : any, locateUmd? : boolean) : ModuleLocation[] {

  const topLevel = ast.program.body;

  return topLevel.map(function(node : any){

    if(isDefineNodeWithArgs(node.expression) || isRequireNodeWithArgs(node.expression)){
      return {
        isModule: true,
        rootAstNode: node,
        defineCall: node.expression
      }
    }else if(locateUmd){
      const defineCall = locateUmdDefine(node.expression);

      return {
        isModule: defineCall != null,
        rootAstNode: node,
        defineCall: defineCall
      }
    }else{
      return {
        isModule: false,
        rootAstNode: node,
        defineCall: null
      }
    }
  });
};