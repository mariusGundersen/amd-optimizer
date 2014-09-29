define(['add', 'umd1', 'umd2', 'umd3'], function(add){
  return function(a){
    return add(a, 2);
  };
});