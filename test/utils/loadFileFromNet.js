var http = require('http');
var File = require('vinyl');

module.exports = function loadFileFromNet(dependency, base, cwd, done){
  http.get(dependency.path, function(res){
    var file = new File({
      path: dependency.path,
      cwd: cwd,
      base: base
    });
    file.name = dependency.name

    res.on("data", function(contents){
      file.contents = contents;
    });

    res.on("end", function(err){
      done(null, file);
    });
  });
}
