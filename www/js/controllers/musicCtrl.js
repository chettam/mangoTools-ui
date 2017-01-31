/**
 * Created by tokwii on 9/15/16.
 */

'use strict';

angular.module('mangoPanel')
  .controller('MusicCtrl',[ '$scope','HomFiConnect','Color','$stateParams','Config','$state', function ($scope,HomFiConnect,Color,$stateParams,Config,$state) {


    $scope.timeFormat = 'HH:mm';
    $scope.dateFormat = 'd MMM yyyy';


    if($stateParams.hasOwnProperty('deviceId')){
      $scope.device = Config.devices[$stateParams.deviceId];
      console.log($scope.device)
    } else {
      $state.go('main');
    }


    $scope.circleOptions = {
      color : Color.energized,//'#ff8a65',
      displayTarget : true,
      gap: 30 * Math.PI / 180,//Deg to Rad
      step:$scope.device.step || 1,
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
    };

    $scope.repeat = function(){
      HomFiConnect.execute($scope.device.states.repeat);
    };

    $scope.shuffle = function(){
      HomFiConnect.execute($scope.device.states.shuffle);
    };

    $scope.trackSeek = function(index){
      HomFiConnect.execute($scope.device.states.trackSeek, index +1 );
    };

    $scope.timeSeek = function(value){
      HomFiConnect.execute($scope.device.states.timeSeek, value );
    };
    
    $scope.goBack = function(){
      $state.go('index')
    };

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
      }
      $scope.currentProgress = $scope.device.states.currentProgressFormatted.text;
      if($scope.device.states.play.value ===1){
        $scope.startProgress();
      } else {
        $scope.stopProgress();
      }
      $scope.volume = $scope.device.states.volume.value;


    },true);
    
    $scope.progress = {};
    
    $scope.startProgress = function(){
      $scope.progress = setInterval(function(){
        $scope.currentProgress += 1;
      }, 1000);
    };

    $scope.stopProgress = function(){
      clearInterval($scope.progress);
    }

  }]);

