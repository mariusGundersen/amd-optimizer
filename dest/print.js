"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recast_1 = require("recast");
function default_1(source, name, initialSourceMap) {
    console.log('print', source);
    return recast_1.print(recast_1.types.builders.program(source), {
        sourceMapName: name + '.js',
        inputSourceMap: initialSourceMap || null
    });
}
exports.default = default_1;
;
//# sourceMappingURL=print.js.map