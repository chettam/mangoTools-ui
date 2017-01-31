/**
 * Created by bosc on 22/06/2015.
 */
'use strict';

angular.module('mangoPanel')
    .directive('tileSmokeAlarm', function (Color) {
        return {
            restrict: 'E',
            scope: true,
            replace: true,
            template: '' +
            '<div class="tile tile-smoke-alarm">' +
            '   <div progress-circle options="circleOptions" ng-color="colorValue" on-tap="forTesting()">' +
            '       <div class="tile-circle-inner">' +
            '           <div class="button-full ">' +
            '               <i class="main-icon ion" ng-class="{\'ion-no-smoking balanced\': (mode===\'ok\'), \'ion-fireball assertive\': (mode===\'alarm\'), \'ion-wrench energized\': (mode===\'service\')}"></i>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '   <div class="tile-title">{{device.name}}</div>' +
            '</div>',
            link: function postLink(scope, element) {
            },
            controller: function ($scope, $rootScope, $element, $location) {

                $scope.mode = 'ok';
                $scope.colorValue = Color.balanced;

                $scope.circleOptions = {
                    //color : '#4db6ac',
                    disable: true
                }

                $scope.forTesting = function(){
                    if($scope.mode === 'ok'){
                        $scope.mode = 'alarm';
                        $scope.colorValue = Color.assertive;
                    }
                    else if($scope.mode === 'alarm'){
                        $scope.mode = 'service';
                        $scope.colorValue = Color.energized;
                    }
                    else if($scope.mode === 'service'){
                        $scope.mode = 'ok';
                        $scope.colorValue = Color.balanced;
                    }
                }
            }
        }
    });
