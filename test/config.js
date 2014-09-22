var fs = require('fs');
var optimize = require('../index.js');
var assert = require('assert');
var File = require('vinyl');

describe("require config", function(){

  var cwd = __dirname;
  var base = cwd + '/config/src';
  
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

  optimizer.addFile(loadFile({path: base + '/main.js', name: 'main'}, base, cwd));

  var output = optimizer.optimize();
  it("should have 2 items", function(){
    assert.equal(output.length, 2);
  });
  
  it("should have jQuery first", function(){
    assert.equal(output[0].name, 'jQuery');
  });
  
  it("should have main last", function(){
    assert.equal(output[1].name, 'main');
  });
  
  it("should name the jQuery module correctly", function(){
    assert.equal(output[0].content, fs.readFileSync(cwd + '/config/bin/jQuery.js').toString('utf8'));
  });
  
  it("should put the right name on the sourcemap for the main file", function(){
    assert.equal(output[1].map.file, 'main.js');
    assert.equal(output[1].map.sources[0], 'main.js');
  });
  
  it("should put the right name on the sourcemap for the jQuery file", function(){
    assert.equal(output[0].map.file, 'jQuery.js');
    assert.equal(output[0].map.sources[0], '../lib/jQuery.js');
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