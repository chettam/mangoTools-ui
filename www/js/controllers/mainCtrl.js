/**
 * Created by jbblanc on 20/08/2015.
 */


'use strict';

angular.module('mangoPanel')
    .controller('MainCtrl',['$scope','$rootScope','$state','$ionicSlideBoxDelegate','Status','Config','Utils', 'HomFiUtils', function ($scope,$rootScope,$state,$ionicSlideBoxDelegate,Status,Config,Utils,HomFiUtils) {

        $scope.devices = [];

        $scope.initActuators = function(){


            $scope.devices.splice(0, $scope.devices.length);

            $scope.tempDevices =[];
            $scope.infoDevices = [];

            var getDevicesByRoom = function(){
                var room = Status.getCurrentRoom();
                var deviceList = [];
                _.forEach(Config.devices, function(device){
                    if(!device.room){
                        console.log('No room found');
                        console.log(device);
                    }
                    else if(device.room._id === room._id){
                        deviceList.push(device);
                    }
                });

                HomFiUtils.groupdSceneDevices(deviceList, function(deviceList){
                    _.forEach(deviceList,function(device){
                        if(device.infoOnly){
                            $scope.infoDevices.push(device)
                        } else {
                            $scope.tempDevices.push(device)
                        }
                    });

                    var j = 0, i = 1;
                    _.forEach(_.sortBy($scope.tempDevices, 'priority'),function(actuator){
                        if($scope.devices[j] === undefined) $scope.devices[j] = [];
                        $scope.devices[j].push(actuator);
                        if( i % 3 === 0) j++;
                        i++
                    });

                    if( $scope.infoDevices.length > 0){
                        var device = {
                            kind : 'info',
                            infoOnly : 'true',
                            devices :  $scope.infoDevices
                        };
                        if($scope.devices[j] === undefined) $scope.devices[j] = [];
                        $scope.devices[j].push(device);
                    }


                    $scope.slideIndex = 0;
                    $scope.activeSlide = 0;
                    $ionicSlideBoxDelegate.update();
                });

            };

            getDevicesByRoom();
        };
        $scope.initActuators();


        $rootScope.$on('room:current',function(){
            $scope.initActuators();
        });


        $scope.$on('submenu', function(event){
            Utils.setSubActuators(event.targetScope.subDevices);
            $state.go('subMenu');
        });

        $scope.slideIndex = 0;
        $scope.changeSlideIndex = function(index){
            $scope.slideIndex = index;
        };

        $scope.activeSlide = 0;
        $scope.selectSlider = function(index){
            $scope.activeSlide = index;
        };
        $scope.onNext = function(){
            $scope.activeSlide++;
        };
        $scope.onPrev = function(){
            $scope.activeSlide--;
        }
    }]);

