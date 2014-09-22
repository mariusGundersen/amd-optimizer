var fs = require('fs');
var optimize = require('../index.js');
var assert = require('assert');
var File = require('vinyl');

describe("require config", function(){

  var cwd = __dirname;
  var base = cwd + '/config/src';
  
  
  var file = loadFile({path: base + '/main.js', name: 'main'}, base, cwd);
  
  var optimizer = optimize({
    baseUrl: base,
    paths: {
      jQuery: '../lib/jQuery'
    }
  }, {
    umd: true
  });

  optimizer.on('dependency', function(dependency){
    optimizer.addFile(loadFile(dependency, base, cwd))
  });

  optimizer.addFile(file);

  var output = optimizer.optimize();
  it("should have 2 items", function(){
    assert.equal(output.length, 2);
  });
  
  it("should have jQuery first", function(){
    assert.equal(output[0].name, '../lib/jQuery');
  });
  
  it("should have main last", function(){
    assert.equal(output[1].name, 'main');
  });
  
  it("should name the jQuery module correctly", function(){
    assert.equal(output[0].content, fs.readFileSync(cwd + '/config/bin/jQuery.js').toString('utf8'));
  });
});

function loadFile(dependency, base, cwd){
  var file = new File({
    path: dependency.path,
    cwd: cwd,
    base: base,
    contents: fs.readFileSync(dependency.path)
  });
  file.name = dependency.name;
  return file;
}