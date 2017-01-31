/**
 * Created by jbblanc on 22/08/2015.
 */


angular.module('mangoPanel')
  .controller('HomFiCtrl',[ '$scope','Status','$state','HomFiConnect','Config', function ($scope,Status,$state,HomFiConnect,Config) {
        $scope.homFiController = Status.getHomFiController();

        $scope.saveHomFiController = function(){
            if($scope.homFiController.authToken) delete $scope.homFiController.authToken;
            if($scope.homFiController.token) delete $scope.homFiController.token;
            if($scope.homFiController.connection) $scope.homFiController.connection = false;
            Status.setHomFiController($scope.homFiController);
            Status.setPanel({});
            Status.setCurrentRoom({});
            Config.reset();
            HomFiConnect.start();
            $state.go('settings');
        }

  }]);
