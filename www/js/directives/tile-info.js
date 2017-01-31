/**
 * Created by bosc on 22/06/2015.
 */
'use strict';

angular.module('mangoPanel')
    .directive('tileInfo', function (Color,Utils,$state) {
        return {
            restrict: 'E',
            scope: true,
            replace: true,
            template: '' +
            '<div class="tile tile-info tile-push-button">' +
            '   <div progress-circle options="circleOptions" ng-color="color">' +
            '       <div class="tile-circle-inner">' +
            '           <div class="button-full">' +
            '               <button class="button-clear button-click button-center energized" on-tap="showInfo()"><i class="icon ion-information"></i> </button>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '   <div class="tile-title">Information</div>' +
            '</div>',
            link: function postLink(scope, element) {
            },
            controller: function ($scope) {

                $scope.circleOptions = {
                    color : Color.calm,//'#4dd0e1',
                    disable: true
                };

                $scope.showInfo = function(){
                    Utils.setRoomInfo($scope.device.devices);
                    $state.go('info');
                }

            }
        }
    });
