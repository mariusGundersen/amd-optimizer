"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MissingModules {
    constructor() {
        this._q = [];
        this._map = new Map();
    }
    add(dependencies) {
        for (const dependency of dependencies) {
            if (this._map.has(dependency.name)) {
                return;
            }
            this._q.push(dependency.name);
            this._map.set(dependency.name, dependency);
        }
    }
    remove(name) {
        this._map.delete(name);
        this._q.splice(this._q.indexOf(name), 1);
    }
    isEmpty() {
        return this._q.length == 0;
    }
    has(name) {
        return this._map.has(name);
    }
    isMissing(name) {
        return !this._map.has(name);
    }
    map(cb) {
        return this._q.map(name => cb(this._map.get(name)));
    }
}
exports.default = MissingModules;
;
//# sourceMappingURL=MissingModules.js.map