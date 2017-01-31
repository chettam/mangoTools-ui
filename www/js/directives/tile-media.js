/**
 * Created by bosc on 22/06/2015.
 *
 * Drive media server
 *  kind: mediaPlayer
 *
 * Mandatory states:
 * volume           Float       Between 0% and 100%
 * play             Boolean     0: Pause, 1: Play
 *
 * Optional states:
 *
 */
'use strict';


angular.module('mangoPanel')
  .directive('tileMedia', function ($ionicGesture, $ionicSlideBoxDelegate, $ionicPosition, $timeout, $interval, HomFiConnect,Color) {
    return {
      restrict: 'E',
      scope: true,
      replace: true,
      template: '' +
      '<div class="tile tile-sub-light-dimmer">' +
      '   <div progress-circle options="circleOptions" ng-model="device.states[\'volume\'].value">' +
      '       <div class="tile-circle-inner">' +
      '           <div class="button-full">' +
      '               <button ng-hide="displayVolume" class="button-clear button-click button-center energized" on-tap="togglePlay()"><i ng-show="device.states[\'play\'].value ===0" class="icon ion-play"></i><i ng-show="device.states[\'play\'].value ===1" class="icon ion-pause"></i></button>' +
      '               <button ng-show="displayVolume" class="button-clear button-click button-center energized">{{volume}} % </button>'+
      '           </div>' +
      '       </div>' +
      '   </div>' +
      '   <button class="button button-text button-extra top left" on-tap="mute()"><i ng-show="device.states[\'mute\'].value ===0" class="icon ion-volume-medium"></i><i ng-show="device.states[\'mute\'].value ===1" class="icon ion-volume-mute"></i></button>' +
      '   <button class="button button-text button-extra top right" ui-sref="musicPlayer({deviceId :device._id})"><i class="icon ion-more"></i></button>' +
      '   <button class="button button-text button-extra bottom left" on-tap="previous()" ><i class="icon ion-ios-rewind"></i></button>' +
      '   <button class="button button-text button-extra bottom right" on-tap="next()"><i class="icon ion-ios-fastforward"></i></button>' +
      '   <div class="tile-title">{{displayedtitle}}</div>' +
      '</div>',
      link: function postLink(scope, element) {
      },
      controller: function ($scope) {

        $scope.circleOptions = {
          color : Color.energized,//'#ff8a65',
          displayTarget : true,
          gap: 30 * Math.PI / 180,//Deg to Rad
          step:$scope.device.step,
          min: $scope.device.states['min'] ? parseInt($scope.device.states['min'].value) : 0,
          max: $scope.device.states['max'] ? parseInt($scope.device.states['max'].value) : 100,
          onTouchCallback: function(targetPercent){
            $scope.displayVolume = true;
            $scope.volume = targetPercent;
          },
          onReleaseCallback: function(targetPercent){
            HomFiConnect.execute($scope.device.states['volume'], $scope.volume);
            $scope.displayVolume = false;
            $scope.$apply();
          }
        };


        HomFiConnect.execute($scope.device.states.queue);

        $scope.togglePlay =function(){
          HomFiConnect.execute($scope.device.states.play, $scope.device.states.play.value ? 0:1);
        };

        $scope.previous =function(){
          HomFiConnect.execute($scope.device.states.previous);
        };

        $scope.next =function(){
          HomFiConnect.execute($scope.device.states.next);
        };

        $scope.mute = function(){
          HomFiConnect.execute($scope.device.states.mute, $scope.device.states.mute.value?0:1);
        }

        $scope.$watch('device.states',function(){

          if($scope.device.name){
            var msg = "";

            if($scope.device.states.currentArtist && $scope.device.states.currentArtist.text){
              if(msg.length!==0) { msg += " - "; }
              msg += $scope.device.states.currentArtist.text;
            }

            if($scope.device.states.currentAlbum && $scope.device.states.currentAlbum.text){
              if(msg.length!==0) { msg += " - "; }
              msg += $scope.device.states.currentAlbum.text;
            }

            if($scope.device.states.currentTitle && $scope.device.states.currentTitle.text){
              if(msg.length!==0) { msg += " - "; }
              msg += $scope.device.states.currentTitle.text;
            }

            if(msg.length === 0){
              $scope.device.name;
            }
            $scope.setTitle(msg);
          }

          $scope.volume = $scope.device.states.volume.value;


        },true);

        ////// Text slider section

        $scope.textSliderLength = 16;
        $scope.textSliderMsg = "";
        $scope.textSliderMsgTmp = "";
        $scope.textSliderPos = 0;

        $scope.setTitle = function(newTitle){
          if(newTitle && $scope.textSliderMsg!==newTitle) {
            $scope.textSliderPos = 0;
            $scope.textSliderMsg = newTitle;
            $scope.textSliderMsgTmp = $scope.textSliderMsg + " - " + $scope.textSliderMsg;

            if($scope.textSlider)
              $interval.cancel($scope.textSlider);

            $scope.textSlider = $interval(function () {
              if($scope.textSliderMsg.length<$scope.textSliderLength){
                $scope.displayedtitle = $scope.textSliderMsg;
                return;
              }
              if ($scope.textSliderPos >= $scope.textSliderMsg.length + 3)
                $scope.textSliderPos = 0;
              else if ($scope.textSliderPos == 0) {
              }
              $scope.displayedtitle = $scope.textSliderMsgTmp.substring($scope.textSliderPos, $scope.textSliderPos + $scope.textSliderLength);
              $scope.textSliderPos++;
            }, 400);
          }
        }



      }
    }
  });
