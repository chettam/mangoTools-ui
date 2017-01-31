/**
 * Created by bosc on 22/06/2015.
 *
 *
 * Drive switch button device
 *
 * Mandatory states:
 *
 * Optional states:
 */
'use strict';

angular.module('mangoPanel')
    .directive('tileSwitch', function (HomFiConnect, Color) {
        return {
            restrict: 'E',
            scope: true,
            replace: true,
            template: '' +
            '<div class="tile tile-sub-light-switch">' +
            '   <div progress-circle options="circleOptions" ng-model="value">' +
            '       <div class="tile-circle-inner">' +
            '           <div class="button-full">' +
            '               <button class="button-clear button-click button-center energized" on-tap="toggleValue()">{{value === 1?\'On\':\'Off\'}}</button>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '   <div class="tile-title">{{device.name}}</div>' +
            '</div>',
            link: function postLink(scope, element) {
            },
            controller: function ($scope, $rootScope, $element, $location) {

                //console.log($scope.device);

              $scope.state = $scope.device.states.value;


                $scope.$watch('state',function(){
                    $scope.value = $scope.state.value
                },true);


                $scope.circleOptions = {
                    color : Color.calm,//'#4dd0e1',
                    disable: true
                };

                $scope.toggleValue = function(){
                    if( $scope.state.value === 0){
                        HomFiConnect.execute($scope.state,'on');
                    }else {
                        HomFiConnect.execute($scope.state,'off');
                    }
                };
            }
        }
    });
