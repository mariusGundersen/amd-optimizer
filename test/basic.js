var fs = require('fs');
var optimize = require('../index.js');
var assert = require('assert');
var File = require('vinyl');

describe("Basic dependency sorting", function(){
  
  var cwd = __dirname;
  var base = cwd + '/basic/modules';
  
  
  var file = loadFile({path: base + '/test.js', name: 'test'}, base, cwd);

  var optimizer = optimize({
    baseUrl: base
  }, {
    umd: true
  });

  optimizer.on('dependency', function(dependency){
    optimizer.addFile(loadFile(dependency, base, cwd))
  });

  optimizer.addFile(file);

  var output = optimizer.optimize();
  it("should have 5 items", function(){
    assert.equal(output.length, 5);
  });
  
  it("should have the test last", function(){
    assert.equal(output[4].name, 'test');
  });
  
  output.forEach(function(actual){
    it(actual.name + " should have a named module", function(){
      assert.equal(actual.content, fs.readFileSync(cwd + '/basic/namedModules/' + actual.name + '.js').toString('utf8'));
    });
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