const fs = require('fs');
const optimize = require('../dest/index.js').default;
const assert = require('assert');
const loadFile = require('./utils/loadFile');

describe("files with windows slashes", function(){

  const cwd = __dirname;
  const base = cwd + '/slashes';
  let output = ['dep', 'multiple'];

  before(async function(){
    const optimizer = optimize({
      baseUrl: base
    });

    let file = await loadFile({path: base + '/dir/file.js', name: 'dir\\file'}, base, cwd);
    file.path = file.path.replace(/\//g, '\\');//force windows backwards path separator
    optimizer.addFile(file);

    file = await loadFile({path: base + '/dir/dep.js', name: 'dir\\dep'}, base, cwd);
    file.path = file.path.replace(/\//g, '\\');//force windows backwards path separator
    optimizer.addFile(file);

    output = await optimizer.done(m => Promise.reject('it should not fetch dependencies'));
  });

  it("should have 2 items", function(){
    assert.equal(output.length, 2);
  });

  it("should have the dep first", function(){
    assert.equal(output[0].name, 'dir/dep');
  });

  it("should have the correct name in the output", function(){
    assert.equal(output[0].content, fs.readFileSync(base+'/dir/namedDep.js', 'utf8'));
  });

  it("should have the multiple last", function(){
    assert.equal(output[1].name, 'dir/file');
  });

  it("should have the multiple last", function(){
    assert.equal(output[1].content, fs.readFileSync(base+'/dir/namedFile.js', 'utf8'));
  });
});