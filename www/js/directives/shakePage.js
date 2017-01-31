/**
 * Created by togunrek on 9/22/16.
 */


'use strict';
angular.module('mangoPanel')
  .directive('shakeThat', ['$animate', function ($animate) {
    return {
      require: '^?div',
      link: function (scope, element, attrs, div) {
        scope.$on('ERROR', function () {
          $animate.addClass(element, 'shakeScreen').then(function () {
            $animate.removeClass(element, 'shakeScreen');
          });
        });
      }
    };
  }]);
