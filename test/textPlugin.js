const fs = require('fs');
const optimize = require('../index.js');
const assert = require('assert');
const loadFile = require('./utils/loadFile');
const _ = require('lodash');

describe.only("text plugin loading", function(){

  const cwd = __dirname;
  const base = cwd + '/textPlugin/modules';
  let output = ['add', 'test'];

  before(async function(){
    const optimizer = optimize({
      baseUrl: base
    }, {
      umd: true,
      plugins: {
        'text': async ({name, requiredBy}, load) => {
          const file = await load({name, requiredBy, path: name});
          console.log(file.contents.toString());
          file.contents = Buffer.from(`define(function(){\n  return '${file.contents.toString()}';\n})\n`, 'utf8');
          return file;
        }
      }
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
