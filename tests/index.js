var fs = require('fs');
var optimize = require('../index.js');

function loadFile(path, name){
  return {
    name: name,
    path: path,
    source: fs.readFileSync(path)
  };
}

var file = loadFile(__dirname+"/modules/test.js", "test");

var optimizer = optimize({
  baseUrl: 'modules'
});

optimizer.on('dependency', function(dependency){
  optimizer.addFile(loadFile(dependency.url, dependency.name))
});

optimizer.addFile(file);

var output = optimizer.optimize();

console.log(output.reduce(function(code, module){
  return code + "\n" + module.code;
}, ""));