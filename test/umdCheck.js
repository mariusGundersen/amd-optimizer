const fs = require('fs');
const parse = require('../source/parse');
const locateUmdDefine = require('../source/locateUmdModule')
const nameAnonymousModule = require('../source/nameAnonymousModule');
const print = require('../source/print');
const assert = require('assert');
const loadFile = require('./utils/loadFile');
const _ = require('lodash');

describe("UMD checking", function(){

  const cwd = __dirname;
  const base = cwd + '/umd/modules';
  const files = ['umd1', 'umd2', 'umd3', 'umd4', 'umd-bluebird'];

  files.forEach(function(name){
    it(name + " should have a named module", async function(){
      const fileName = name;
      const file = await loadFile({path: base + '/'+fileName+'.js', name: fileName}, base, cwd);

      const ast = parse(file);
      const define = locateUmdDefine(ast.program.body[0]);
      nameAnonymousModule(define, fileName);
      const result = print([ast.program.body[0]], fileName).code;
      assert.equal(result, fs.readFileSync(cwd + '/umd/namedModules/' + fileName + '.js').toString('utf8'));
    });
  });
});
