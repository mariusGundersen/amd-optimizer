// This script is based on test/basic.js
var fs = require('fs');
var optimize = require('../index.js');
var assert = require('assert');
var loadFile = require('./utils/loadFile');
var _ = require('lodash');
var path = require('path');
var url = require('url');

describe("Extenson bug", function(){

  var cwd = __dirname;
  var base = cwd + '/extensionBug/modules';
  var output = ['knockout', 'knockout.validation', 'lib', 'root'];

  before(function(done){
    var optimizer = optimize({
      baseUrl: base,
      paths: {
        'knockout.validation': 'bower_components/knockout.validation',
        'knockout': 'bower_components/knockout'
      }
    }, {
      umd: true
    });

    optimizer.on('dependency', function(dependency){
      loadFile(dependency, base, cwd, optimizer.addFile.bind(optimizer));
    });

    loadFile({path: base + '/root.js', name: 'root'}, base, cwd, function(file){
      optimizer.addFile(file);

      loadFile({path: base + '/bower_components/knockout.js', name: 'knockout'}, base, cwd, function(file){
        optimizer.addFile(file);

        loadFile({path: base + '/bower_components/knockout.validation.js', name: 'knockout.validation'}, base, cwd, function(file){
          optimizer.addFile(file);

          optimizer.done(function(optimized){
            output = optimized;

            done();
          });
        });
      });
    });
  });

  it("should have all 4 items", function(){
    assert.equal(output.length, 4);
  });

  it("should have the root last", function(){
    assert.equal(output[3].name, 'root');
  });

  output.forEach(function(name){
    it(name + " should have a named module", function(){
      assert.equal(_.where(output, {name:name})[0].content, fs.readFileSync(cwd + '/extensionBug/namedModules/' + name + '.js').toString('utf8'));
    });
  });
});
