/**
 * Created by jbblanc on 23/09/2016.
 */

angular.module('mangoPanel')
  .factory('imageLocator',['Status', function(Status){
    return {
      url: function (path) {
        if (path !== '../../img/default.png') {
          return 'http://'+Status.getHomFiController().host+':'+Status.getHomFiController().port+ path;
        } else {
          return path
        }
      }
    }

  }]);
