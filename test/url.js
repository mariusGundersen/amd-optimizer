// This script is based on test/basic.js
var fs = require('fs');
var optimize = require('../index.js');
var assert = require('assert');
var loadFileFromNet = require('./utils/loadFileFromNet');
var _ = require('lodash');
var http = require('http');
var path = require('path');
var connect = require('connect'); // add to write web server
var url = require('url');

describe("Load through HTTP", function(){

  var cwd = __dirname;
  var basePath = '/basic/modules';
  var base = 'http://127.0.0.1:18080' + basePath;
  var output = ['umd3', 'umd2', 'umd1', 'add', 'test'];

  // set-up and run web server
  before(function(done){
    // set-up server
    var app = connect();
    app.use(function(req, res, next){
      // pass only baseUrl
      if(req.url.indexOf(basePath) == 0) {
        fs.readFile(path.join(cwd, req.url.slice(1)), function(err, content){
          if(err) throw new Error("Error: can't read file");
          res.end(content);
        });
      }else{
        return next();
      }
    });

    // run server
    this.server = http.createServer(app).listen(18080, "127.0.0.1", function() {
      done();
    });
  });

  after(function() {
    this.server.close();
  });

  before(function(done){
    var optimizer = optimize({
      baseUrl: base
    }, {
      umd: true
    });

    optimizer.on('dependency', function(dependency){
      loadFileFromNet(dependency, base, cwd, optimizer.addFile.bind(optimizer));
    });

    loadFileFromNet({path: base + '/test.js', name: 'test'}, base, cwd, function(err, file){
      optimizer.addFile(err, file);

      optimizer.done(function(optimized){
        output = optimized;

        done();
      });
    });
  });

  it("should have 5 items", function(){
    assert.equal(output.length, 5);
  });

  it("should have the test last", function(){
    assert.equal(output[4].name, 'test');
  });

  output.forEach(function(name){
    it(name + " should have a named module", function(){
      assert.equal(_.where(output, {name:name})[0].content, fs.readFileSync(cwd + '/basic/namedModules/' + name + '.js').toString('utf8'));
    });
  });
});
