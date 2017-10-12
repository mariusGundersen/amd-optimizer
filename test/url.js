const fs = require('fs');
const optimize = require('../index.js');
const assert = require('assert');
const loadFileFromFakeNet = require('./utils/loadFileFromFakeNet');
const _ = require('lodash');
const path = require('path');
const url = require('url');

describe("Load through HTTP", function(){

  const cwd = __dirname;
  const base = 'http://url/basic/modules';
  let output = ['add', 'test'];

  before(async function(){
    const optimizer = optimize({
      baseUrl: base
    }, {
      umd: true
    });

    const file = await loadFileFromFakeNet({path: base + '/test.js', name: 'test'}, base, cwd);
    optimizer.addFile(file);

    output = await optimizer.done(dep => loadFileFromFakeNet(dep, base, cwd));
  });

  it("should have 2 items", function(){
    assert.equal(output.length, 2);
  });

  it("should have the test last", function(){
    assert.equal(output[1].name, 'test');
  });

  output.forEach(function(name){
    it(name + " should have a named module", function(){
      assert.equal(_.where(output, {name:name})[0].content, fs.readFileSync(cwd + '/basic/namedModules/' + name + '.js').toString('utf8'));
    });
  });
});
