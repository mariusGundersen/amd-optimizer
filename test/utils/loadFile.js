var fs = require('fs');
var File = require('vinyl');

module.exports = function loadFile(dependency, base, cwd){
  return new Promise((res, rej) => fs.readFile(dependency.path, function(err, contents){
    if(err) return rej(err);

    var file = new File({
      path: dependency.path,
      cwd: cwd,
      base: base,
      contents: contents
    });
    file.name = dependency.name;
    res(file);
  }));
}