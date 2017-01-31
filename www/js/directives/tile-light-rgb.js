/**
 * Created by bosc on 22/06/2015.
 */
'use strict';

angular.module('mangoPanel')
  .directive('tileLightRgb', function (HomFiConnect) {
    return {
      restrict: 'E',
      scope: true,
      replace: true,
      template: '' +
      '<div class="tile tile-sub-light-rgb">' +
      '   <div progress-circle ng-model="intensity" rgb-color="rgbColor" options="circleOptions">' +
      '       <div class="tile-circle-inner"></div>' +
      '   </div>' +
      '   <button ng-hide="device.states.on" class="button button-icon icon ion-android-bulb button-extra top right" ng-show="device.states.color" on-tap="toggle()" ng-class="{positive:intensity !== 0}"></button>' +
      '   <button ng-show="device.states.on" class="button button-icon icon ion-android-bulb button-extra top right" ng-show="device.states.on"  on-tap="toggle()" ng-class="{positive:on === 1}"></button>' +
      '   <div class="tile-title">{{device.name}}</div>' +
      '</div>',
      link: function postLink(scope, element) {
      },
      controller: function ($scope, $rootScope, $element, $location,Color) {
        $scope.rgbColor ={};

        $scope.$watch('device.states',function(){
          var hsv =  $scope.device.states.color.text.replace("hsv(", "").replace(")", "").split(',');
          if(hsv){
            var rgb = Color.convertHSVtoRGB(hsv[0], hsv[1], hsv[2]);
            $scope.rgbColor = { r:rgb[0], g : rgb[1], b :rgb[2]}
            if($scope.device.states.on && $scope.device.states.on.value ){
              $scope.on = $scope.device.states.on.value
            }
            $scope.intensity = 100 -  Color.convertRGBToCMYK({ r:rgb[0], g : rgb[1], b :rgb[2]}).k
          }


        },true);


        $scope.toggle = function(){
          HomFiConnect.execute($scope.device.states.color,  $scope.intensity === 0 ? 'on' : 'off');
        };

        $scope.intensity = 0;//%
        $scope.rgbColor = null;
        $scope.circleOptions = {
          color : 'rgba(255, 138, 101, 1)',//'#ff8a65',
          displayRgbPicker: true,
          displayTarget : true,
          gap: 30 * Math.PI / 180,//Deg to Rad
          onTouchCallback: function(targetPercent, tragetIndex,targetRGB){
            // TODO: Send tragetIndex as command et put real device scene index to $scope.sceneIndex
            if(!targetRGB) return;
            console.log(targetRGB)
            $scope.intensity = 100 -  Color.convertRGBToCMYK(targetRGB).k
            console.log()
            HomFiConnect.execute($scope.device.states.color,Color.convertRGBtoHSV(targetRGB));
          }
        }

      }
    }
  });
