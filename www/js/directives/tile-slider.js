/**
 * Created by bosc on 22/06/2015.
 */
'use strict';

angular.module('mangoPanel')
    .directive('tileSlider', function (HomFiConnect, Color) {
        return {
            restrict: 'E',
            scope: true,
            replace: true,
            template: '' +
            '<div class="tile tile-sub-light-dimmer">' +
            '   <div progress-circle options="circleOptions" ng-model="value">' +
            '       <div class="tile-circle-inner">' +
            '           <div class="button-full">' +
            '               <button class="button-clear button-click button-center energized">{{value}}</button>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '   <div class="tile-title">{{device.name}}</div>' +
            '</div>',
            link: function postLink(scope, element) {
            },
            controller: function ($scope) {
                $scope.$watch('device.states',function(){
                    $scope.value = $scope.device.states.value.value
                },true);


                $scope.circleOptions = {
                    color : Color.energized,//'#ff8a65',
                    displayTarget : false,
                    gap: 30 * Math.PI / 180,//Deg to Rad
                    step:$scope.device.details.step,
                    min: $scope.device.details.min,
                    max: $scope.device.details.max,
                    onTouchCallback: function(targetPercent, tragetIndex){
                        // TODO: Send tragetIndex as command et put real device scene index to $scope.sceneIndex si target index = curent value
                        HomFiConnect.execute($scope.device.states.value,targetPercent);

                    }

                };

            }
        }
    });
