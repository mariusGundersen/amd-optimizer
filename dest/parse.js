"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recast = require("recast");
const stripBOM = require("strip-bom");
const slash = require("slash");
function parse(file) {
    console.log('parse', file.name);
    return recast.parse(stripBOM(file.contents), {
        sourceFileName: slash(file.name)
    });
}
exports.default = parse;
;
//# sourceMappingURL=parse.js.map