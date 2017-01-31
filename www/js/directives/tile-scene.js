/**
 * Created by bosc on 22/06/2015.
 */
'use strict';

angular.module('mangoPanel')
    .directive('tileScene', function ($ionicGesture, $ionicSlideBoxDelegate, $ionicPosition, $timeout, Color, HomFiConnect) {
        return {
            restrict: 'E',
            scope: true,
            replace: true,
            template: '' +
            '<div class="tile tile-lighting">' +
            '   <div progress-circle position="selectedSceneValue.value" options="circleOptions" ng-get-text="getTileText()"></div>' +
            '   <button class="button button-icon icon ion-android-bulb button-extra top right" ng-show="subDevices.length" on-tap="onSubMenu()"></button>' +
            '   <div class="tile-title">{{device.name}}</div>' +
            '</div>',
            link: function postLink(scope, element) {

            },
            controller: function ($scope, $rootScope, $element, $location) {
                $scope.stateScene ={};
                $scope.tempDevices =[];
                $scope.currentScene ={};
                $scope.subDevices =[];


                $scope.getTileText = function(){
                    if(!$scope.isCustom){
                        var ret = $scope.targetSceneName;
                        if(ret){
                            return ret;
                        }
                        else if(!ret &&  $scope.currentScene){
                            return $scope.currentScene;
                        }
                    }
                    return 'Custom';
                };

                function switchScene(key){
                    $scope.currentScene = $scope.scenes[key];
                    $scope.isCustom = (key===-1);
                }


                // Set the list of sub devices
                var j = 0, i = 1;
                _.forEach($scope.device.subDevice,function(device){
                    if($scope.subDevices[j] === undefined) $scope.subDevices[j] = [];
                    $scope.subDevices[j].push(device);
                    if( i % 3 === 0) j++;
                    i++
                });

                // Set the list of the scenes
                $scope.scenes = {};
                if($scope.device['states'] && $scope.device['states'].sceneList) {

                    var scenes =  $scope.device['states'].sceneList.text.replace(/"/g, "").split(',');

                    _.forEach(scenes,function(scene){
                        var splitScene = scene.split('=');
                        $scope.scenes[splitScene[0]] =splitScene[1];
                    });
                    $scope.scenes[0] = 'Off';
                    $scope.scenes[9] = 'On';
                }
                $scope.selectedSceneValue = $scope.device['states']['activeScene'];

                $scope.$watch('selectedSceneValue',function(){
                    switchScene($scope.selectedSceneValue.value);

                },true);


                $scope.selectScene = function(key){
                    HomFiConnect.execute( $scope.device['states']['scene'],key);
                };


                $scope.sceneIndex = 0;//%

                $scope.circleOptions = {
                    color : Color.positive,
                    targetColor : 'rgba(149,117,205, 0.3)',//'#9575cd',
                    positions : $scope.scenes,
                    gap: 30 * Math.PI / 180,//Deg to Rad
                    hasExtraButtons: true,
                    onTouchCallback: function(targetPercent, targetKey){
                        // Send tragetIndex as command et put real device scene index to $scope.sceneIndex
                        if($scope.targetSceneDeleteTimer){
                            $timeout.cancel($scope.targetSceneDeleteTimer);
                        };


                        $scope.targetSceneName = $scope.scenes[targetKey];
                        $scope.targetSceneKey = targetKey;

                    },
                    onReleaseCallback: function(){
                        if($scope.targetSceneKey!==undefined){
                            $scope.selectScene(Number($scope.targetSceneKey));
                            $scope.targetSceneDeleteTimer = $timeout(function(){
                                delete $scope.targetSceneName;
                                delete $scope.targetSceneKey;
                                delete $scope.targetSceneDeleteTimer;
                            }, 500);
                        }
                    },
                    button:true,
                    buttonCallback: function(){
                        //console.log("Central button pressed");
                        // Send tragetIndex as command et put real device scene index to $scope.sceneIndex
                        if($scope.targetSceneDeleteTimer){
                            $timeout.cancel($scope.targetSceneDeleteTimer);
                        }

                        if($scope.selectedSceneValue.value === 0){
                          $scope.selectScene(9);
                        } else {
                          $scope.selectScene(0);
                        }
                    }
                };

                $scope.onSwipeUp = function(){
                    if( $scope.stateScene.value <  Object.keys($scope.scenes).length - 1 ){
                        var key = $scope.stateScene.value + 1;
                        $scope.selectScene(key);
                    }

                };

                $scope.onSwipeDown = function(){
                    if( $scope.stateScene.value > 0 ){
                        var key = $scope.stateScene.value - 1;
                        $scope.selectScene(key);
                    }

                };

                $scope.onSubMenu = function(){
                    $scope.$emit('submenu');
                };

                var button = $element.find("button");

                var activeParent = function(event){ $(event.currentTarget).parent().addClass("activated"); $ionicSlideBoxDelegate.enableSlide( false );};
                var desactiveParent = function(event){ $(event.currentTarget).parent().removeClass("activated"); $ionicSlideBoxDelegate.enableSlide( true );};

                $ionicGesture.on('touch', activeParent, button);
                $ionicGesture.on('release', desactiveParent, button);

            }
        }
    });
