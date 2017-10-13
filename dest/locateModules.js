"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const locateUmdModule_1 = require("./locateUmdModule");
function isDefineNodeWithArgs(node) {
    return node && node.type === 'CallExpression' &&
        node.callee && node.callee.type === 'Identifier' &&
        node.callee.name === 'define';
}
;
function isRequireNodeWithArgs(node) {
    return node && node.type === 'CallExpression' &&
        node.callee && node.callee.type === 'Identifier' &&
        node.callee.name === 'require';
}
;
function locateModule(ast, locateUmd) {
    const topLevel = ast.program.body;
    return topLevel.map(function (node) {
        if (isDefineNodeWithArgs(node.expression) || isRequireNodeWithArgs(node.expression)) {
            return {
                isModule: true,
                rootAstNode: node,
                defineCall: node.expression
            };
        }
        else if (locateUmd) {
            const defineCall = locateUmdModule_1.default(node.expression);
            return {
                isModule: defineCall != null,
                rootAstNode: node,
                defineCall: defineCall
            };
        }
        else {
            return {
                isModule: false,
                rootAstNode: node,
                defineCall: null
            };
        }
    });
}
exports.default = locateModule;
;
//# sourceMappingURL=locateModules.js.map