/**
 * Created by bosc on 26/10/2015.
 */
'use strict';

angular.module('mangoPanel')
    .controller('RoomSelectorCtrl',[ '$scope','$rootScope','$state','$ionicSlideBoxDelegate', 'Status','Config', function ($scope,$rootScope,$state,$ionicSlideBoxDelegate,Status,Config) {

        var tempRooms = {};
        $scope.roomPages = [];
        $rootScope.$broadcast('state:roomSelector');
        $scope.initRoomPages = function(){

            $scope.roomPages = [];

            if(Config.rooms && !_.isEmpty(Config.rooms)){
                var k = 0, j = 0, i = 1;
                var sortedRooms = _.sortByOrder(Config.rooms, ['name'], ['asc', 'desc'])
                _.forEach(sortedRooms, function(room){
                    if($scope.roomPages[j] === undefined) $scope.roomPages[j] = [];
                    if($scope.roomPages[j][k] === undefined) $scope.roomPages[j][k] = [];
                    $scope.roomPages[j][k].push(room);
                    if( i % 3 === 0) k++;
                    if( k >= 3){
                        j++; k=0;
                    }
                    i++;
                });
                // Need update the slider when data come from ajax
                $ionicSlideBoxDelegate.update();
            }

            $scope.slideIndex = 0;
            $scope.activeSlide = 0;
            $ionicSlideBoxDelegate.update();
        };

        $scope.selectRoom = function(room){
            Status.setCurrentRoom(room);
            $rootScope.$broadcast('room:current');
            $state.go('index');
        };

        $scope.initRoomPages();


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

