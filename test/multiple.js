const fs = require('fs');
const optimize = require('../dest/index.js').default;
const assert = require('assert');
const loadFile = require('./utils/loadFile');

describe("multiple file", function(){

  const cwd = __dirname;
  const base = cwd + '/multiple';
  let output = ['dep', 'multiple'];

  before(async function(){
    const optimizer = optimize({
      baseUrl: base
    });

    optimizer.addFile(await loadFile({path: base + '/multiple.js', name: 'multiple'}, base, cwd));
    output = await optimizer.done(m => Promise.reject('it should not fetch dependencies'));
  });

  it("should have 2 items", function(){
    assert.equal(output.length, 2);
  });

  it("should have the dep first", function(){
    assert.equal(output[0].name, 'dep');
  });

  it("should have the multiple last", function(){
    assert.equal(output[1].name, 'multiple');
  });
});