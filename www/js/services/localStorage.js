/**
 * Created by jbblanc on 16/07/2015.
 */

angular.module('mangoPanel')
    .factory('$localStorage',['$window', function($window){

        return {
            set: function(key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            get: function(key) {
                return JSON.parse($window.localStorage[key] || '{}');
            }
        }
    }]);
