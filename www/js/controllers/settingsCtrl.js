/**
 * Created by jbblanc on 20/08/2015.
 */



angular.module('mangoPanel')
  .controller('SettingsCtrl',[ '$scope','$rootScope','$state','Wifi','$ionicPopup','Status','$ionicModal','$window','$ionicDeploy', function ($scope,$rootScope,$state,Wifi,$ionicPopup,Status,$ionicModal,$window,$ionicDeploy) {

    $scope.panel = Status.getPanel();
    $scope.homFiController = Status.getHomFiController();
    $scope.isUpdating = false;


    $scope.homeEdit = function(){
      $state.go('homFiController')
    };


    $ionicModal.fromTemplateUrl('views/updateRequired.html', {
      scope: $scope
    }).then(function(updateModal) {
      $scope.updateModal = updateModal;
    });

    $rootScope.$on('version:update',function() {

    });

    $scope.reset =function(){
      $window.location.reload(true)
    };


    Wifi.ssid(function(ssid){
      $scope.wifi = ssid;
    });


    $scope.wifiEdit =function() {
      if(typeof cordova.plugins.settings.openSetting != undefined){
        cordova.plugins.settings.openSetting("wifi", function(){
            console.log("opened wifi settings")
          },
          function(){
            console.log("failed to open wifi settings")
          });
      }
    };

    $scope.timeEdit =function() {
      if(typeof cordova.plugins.settings.openSetting != undefined){
        cordova.plugins.settings.openSetting("date", function(){
            console.log("opened date settings")
          },
          function(){
            console.log("failed to open date settings")
          });
      }
    };

    // Check Ionic Deploy for new code
    $scope.checkForUpdates = function() {
      $ionicDeploy.check().then(function(hasUpdate) {
        if(hasUpdate){
          swal({
            title: 'Panel Update !',
            text: "An update is available",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Update now!'
          }, function(isUpdate){
            if(isUpdate) {
              swal("Update in progress!", "Please wait while the upgrade complete.", "success");
              $ionicDeploy.download().then(function () {
                return $ionicDeploy.extract().then(function () {
                  return $ionicDeploy.load();
                });
              });
            }
          });
        } else {
          swal("No Update available!", "awesome new features coming soon ! stay put", "success");
        }

      }, function(err) {
        swal("No Update available!", "awesome new features coming soon ! stay put", "success");
        console.error('Ionic Deploy: Unable to check for updates', err);
      });
    }


  }]);
