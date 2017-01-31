/**
 * Created by bosc on 22/06/2015.
 *
 * Drive Push button device
 *  kind: buttonPush
 *
 * Mandatory states:
 *  trigEvent           Trigger     Send event
 *
 * Optional states:
 *  value               Boolean     State of the button
 */
'use strict';

angular.module('mangoPanel')
    .directive('tilePushButton', function (HomFiConnect, Color) {
        return {
            restrict: 'E',
            scope: true,
            replace: true,
            template: '' +
            '<div class="tile tile-push-button">' +
            '   <div progress-circle options="circleOptions" ng-color="color">' +
            '       <div class="tile-circle-inner">' +
            '           <div class="button-full">' +
            '               <button class="button-clear button-click button-center energized" on-tap="push()"><i class="icon ion-power"></i> </button>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '   <div class="tile-title">{{device.name}}</div>' +
            '</div>',
            link: function postLink(scope, element) {
            },
            controller: function ($scope, $rootScope, $element, $location) {

                $scope.$watch('states', function(){
                    if(!$scope.device.states && !$scope.device.states.value){
                        return;
                    }
                    switch($scope.device.states['value'].value){
                        case 0: // holiday mode off
                            $scope.color = Color.royal;// Bleu si désactivée
                            break;
                        case 1: // holiday mode on
                            $scope.color = Color.energized;// Orange si activée
                            break;


                    }
                },true);


                $scope.circleOptions = {
                    color : Color.calm,//'#4dd0e1',
                    disable: true
                };

                $scope.push = function(){
                    HomFiConnect.execute($scope.device.states.value); // LoxSocket.sendCmd($scope.actuator.uuidAction,'pulse');

                };
            }
        }
    });
