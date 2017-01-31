/**
 * Created by jbblanc on 20/08/2015.
 */

'use strict';

angular.module('mangoPanel')
  .controller('HeaderCtrl',[ '$scope','$rootScope','$state','$ionicPopup','Status','Config', '$timeout', 'HomFiConnect','$window', function ($scope,$rootScope,$state,$ionicPopup,Status,Config, $timeout, HomFiConnect,$window) {


    $scope.setting = false;
    $scope.noRoom = false;
    $scope.panel = Status.getPanel();
    $scope.homFiController = Status.getHomFiController();

    $rootScope.$on('panel',function(){
      $scope.panel = Status.getPanel();
      $scope.homFiController = Status.getHomFiController();
    });

    $scope.connect = function(){
      HomFiConnect.start();
    };

    $scope.room = Status.getCurrentRoom();

    $scope.callStatus = $scope.panel.callStatus;

    $rootScope.$on('intercom:call',function(){
      $scope.callStatus = $scope.panel.callStatus;
    });

    $scope.intercomEnabled =  $scope.panel.intercom;

    $rootScope.$on('intercom:current',function(){
      $scope.intercomEnabled =  $scope.panel.intercom;
    });


    $rootScope.$on('room:current',function(){
      $scope.room = Status.getCurrentRoom();
    });
    //
    $rootScope.$on('state:subMenu',function(){
      $scope.setting = true;
    });



    $scope.showPhone = function(){
      if($state.current.name !=='intercom'){
        $state.go('intercom');
      } else {
        $state.go('index');
      }
    };

    /**
     * Ask the user to select a new room in a room selector
     */
    $scope.changeRoom = function() {
      if($state['current'].name === 'index'){
        if (Config.rooms && _.isEmpty(Config.rooms)) {
          swal("No room available!", "Please check that your are connected to the HomFi Core", "error")
        } else{
          $state.go('roomSelector');
        }
      } else {
        $state.go('index');
      }

    };

    $rootScope.$on('$stateChangeSuccess',function(){
      if($state['current'].name === 'screenSaver' || $state['current'].name === 'musicPlayer' ||$state['current'].name === 'musicPlaylist'){
        $scope.showHeader = false
      }
      else if($state['current'].name === 'lockScreen'){
        $scope.showHeader = false
      } else {
        $scope.showHeader = true
      }


      $scope.callStatus = $scope.panel.callStatus;
      if($state.current.name ==='settings' || $state.current.name ==='font' || $state.current.name ==='intercom' || $state.current.name ==='doorPanel' || $state.current.name ==='info' || $state.current.name ==='subMenu'  || $state.current.name ==='homFiController' || $state.current.name ==='wifi' || $state.current.name ==='room'){
        $scope.setting = true;
      } else {
        $scope.setting = false;
      }
    });



    $scope.showStatus =function() {

      swal({
        title: "Panel Status.",
        text:'<div> <h4>Panel SN : '+$scope.homFiController.serial +'</h4></div>'+
        '<div> <h4>Core Address : '+$scope.homFiController.host +':'+$scope.homFiController.port +'</h4></div>'+
        '<div class="row"><p class="text-center"><i class="ion-ios-bolt"></i> Connected : '+$scope.homFiController.connected+'</p></div> '+
        '<div class="row"><pc lass="text-center"><i class="ion-ios-videocam"></i> Intercom Enabled : '+$scope.panel.intercom+'</p></div> '+

        '</div>' ,
        //text: 'Panel Serial number :' +$scope.homFiController.serial,
        type: "success",
        showCancelButton: true,
        cancelButtonText : "OK",
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Reset Switch",
        closeOnConfirm: true,
        html: true
      }, function(){
        swal("ok!", "Switch Resetting!", "success");
        $window.location.reload(true)
      });
    };

    $scope.showSettings =function() {
      switch($state.current.name) {
        case 'index':
          $state.go('settings');
          break;
        case 'settings':
          $state.go('index');
          break;
        case 'wifi':
          $state.go('settings');
          break;
        case 'homFiController':
          $state.go('settings');
          break;
        case 'room':
          $state.go('settings');
          break;
        case 'subMenu':
          $state.go('index');
          break;
        case 'info':
          $state.go('index');
          break;
        case 'doorPanel':
          $state.go('index');
          break;
        case 'intercom':
          $state.go('index');
          break;
        case 'roomSelector':
          $state.go('index');
          break;
        default:
          //$state.go('settings');
          //$scope.setting = false;
      }


    };

  }]);
