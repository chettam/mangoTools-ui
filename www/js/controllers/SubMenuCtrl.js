/**
 * Created by jbblanc on 20/08/2015.
 */
'use strict';

angular.module('mangoPanel')
    .controller('SubMenuCtrl',[ '$scope','$rootScope', '$ionicSlideBoxDelegate', '$state', 'Utils', function ($scope,$rootScope,$ionicSlideBoxDelegate,$state,Utils) {
        $rootScope.$broadcast('state:subMenu');
        $scope.subDevices = Utils.getSubActuators();

        // Changement de room
        $rootScope.$on('room:current',function(){
            Utils.setSubActuators(undefined);
            $state.go('index');
        });



        // Gestion du slider
        $scope.slideIndex = 0;
        $scope.activeSlide = 0;
        $ionicSlideBoxDelegate.update();
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

