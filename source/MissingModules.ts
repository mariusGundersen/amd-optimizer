import * as _  from 'lodash';
import { Dependency } from './types';

export default class MissingModules {
  private readonly _q : string[];
  private readonly _map : Map<string, Dependency>;
  constructor(){
    this._q = [];
    this._map = new Map<string, Dependency>();
  }

  add(dependencies : Dependency[]){
    for(const dependency of dependencies){
      if(this._map.has(dependency.name)){
        return;
      }
      this._q.push(dependency.name);
      this._map.set(dependency.name, dependency);
    }
  }

  remove(name : string){
    this._map.delete(name)
    this._q.splice(this._q.indexOf(name), 1);
  }

  isEmpty(){
    return this._q.length == 0;
  }

  has(name : string){
    return this._map.has(name);
  }

  isMissing(name : string){
    return !this._map.has(name);
  }

  map<T>(cb : (dep : Dependency) => T){
    return this._q.map(name => cb(this._map.get(name) as Dependency));
  }
};