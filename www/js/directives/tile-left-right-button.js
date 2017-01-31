/**
 * Created by bosc on 22/06/2015.
 *
 * Drive Horizontal two button device
 *  kind: buttonLeftRight
 *
 * Mandatory states:
 * trigLeft         Trigger     Send left event
 * trigRight        Trigger     Send right event
 *
 * Optional states:
 * left             Boolean     Set left  action on/off
 * right            Boolean     Set right action on/off
 */
'use strict';

angular.module('mangoPanel')
    .directive('tileLeftRightButton', function ($ionicGesture, $ionicSlideBoxDelegate, $ionicPosition, HomFiConnect, Color) {
        return {
            restrict: 'E',
            scope: true,
            replace: true,
            template: '' +
            '<div class="tile tile-left-right-button">' +
            '   <div progress-circle options="circleOptions" ng-color="color">' +
            '       <div class="tile-circle-inner">' +
            '           <div class="button-left"><button class="button-clear button-click" on-tap="onButtonLeft()" on-hold="onButtonLongLeft()" on-release="onButtonLeftRelease()"><i class="ion-arrow-left-b"></i></button></div>' +
            '           <div class="button-right"><button class="button-clear button-click" on-tap="onButtonRight()" on-hold="onButtonLongRight()"  on-release="onButtonRightRelease()"><i class="ion-arrow-right-b"></i></button></div>' +
            '       </div>' +
            '   </div>' +
            '   <div class="tile-title">{{device.name}}</div>' +
            '</div>',
            link: function postLink(scope, element) {

                var buttonRight = element.find(".button-right > .button-click");
                var buttonLeft = element.find(".button-left > .button-click");

                var activeParent = function(event){
                    $(event.currentTarget).parent().addClass("activated");
                    $ionicSlideBoxDelegate.enableSlide( false );
                };
                var desactiveParent = function(event){
                    $(event.currentTarget).parent().removeClass("activated");
                    $ionicSlideBoxDelegate.enableSlide( true );
                };

                $ionicGesture.on('touch', activeParent, buttonLeft);
                $ionicGesture.on('release', desactiveParent, buttonLeft);
                $ionicGesture.on('touch', activeParent, buttonRight);
                $ionicGesture.on('release', desactiveParent, buttonRight);


            },
            controller: function ($scope, $rootScope, $element, $location) {

                // Configure progress-circle
                $scope.circleOptions = {
                    color : Color.royal,
                    disable: true
                };

                $scope.onButtonLeft =function(){
                    if($scope.device.states.trigLeft)
                        HomFiConnect.execute($scope.device.states.trigLeft);
                };

                $scope.onButtonRight =function(){
                    if($scope.device.states.trigRight)
                        HomFiConnect.execute($scope.device.states.trigRight);
                };

                $scope.onButtonLongLeft =function(){
                    if($scope.device.states.left)
                        HomFiConnect.execute($scope.device.states.left, 1);//LoxSocket.sendCmd($scope.actuator.uuidAction,'downon');
                    else if($scope.device.states.trigLeft)
                        HomFiConnect.execute($scope.device.states.trigLeft);
                };

                $scope.onButtonLongRight =function(){
                    if($scope.device.states.right)
                        HomFiConnect.execute($scope.device.states.right, 1);//LoxSocket.sendCmd($scope.actuator.uuidAction,'upon');
                    else
                        HomFiConnect.execute($scope.device.states.trigRight);
                };

                $scope.onButtonLeftRelease =function(){
                    if($scope.device.states.left)
                        HomFiConnect.execute($scope.device.states.left, 0);//LoxSocket.sendCmd($scope.actuator.uuidAction,'downoff');
                };

                $scope.onButtonRightRelease =function(){
                    if($scope.device.states.right)
                        HomFiConnect.execute($scope.device.states.right, 0);//LoxSocket.sendCmd($scope.actuator.uuidAction,'upoff');
                };
            }
        }
    });
