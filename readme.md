# amd-optimize

Find all the dependencies of one or more amd modules and sort them in the correct order, from leaf (module with no dependencies) to root (module which no other module depends on). This is an alternative to the official requireJS optimizer, but is designed as a library, not a stand alone application.

## Things it can do

  [OK] find dependencies of a module  
  [OK] name anonymous modules  
  [OK] sort modules from leaf to root  
  [OK] produce source-maps
  [OK] use config file, including path, map and package
  [OK] exclude modules and paths
  [  ] umd/iife declarations
  [  ] plugins