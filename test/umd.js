const fs = require('fs');
const optimize = require('../dest/index.js').default;
const assert = require('assert');
const loadFile = require('./utils/loadFile');
const _ = require('lodash');

describe("Naming umd modules", function(){

  const cwd = __dirname;
  const base = cwd + '/umd/modules';
  let output = ['umd1', 'umd2', 'umd3', 'umd4'];

  before(async function(){
    const optimizer = optimize({
      baseUrl: base
    }, {
      umd: true
    });

    const files = await Promise.all(output.map(name => loadFile({
        name: name,
        path: base+'/'+name+'.js'
      }, base, cwd)));

    for(const file of files){
      optimizer.addFile(file);
    }

    output = await optimizer.done(dep => loadFile(dep, base, cwd));
  });

  it("should have 4 items", function(){
    assert.equal(output.length, 4);
  });

  output.forEach(function(name){
    it(name + " should have a named module", function(){
      assert.equal(_.where(output, {name:name})[0].content, fs.readFileSync(cwd + '/umd/namedModules/' + name + '.js').toString('utf8'));
    });
  });
});
