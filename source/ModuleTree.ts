import * as toposort from 'toposort';
import { Module, File } from './types';

export default class ModuleTree {
  private modules : Map<string, Module>;
  constructor(){
    this.modules = new Map<string, Module>();
  }

  defineModule(name : string, source : {}, dependencies : string[], file : File){
    const module = this.modules.get(name);
    if(module){
      module.source.push(source);
    }else{
      this.modules.set(name, {
        name,
        source: [source],
        dependencies,
        file
      });
    }
  }

  has(name : string){
    return this.modules.has(name);
  }

  isMissing(name : string){
    return !this.has(name);
  }

  leafToRoot(){
    const edges : [string, string][] = [];
    const nodes : string[] = [];

    for(const [name, module] of this.modules){
      if(module.dependencies.length > 0){
        edges.push(...module.dependencies.map(dep => [name, dep] as [string, string]));
      }
      nodes.push(name);
    }

    return toposort.array(nodes, edges)
    .reverse()
    .filter(name => this.modules.has(name))
    .map(name => this.modules.get(name) as Module);
  }

};