function test(e){
  if("object"==typeof exports&&"undefined"!=typeof module)
    module.exports=e();
  else if("function"==typeof define&&define.amd)
    define("umd-bluebird", [], e);
  else{
    window.Promise=e()
  }
}