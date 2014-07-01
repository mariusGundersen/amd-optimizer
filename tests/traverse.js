var traverse = require('ast-traverse');
var fs = require('fs');
var ast = require("recast").parse(fs.readFileSync(process.argv[1]));

var indent = 0;
traverse(ast, {
  pre: function(node) {
    console.log(Array(indent + 1).join(" ") + node.type);
    indent += 4;
  },
  post: function() {
    indent -= 4;
  }
});