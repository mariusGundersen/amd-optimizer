const fs = require('fs');
const optimize = require('../dest/index.js').default;
const assert = require('assert');
const loadFile = require('./utils/loadFile');
const _ = require('lodash');

describe("Basic dependency sorting", function(){

  const cwd = __dirname;
  const base = cwd + '/basic/modules';
  let output = ['add', 'test'];

  before(async function(){
    const optimizer = optimize({
      baseUrl: base
    }, {
      umd: true
    });

    optimizer.addFile(await loadFile({path: base + '/test.js', name: 'test'}, base, cwd));

    output = await optimizer.done(dep => loadFile(dep, base, cwd));
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
