/**
 * Created by jbblanc on 21/08/2015.
 */
'use strict';

angular.module('mangoPanel')
    .controller('ScreenSaverCtrl',[ '$scope','$rootScope','$interval','$timeout','Status','$state', 'Config', function ($scope,$rootScope,$interval,$timeout,Status,$state, Config) {

        $scope.panel = Status.getPanel();

        $rootScope.$on('panel',function(){
            $scope.panel = Status.getPanel();
        });

        $scope.opacity = 0;
        $scope.targetOpacity = 0;
        var opacityTimeoutFunction = function(){
            if($scope.opacity<$scope.targetOpacity){
                $scope.opacity = $scope.opacity + 0.05;
                if($scope.opacity>$scope.targetOpacity){
                    $scope.opacity=$scope.targetOpacity
                }
            }
            else if($scope.opacity>$scope.targetOpacity){
                $scope.opacity = $scope.opacity - 0.05;
                if($scope.opacity<$scope.targetOpacity){
                    $scope.opacity=$scope.targetOpacity
                }
            }

            if($scope.targetOpacity!==$scope.opacity){
                $scope.opacityTimeout = $timeout(opacityTimeoutFunction,100);
            }else{
                $scope.opacityTimeout = null;
            }
        };

       /* var screenSaver = setInterval(function(){
            light.getLightState(function(state){
                if(state !== 0){
                    if($scope.meanState === undefined){
                        $scope.meanState = [state];
                    }
                    else{
                        if($scope.meanState.length>10){ // Mean on 10 sec
                            $scope.meanState = $scope.meanState.splice(0,1);
                        }
                        $scope.meanState.push(state);
                    }

                    if($scope.meanState.length>5){
                        var mean = 0;

                        for(var i=0; i<$scope.meanState.length; i++){
                            mean+=$scope.meanState[i];
                        }
                        mean = mean / $scope.meanState.length;
                        if(mean <= 90){
                            $scope.targetOpacity = 0.7
                        } else if( mean > 90 &&  mean <= 120){
                            $scope.targetOpacity = 0.60
                        } else {
                            $scope.targetOpacity = 0;
                        }

                        if(!$scope.opacityTimeout && $scope.targetOpacity!==$scope.opacity){
                            $scope.opacityTimeout = $timeout(opacityTimeoutFunction,100);
                        }
                    }
                }
            });
        },  2000);*/

        /*$rootScope.$on('$stateChangeSuccess',function(){
            if($state.current.name !== 'screenSaver'){
                $scope.opacity = 0;
                clearInterval(screenSaver);
            }
        });*/

        var defaultRoom = $scope.panel.room;

        if(defaultRoom){
            // Get default room media player if exists
             var mediaplayers = _.filter(Config.devices, function(device) {
                return  device.kind === 'mediaPlayer' && device.room._id === defaultRoom._id;
            });

            if(mediaplayers.length > 1){
                $scope.mediaPlayer = _.find(mediaplayers, function(device) {
                    if (device.states && device.states.play && device.states.play.value){
                        return true;
                    }
                    return  false;
                });

                if(!$scope.mediaPlayer) $scope.mediaPlayer = mediaplayers[0];
            }
            else if(mediaplayers.length === 1){
                $scope.mediaPlayer = mediaplayers[0];
            }

            var heating = _.filter(Config.devices, function(device) {
                return  device.infoOnly === true && device.kind === 'slider' && device.room._id === defaultRoom._id && device.states.hasOwnProperty('value') && device.states.value.format ==='%.1f°';
            });
            if(heating === 1){
              $scope.heating= heating[0];
              $scope.temp =$scope.heating.states.value.format ? StringFormat.format($scope.heating.states.value.format,[$scope.heating.states.value.value || 0]) : $scope.heating.states.value.value;
            }
        }

        $scope.circleOptions = {
            color : 'rgba(191, 63, 127, 0.5)',
            size : 950,
            lineWidth : 2,
            disable : false
        };
        $scope.timeFormat = 'HH:mm';
        $scope.dateFormat = 'EEEE d MMMM yyyy';

    }]);
