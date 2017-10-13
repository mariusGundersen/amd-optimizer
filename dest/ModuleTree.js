"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const toposort = require("toposort");
class ModuleTree {
    constructor() {
        this.modules = new Map();
    }
    defineModule(name, source, dependencies, sourceMap) {
        const module = this.modules.get(name);
        if (module) {
            module.source.push(source);
        }
        else {
            this.modules.set(name, {
                name,
                source: [source],
                dependencies,
                sourceMap
            });
        }
    }
    has(name) {
        return this.modules.has(name);
    }
    isMissing(name) {
        return !this.has(name);
    }
    leafToRoot() {
        const edges = [];
        const nodes = [];
        for (const [name, module] of this.modules) {
            if (module.dependencies.length > 0) {
                edges.push(...module.dependencies.map(dep => [name, dep]));
            }
            nodes.push(name);
        }
        return toposort.array(nodes, edges)
            .reverse()
            .filter(name => this.modules.has(name))
            .map(name => this.modules.get(name));
    }
}
exports.default = ModuleTree;
;
//# sourceMappingURL=ModuleTree.js.map