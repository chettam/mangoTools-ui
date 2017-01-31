/**
 * Created by bosc on 22/06/2015.
 *
 * Drive Shutter
 *  kind: shutters
 *
 * Mandatory states:
 * fullup           Boolean     Move until value 0 or fully up
 * fulldown         Boolean     Move until value 0 or fully down
 * up               Trigger     Move one step up
 * down             Trigger     Move one step down
 *
 * Optional states:
 * shade            Trigger     Move to shade position
 * autoAllowed      ReadOnly    Is automatic mode availlable
 * auto             Boolean     Set automatic mode on or off
 */
'use strict';

angular.module('mangoPanel')
    .directive('tileShutters', function ($ionicGesture, $ionicSlideBoxDelegate, $ionicPosition, HomFiConnect) {
        return {
            restrict: 'E',
            scope: true,
            replace: true,
            template: '' +
            '<div class="tile tile-shutters">' +
            '   <div progress-circle options="circleOptions" ng-model="position">' +
            '       <div class="tile-circle-inner">' +
            '           <div class="inside-square">' +
            '               <div>{{position}}%</div>' +
            '           </div>' +
            '           <div ng-hide="device.states.auto.value === 1 || (position ===0)" class="button-top"><button class="button-clear button-click" on-tap="onButtonTop()" on-hold="onButtonLongTop()" on-release="onButtonTopRelease()"><i class="icon icon-4x ion-arrow-up-b"></i></button></div>' +
            '           <div ng-hide="device.states.auto.value === 1 || (position ===100)" class="button-bottom"><button class="button-clear button-click" on-tap="onButtonBottom()" on-hold="onButtonLongBottom()"  on-release="onButtonBottomRelease()"><i class="icon icon-4x ion-arrow-down-b"></i></button></div>' +
            '       </div>' +
            '   </div>' +
            '   <button ng-show="autoAvailable"   class="button button-icon icon ion-navicon-round button-extra top right" on-tap="onShadeMode()" ng-class="{positive:device.states.shade.value === 1}"></button>' +
            '   <button ng-show="autoAvailable" class="button button-text button-extra top left" on-tap="onAutoMode()" ng-class="{positive: device.states.auto.value === 1}">A</button>' +
            '   <div class="tile-title">{{device.name}}</div>' +
            '</div>',
            link: function postLink(scope, element) {

                // Prepare element for being inserted in Ionic SlideBox
                // This is needed otherwise dragging sub-element will also move the slidebox.

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

                // Set auto mode availlable flag
                $scope.autoAvailable = !_.isEmpty($scope.device.states.autoAllowed);

                // On value update, update displayed position
                $scope.$watch('device.states',function(){
                    $scope.position =  Math.ceil($scope.device['states']['position'].value *100)
                },true);

                // progress-circle directive options
                $scope.circleOptions = {
                    color : 'rgba(77, 182, 172, 0.6)',//'#4db6ac'
                    targetColor: 'rgba(77, 182, 172, 0.4)',
                    vertical: true,                     //
                    rotate : 1,                         //
                    displayTarget: false,               // Display target value and current value or current value only
                    hasExtraButtons: true,              // May display extra buttons arround the circle (reduce touch area)
                    disable: true                       // No touch input on circle
                };

                // Shortcut to disable automatic mode
                var disableAutoMode = function (){
                    if($scope.device.states.auto) HomFiConnect.execute($scope.device.states.auto, 0);
                };



                $scope.onButtonTop = function(){
                    if($scope.device.states['position'].value > 0) {
                        if($scope.device['states'].up.value === 1){
                            HomFiConnect.execute($scope.device.states.up, 0); //LoxSocket.sendCmd($scope.device.uuidAction,'fulldown');
                        } else if($scope.device['states'].fullup) {
                            disableAutoMode();
                            HomFiConnect.execute($scope.device.states.fullup, 1); //LoxSocket.sendCmd($scope.device.uuidAction,'fullup');
                        }

                    }
                };
                $scope.onButtonBottom = function(){
                    if($scope.device.states['position'].value < 1) {
                        if($scope.device.states.down.value === 1){
                            HomFiConnect.execute($scope.device.states.down, 0); //    LoxSocket.sendCmd($scope.device.uuidAction,'fullup');
                        }else {
                            disableAutoMode();
                            HomFiConnect.execute($scope.device.states.fulldown, 1); //    LoxSocket.sendCmd($scope.device.uuidAction,'fulldown');
                        }

                    }
                };

                $scope.longPress= false;

                $scope.onButtonLongTop = function(){
                    if($scope.device.states['position'].value > 0) {
                        disableAutoMode();
                        HomFiConnect.execute($scope.device.states.up, 1); //LoxSocket.sendCmd($scope.device.uuidAction,'up');
                        $scope.longPress = true
                    }
                };
                $scope.onButtonTopRelease = function(){
                    if($scope.longPress ===true){
                        HomFiConnect.execute($scope.device.states.up, 0); //LoxSocket.sendCmd($scope.device.uuidAction,'upoff');
                        $scope.longPress = false;
                    }
                };

                $scope.onButtonBottomRelease = function(){
                    if($scope.longPress ===true){
                        HomFiConnect.execute($scope.device.states.down, 0); //LoxSocket.sendCmd($scope.device.uuidAction,'downoff');
                        $scope.longPress = false;
                    }

                };

                $scope.onButtonLongBottom = function(){
                    if($scope.device.states['position'].value < 1) {
                        disableAutoMode();
                        HomFiConnect.execute($scope.device.states.down, 1); //LoxSocket.sendCmd($scope.device.uuidAction,'down');
                        $scope.longPress= true

                    }
                };

                // Move the shutter to Shade position.
                $scope.onShadeMode = function(){
                    // Optionaly available
                    if(!$scope.device.states.shade)
                        return;
                    HomFiConnect.execute($scope.device.states.shade,1); //LoxSocket.sendCmd($scope.device.uuidAction,'shade');
                };

                // Toggle automatic mode
                $scope.onAutoMode = function(){

                    // Optionaly available
                    if(!$scope.device.states.auto)
                        return;

                    // May be temporary unavailable
                    if($scope.device.states.autoAllowed && $scope.device.states.autoAllowed.value === 0)
                        return;

                    // Toggle
                    HomFiConnect.execute($scope.device.states.auto, $scope.device.states.auto.value !== 0 ? 0 : 1); //LoxSocket.sendCmd($scope.device.uuidAction,'auto');
                };

            }
        }
    });
