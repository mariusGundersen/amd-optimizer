var fs = require('fs');
var optimize = require('../index.js');

var file = {
  name: "test",
  source: "define(['a'], function(a){return function(b){ return a(b, 2); }; })",
  path: __dirname+"/test.js"
};

var optimizer = optimize({});

optimizer.on('dependency', function(dependency){
  optimizer.addFile({
    name: dependency.name,
    source: "define(function(){return function(a, b){ return a+b; }; })",
    path: dependency.url
  })
});

optimizer.addFile(file);

var output = optimizer.optimize();

console.log(output);