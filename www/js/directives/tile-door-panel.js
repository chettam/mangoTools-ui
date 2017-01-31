/**
 * Created by bosc on 22/06/2015.
 */
'use strict';

angular.module('mangoPanel')
    .directive('tileDoorPanel', function ($ionicGesture, $ionicSlideBoxDelegate, $ionicPosition,$state,Utils) {
        return {
            restrict: 'E',
            scope: true,
            replace: true,
            template: '' +
            '<div class="tile tile-circle">' +
            '   <div progress-circle options="circleOptions">' +
            '       <div class="tile-circle-inner">' +
            '           <div class="button-full"><button class="button-clear button-click button-center" on-tap="onCall()"><i class="ion-ios-videocam"></i></button></div>' +
            '       </div>' +
            '   </div>' +
            '   <div class="tile-title">{{device.name}}</div>' +
            '</div>',
            link: function postLink(scope, element) {

                var buttonFull = element.find(".button-full > .button-click");

                var activeParent = function(event){ $(event.currentTarget).parent().addClass("activated"); };
                var desactiveParent = function(event){ $(event.currentTarget).parent().removeClass("activated"); };

                $ionicGesture.on('touch', activeParent, buttonFull);
                $ionicGesture.on('release', desactiveParent, buttonFull);
            },
            controller: function ($scope) {

                $scope.circleOptions = {
                    color : '#4db6ac',
                    disable : true
                };

                $scope.onCall = function(){
                    Utils.setDoorPanel($scope.device);
                    $state.go('doorPanel')
                };

            }
        }
    });
