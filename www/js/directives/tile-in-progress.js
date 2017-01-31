/**
 * Created by bosc on 22/06/2015.
 */
'use strict';

angular.module('mangoPanel')
    .directive('tileInProgress', function () {
        return {
            restrict: 'E',
            scope: true,
            replace: true,
            template: '' +
            '<div class="tile tile-in-progress">' +
            '   <div progress-circle options="circleOptions">' +
            '       <div class="tile-circle-inner">' +
            '           <div class="button-full">' +
            '               {{device.type || device.detail.type || ""}}' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '   <div class="tile-title">{{device.name}}</div>' +
            '</div>',
            link: function postLink(scope, element) {

            },
            controller: function ($scope, $rootScope, $element, $location) {

                console.log($scope.device)


                $scope.circleOptions = {
                    disable: true,
                    color: '#eeeeee'
                }
            }
        }
    });
