var fs = require('fs');
var url = require('url');
var path = require('path');
var File = require('vinyl');

module.exports = async function loadFileFromFakeNet(dependency, base, cwd){
  var urlStr = dependency.path;
  var parsedUrl = url.parse(urlStr);
  var filePath = path.join(cwd, parsedUrl.pathname);
  return new Promise((res, rej) => fs.readFile(filePath, function(err, contents){
    if(err) return rej(err);

    var file = new File({
      path: filePath,
      cwd: cwd,
      base: base,
      contents: contents
    });
    file.name = dependency.name;
    res(file);
  }));
}
