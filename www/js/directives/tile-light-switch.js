/**
 * Created by bosc on 22/06/2015.
 */
'use strict';

angular.module('mangoPanel')
    .directive('tileLightSwitch', function (HomFiConnect, Color) {
        return {
            restrict: 'E',
            scope: true,
            replace: true,
            template: '' +
            '<div class="tile tile-sub-light-switch">' +
            '   <div progress-circle options="circleOptions" ng-model="value">' +
            '       <div class="tile-circle-inner">' +
            '           <div class="button-full">' +
            '               <button class="button-clear button-click button-center energized" on-tap="toggleValue()">{{value !== 0 ? \'On\' : \'Off\'}}</button>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '   <div class="tile-title">{{device.name}}</div>' +
            '</div>',
            link: function postLink(scope, element) {
            },
            controller: function ($scope, $rootScope, $element, $location) {

                $scope.$watch('device',function(){
                    if(!$scope.device) return;
                    $scope.value = parseInt($scope.device.states.value.value) * 100;
                },true);


                $scope.circleOptions = {
                    color : Color.calm,//'#4dd0e1',
                    disable: true
                };

                $scope.toggleValue = function(){
                    // TODO: Change to this:
                    HomFiConnect.execute($scope.device.states.value, parseInt($scope.device.states.value.value) ? 0 : 1);
                };
            }
        }
    });
