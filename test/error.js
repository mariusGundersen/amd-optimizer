const assert = require('assert');
const optimize = require('../dest/index.js').default;
describe("handle error", function(){


  it("should throw an error when the file is undefined", function(){
    const optimizer = optimize({
      baseUrl: '.'
    });

    assert.throws(() => optimizer.addFile());
  });

  it("should throw an error when the file is missing contents", function(){
    const optimizer = optimize({
      baseUrl: '.'
    });

    assert.throws(() => optimizer.addFile({}));
  });

  it("should throw an error when the file is missing name", function(){
    const optimizer = optimize({
      baseUrl: '.'
    });

    assert.throws(() => optimizer.addFile({contents: 'blabla'}));
  });

  it("should throw an error when the file is missing relative", function(){
    const optimizer = optimize({
      baseUrl: '.'
    });

    assert.throws(() => optimizer.addFile({contents: 'blabla', name: 'blabla'}));
  });

  it("should throw an error when loadFile rejects", async function(){
    const optimizer = optimize({
      baseUrl: '.'
    });

    optimizer.addFile({contents: 'define(["file"], function(){})', name: 'dummy', relative: 'dummy.js'});

    try{
      const result = await optimizer.done(() => Promise.reject(new Error('oh noes')));
    }catch(e){
      assert.ok(true);
    }
  });
});
