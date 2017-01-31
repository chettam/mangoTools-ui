/**
 * Created by jbblanc on 21/08/2015.
 */

angular.module('mangoPanel')
  .factory('Update',['$ionicDeploy','$rootScope',function($ionicDeploy,$rootScope){

    return {
      start : function(){
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
              if(isUpdate){
                swal("Update in progress!", "Please wait while the upgrade complete.", "success");
                $ionicDeploy.download().then(function() {
                  return $ionicDeploy.extract().then(function() {
                    return $ionicDeploy.load();
                  });
                });
              }
            });
          } 
        });
      }
    }


  }]);
