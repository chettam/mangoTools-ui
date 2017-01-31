/**
 * Created by bosc on 22/06/2015.
 *
 * Drive Vertical two button device
 *  kind: buttonUpDown
 * Mandatory states:
 * trigUp               Trigger     Send up event
 * trigDown             Trigger     Send down event
 *
 * Optional states:
 * up                   Boolean     Set up action on/off
 * down                 Boolean     Set down action on/off
 */
'use strict';

angular.module('mangoPanel')
    .directive('tileUpDownButton', function ($ionicGesture, $ionicSlideBoxDelegate, $ionicPosition, HomFiConnect, Color) {
        return {
            restrict: 'E',
            scope: true,
            replace: true,
            template: '' +
            '<div class="tile tile-up-down-button">' +
            '   <div progress-circle options="circleOptions" ng-model="position">' +
            '       <div class="tile-circle-inner">' +
            '           <div class="button-top"><button class="button-clear button-click" on-tap="onButtonUp()" on-hold="onButtonLongUp()" on-release="onButtonUpRelease()"><i class="ion-arrow-up-b"></i></button></div>' +
            '           <div class="button-bottom"><button class="button-clear button-click" on-tap="onButtonDown()" on-hold="onButtonLongDown()"  on-release="onButtonBottomRelease()"><i class="ion-arrow-down-b"></i></button></div>' +
            '       </div>' +
            '   </div>' +
            '   <div class="tile-title">{{device.name}}</div>' +
            '</div>',
            link: function postLink(scope, element) {

                var buttonBottom = element.find(".button-bottom > .button-click");
                var buttonTop = element.find(".button-top > .button-click");

                var activeParent = function(event){
                    $(event.currentTarget).parent().addClass("activated");
                    $ionicSlideBoxDelegate.enableSlide( false );
                };
                var desactiveParent = function(event){
                    $(event.currentTarget).parent().removeClass("activated");
                    $ionicSlideBoxDelegate.enableSlide( true );
                };

                $ionicGesture.on('touch', activeParent, buttonTop);
                $ionicGesture.on('release', desactiveParent, buttonTop);
                $ionicGesture.on('touch', activeParent, buttonBottom);
                $ionicGesture.on('release', desactiveParent, buttonBottom);


            },
            controller: function ($scope, $rootScope, $element, $location) {

                // Configure progress-circle
                $scope.circleOptions = {
                    color : Color.positive,
                    disable: true
                };

                $scope.onButtonUp =function(){
                    if($scope.device.states.trigUp)
                        HomFiConnect.execute($scope.device.states.trigUp);
                };

                $scope.onButtonDown =function(){
                    if($scope.device.states.trigDown)
                        HomFiConnect.execute($scope.device.states.trigDown);
                };

                $scope.onButtonLongUp =function(){
                    if($scope.device.states.up)
                        HomFiConnect.execute($scope.device.states.up, 1);//LoxSocket.sendCmd($scope.actuator.uuidAction,'upon');
                    else
                        HomFiConnect.execute($scope.device.states.trigUp);
                };
                $scope.onButtonLongDown =function(){
                    if($scope.device.states.down)
                        HomFiConnect.execute($scope.device.states.down, 1);//LoxSocket.sendCmd($scope.actuator.uuidAction,'downon');
                    else
                        HomFiConnect.execute($scope.device.states.trigDown);
                };

                $scope.onButtonUpRelease =function(){
                    if($scope.device.states.up)
                        HomFiConnect.execute($scope.device.states.up, 0);//LoxSocket.sendCmd($scope.actuator.uuidAction,'upoff');
                };

                $scope.onButtonBottomRelease =function(){
                    if($scope.device.states.down)
                        HomFiConnect.execute($scope.device.states.down, 0);//LoxSocket.sendCmd($scope.actuator.uuidAction,'downoff');
                };
            }
        }
    });
