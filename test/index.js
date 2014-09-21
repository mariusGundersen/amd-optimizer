var fs = require('fs');
var optimize = require('../index.js');
var assert = require('assert');

function loadFile(path, name){
  return {
    name: name,
    path: path,
    source: fs.readFileSync(path)
  };
}

describe("Basic dependency sorting", function(){
  var file = loadFile(__dirname + '/modules/test.js', 'test');

  var optimizer = optimize({
    baseUrl: 'modules'
  }, {
    umd: true
  });

  optimizer.on('dependency', function(dependency){
    optimizer.addFile(loadFile(__dirname + '/' + dependency.url, dependency.name))
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