"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recast_1 = require("recast");
function default_1(defineCall, filename) {
    if (defineCall.type === 'CallExpression') {
        if (defineCall.arguments.length > 0 && defineCall.arguments[0].type == 'Literal') {
            return defineCall.arguments[0].value;
        }
        else {
            if (defineCall.callee.name == 'define') {
                defineCall.arguments.unshift(recast_1.types.builders.literal(filename));
            }
            return filename;
        }
    }
    else if (defineCall.type === 'Identifier' && defineCall.parent.type === 'ConditionalExpression') {
        defineCall.parent['consequent'] = recast_1.types.builders.callExpression(recast_1.types.builders.memberExpression(recast_1.types.builders.identifier('define'), recast_1.types.builders.identifier('bind'), false), [
            recast_1.types.builders.literal(null),
            recast_1.types.builders.literal(filename)
        ]);
        return filename;
    }
}
exports.default = default_1;
;
//# sourceMappingURL=nameAnonymousModule.js.map