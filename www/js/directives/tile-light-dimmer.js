/**
 * Created by bosc on 22/06/2015.
 */
'use strict';

angular.module('mangoPanel')
    .directive('tileLightDimmer', function (HomFiConnect, Color) {
        return {
            restrict: 'E',
            scope: true,
            replace: true,
            template: '' +
            '<div class="tile tile-sub-light-dimmer">' +
            '   <div progress-circle options="circleOptions" ng-model="device.states[\'value\'].value">' +
            '       <div class="tile-circle-inner">' +
            '           <div class="button-full">' +
            '               <button class="button-clear button-click button-center energized" on-tap="toggleValue()">{{device.states[\'value\'].value?device.states[\'value\'].value+\'%\':\'Off\'}}</button>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '   <div class="tile-title">{{device.name}}</div>' +
            '</div>',
            link: function postLink(scope, element) {
            },
            controller: function ($scope) {

                $scope.circleOptions = {
                    color : Color.energized,//'#ff8a65',
                    displayTarget : true,
                    gap: 30 * Math.PI / 180,//Deg to Rad
                    step:$scope.device.step,
                    min: $scope.device.states['min'] ? parseInt($scope.device.states['min'].value) : 0,
                    max: $scope.device.states['max'] ? parseInt($scope.device.states['max'].value) : 100,
                    onTouchCallback: function(targetPercent, tragetIndex){
                        // TODO: Send tragetIndex as command et put real device scene index to $scope.sceneIndex
                        HomFiConnect.execute($scope.device.states['value'], targetPercent);
                    }

                };

                $scope.toggleValue = function(){
                    if(parseInt($scope.device.states['value'].value) !== 0){
                        //$scope.targetValue = 0;
                        HomFiConnect.execute($scope.device.states['value'],0);
                    } else {
                        //$scope.targetValue = $scope.targetValueBackup || $scope.circleOptions.max;
                        HomFiConnect.execute($scope.device.states['value'], parseInt($scope.device.states['max'].value || 100));
                    }
                };
            }
        }
    });
