/**
 * Created by bosc on 22/06/2015.
 */
'use strict';

angular.module('mangoPanel')
    .directive('tileHeating', function ($ionicGesture, $ionicSlideBoxDelegate, $ionicPosition,HomFiConnect, Color) {
        return {
            restrict: 'E',
            scope: true,
            replace: true,
            template: '' +
            '<div class="tile tile-heating">' +
            '   <div progress-circle position="currentMode.value" options="circleOptions" display-inner-selector="heatingModes[currentMode.value] && heatingModes[currentMode.value].manual">' +
            '       <div class="tile-circle-inner">' +
            '           <div class="inside-square">' +
            '               <div ng-hide="displayModeName"><div class="target">{{targetTemperature}}&deg;</div><div class="current">{{currentTemperature}}&deg;</div></div>' +
            '               <div ng-show="displayModeName" class="mode balanced">{{displayMode.name}}</div>' +
            '           </div>' +
            '           <div ng-show="heatingModes[currentMode.value] && heatingModes[currentMode.value].manual" class="button-top"><button class="button-clear button-click" on-tap="onButtonTop()" on-hold="onButtonLongTop()" on-release="onButtonTopRelease()"><i class="icon icon-4x ion-arrow-up-b"></i></button></div>' +
            '           <div ng-show="heatingModes[currentMode.value] && heatingModes[currentMode.value].manual" class="button-bottom"><button class="button-clear button-click" on-tap="onButtonBottom()" on-hold="onButtonLongBottom()"  on-release="onButtonBottomRelease()"><i class="icon icon-4x ion-arrow-down-b"></i></button></div>' +
            '       </div>' +
            '   </div>' +
            '   <button class="button button-text button-extra top left" on-tap="goAutoMode()" ng-class="{positive: device.states.mode.value === 1}">A</button>' +
            '   <div class="tile-title">{{device.name}}</div>' +
            '</div>',
            link: function postLink(scope, element) {

            },
            controller: function ($scope, $rootScope, $element, $location) {


                $scope.heatingModes = {

                  0 : {  name : 'fully automatic',manual : false},
                  1 : {  name : 'full automatic heating',manual : false},
                  2 : {  name : 'full automatic cooling',manual : false},
                  3 : {  name : 'automatic heating',manual : false},
                  4 : {  name : 'automatic cooling',manual : false},
                  5 : {  name : 'manual heating',manual : true},
                  6 : {  name : 'manual cooling',manual : true},
                };
                $scope.serviceModes = {
                  0 : 'Off',
                  1 : 'heating and cooling off',
                  2 : 'heating on, cooling off',
                  3 : 'heating off cooling on',
                  4 : 'heating and cooling on'
                };

                // _.forEach($scope.device.states,function(state){
                //     if(state.execute && typeof state.value ==='string' && state.value.match(/^\d$/)){
                //         $scope.heatingModes[state.value] = state;
                //     }
                //     if(state.execute && typeof state.value ==='string'&& state.value.match(/^service*$/)){
                //         $scope.serviceModes[state.value] = state;
                //     }
                //
                // });

                $scope.$watch('device.states',function(){
                    $scope.currentTemperature = Math.round($scope.device.states.instantTemp.value * 10) / 10;
                    $scope.targetTemperature = Math.round($scope.device.states.targetTemp.value * 10) / 10;
                    $scope.currentMode = $scope.device.states.mode
                },true);


                // index dans l'array mode bind� sur la position dans progress circle
                $scope.selectedModeIndex = 0;

                // Booleen pour afficher le mode courant lorsque l'utilisateur appuis sur le progress-circle
                $scope.displayModeName = false;



                // Configuration du progress-circle
                $scope.circleOptions = {
                    color : Color.positive,
                    positions : $scope.heatingModes,
                    gap: 30 * Math.PI / 180,//Deg to Rad
                    onTouchCallback: function(targetPercent, targetItem, targetContent){
                        $scope.displayModeName = true;
                        $scope.displayMode = targetContent;
                        $scope.targetItem = targetItem;

                        $scope.modeName = $scope.heatingModes[parseInt(targetItem)].name;
                    },
                    onReleaseCallback: function(){
                      HomFiConnect.execute($scope.device.states.mode,parseInt($scope.targetItem));
                        $scope.displayModeName = false;
                        $scope.$apply();
                    }
                };

                $scope.goAutoMode = function(){
                  HomFiConnect.execute($scope.device.states.mode,0);
                };

                //incrementer la consigne de temperature. Function active seulement sur les modes manuels
                $scope.onButtonTop = function(){
                    var target = parseFloat($scope.targetTemperature.value) + 0.5;
                  HomFiConnect.execute($scope.device.states.targetTemp,target.toString());
                };

                //decrementer la consigne de temperature. Function active seulement sur les modes manuels
                $scope.onButtonBottom = function(){
                    var target = parseFloat($scope.targetTemperature.value) - 0.5;
                  HomFiConnect.execute($scope.device.states.targetTemp,target.toString());
                };

                // Bloc de desactivation des fonction du parent sur les actions locales
                var button = $element.find("button");

                var activeParent = function(event){ $(event.currentTarget).parent().addClass("activated"); $ionicSlideBoxDelegate.enableSlide( false );};
                var desactiveParent = function(event){ $(event.currentTarget).parent().removeClass("activated"); $ionicSlideBoxDelegate.enableSlide( true );};

                $ionicGesture.on('touch', activeParent, button);
                $ionicGesture.on('release', desactiveParent, button);
                // Fin du bloc
            }
        }
    });
