var fs = require('fs');
var optimize = require('../index.js');
var assert = require('assert');
var File = require('vinyl');

describe("Basic dependency sorting", function(){
  
  var cwd = __dirname;
  var base = cwd + '/modules';
  
  
  var file = loadFile(__dirname + '/modules/test.js', base, cwd);

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
    assert.equal(5, output.length);
  });
  
  it("should have the test last", function(){
    assert.equal('test', output[4].name);
  });
  
  output.forEach(function(actual){
    it(actual.name + " should have a named module", function(){
      assert.equal(actual.code, fs.readFileSync(__dirname + '/namedModules/' + actual.name + '.js').toString('utf8'));
    });
  });
});

function loadFile(path, base, cwd){
  return new File({
    path: path,
    cwd: cwd,
    base: base,
    contents: fs.readFileSync(path)
  });
}