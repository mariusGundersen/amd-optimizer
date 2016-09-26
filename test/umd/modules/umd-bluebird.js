function test(e){
  if("object"==typeof exports&&"undefined"!=typeof module)
    module.exports=e();
  else if("function"==typeof define&&define.amd)
    define([],e);
  else{
    window.Promise=e()
  }
}