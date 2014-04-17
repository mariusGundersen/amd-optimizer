var parse = require('./source/parse');
var locateModules = require('./source/locateModules');
var findDependencies = require('./source/findDependencies');
var nameAnonymousModule = require('./source/nameAnonymousModule');
var print = require('./source/print');
var requirejs = require('requirejs');

var fs = require('fs');

var context = requirejs({});

var file = parse({
  name: "test",
  source: "define(['a'], function(a){return function(b){ return a(b, 2); }; })",
  path: __dirname+"/test.js"
});

var modules = locateModules(file).modules.map(function(module){
  var dependencies = findDependencies(module.expression).map(function(dependency){
    return context.toUrl(dependency + '.js');
  });
  
  nameAnonymousModule(module.expression, file.name);
  
  return print(module);
  
});

console.log(modules);