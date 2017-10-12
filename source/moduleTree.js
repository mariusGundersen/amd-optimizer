const toposort = require('toposort');

module.exports = class ModuleTree {
  constructor(){
    this.modules = new Map();
  }

  defineModule(name, source, dependencies, file){
    this.modules.set(name, {
      name: name,
      source: this.modules.has(name) ? this.modules.get(name).source.concat([source]) : [source],
      dependencies: dependencies,
      file: file
    });
  }

  has(name){
    return this.modules.has(name);
  }

  isMissing(name){
    return !this.has(name);
  }

  leafToRoot(){
    const edges = [];
    const nodes = [];

    for(const [name, module] of this.modules){
      if(module.dependencies.length > 0){
        edges.push(...module.dependencies.map(dep => [name, dep]));
      }
      nodes.push(name);
    }

    return toposort.array(nodes, edges)
    .reverse()
    .filter(name => this.modules.has(name))
    .map(name => this.modules.get(name));
  }

};