/**
 * Created by bosc on 22/06/2015.
 *
 * Drive RGB Light device
 *  kind: alarm
 * Mandatory states:
 * value                Integer         Get alarm status - 0: Off, 1: On
 * active               Integer         Set alarm status - 0: Off, 1: On
 *
 * Optional states:
 *  delay               Trigger         Start countdown for delayed alarm on
 *                      Integer         Countdown value
 */
'use strict';

angular.module('mangoPanel')
    .directive('tileAlarm', function (Color) {
        return {
            restrict: 'E',
            scope: true,
            replace: true,
            template: '' +
            '<div class="tile tile-alarm">' +
            '   <div progress-circle options="circleOptions" ng-color="color">' +
            '       <div class="tile-circle-inner">' +
            '           <div class="button-full">' +
            '               <button ng-hide="remainingTime !== undefined" class="button-clear button-click button-center energized" on-hold="arm()" on-tap="toggleValue()">{{device.states.active.value?\'Armed\':\'Disarmed\'}}</button>' +
            '               <button ng-show="remainingTime !== undefined" class="button-clear button-click button-center energized" on-hold="arm()" on-tap="toggleValue()"> Arming in {{remainingTime}} sec</button>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '   <div class="tile-title">{{device.name}}</div>' +
            '</div>',
            link: function postLink(scope, element) {
            },
            controller: function ($scope, $rootScope, $element, $location) {

                $scope.$watch('device.states.armed',function(){
                    switch(Number($scope.device.states.armed)){
                        case 0: // disarmed
                            $scope.color = Color.royal;// Bleu si désactivée
                            break;
                        case 1: // Armed
                            $scope.color = Color.energized;// Orange si activée
                            break;
                        //case 2: // In alarm
                        //    $scope.color = Color.assertive;// Rouge si en alarme
                        //    break;
                    }
                },true);

                $scope.$watch('device.states.delay',function(){
                    if($scope.device.states.delay.value > 0) {
                        $scope.remainingTime = Math.round($scope.device.states.delay.value);
                    } else {
                        delete $scope.remainingTime;
                    }
                },true);


                $scope.circleOptions = {
                    disable: true
                };

                $scope.arm = function(){
                    HomfiConnect.execute($scope.device.states.active, 1);
                };



                $scope.toggleValue = function(){
                    if((!$scope.device.states.armed.value && !$scope.remainingTime) || ($scope.device.states.armed.value === 0 && !$scope.remainingTime)){
                        if($scope.device.states.delay){
                            HomfiConnect.execute($scope.device.states.delay);//LoxSocket.sendCmd($scope.device.uuidAction,'delayedon');
                        } else{
                            HomfiConnect.execute($scope.device.states.active, 1);//LoxSocket.sendCmd($scope.device.uuidAction,'on');
                        }
                    } else {
                        HomfiConnect.execute($scope.device.states.active, 0);//LoxSocket.sendCmd($scope.device.uuidAction,'off');
                    }
                };
            }
        }
    });
