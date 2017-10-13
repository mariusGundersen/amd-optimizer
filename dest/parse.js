"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recast = require("recast");
const stripBOM = require("strip-bom");
const slash = require("slash");
function parse(file) {
    return recast.parse(stripBOM(file.contents), {
        sourceFileName: slash(file.relative)
    });
}
exports.default = parse;
;
//# sourceMappingURL=parse.js.map