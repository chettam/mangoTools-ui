/**
 * Created by jbblanc on 26/10/2016.
 */
'use strict';
angular.module('mangoPanel')
  .filter('secondsToDateTime', function() {
    return function(seconds) {
      var d = new Date(0,0,0,0,0,0,0);
      d.setSeconds(seconds);
      return d;
    };
  });
