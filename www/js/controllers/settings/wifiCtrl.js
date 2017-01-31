/**
 * Created by jbblanc on 22/08/2015.
 */


angular.module('mangoPanel')
    .controller('WifiCtrl',[ '$scope','Wifi', function ($scope,Wifi) {

        $scope.wifi = {};

        Wifi.availableNetworks(function(err,networkList){
            $scope.networkList = networkList;
        });

        $scope.defaultNetwork =  "Choose Wireless network";

        $scope.refreshWifi = function(){
            Wifi.availableNetworks(function(err,networkList){
                $scope.networkList = networkList;
            });
        };

        Wifi.ssid(function(ssid){
            $scope.wifi.network = ssid;
        });

        $scope.wifiEdit = function() {

          swal({
            title: "<h3>Wifi</h3>",
            text:'<div><h4>Pick your wifi network</h4></div>'+
            '<div ng-repeat="network in networkList"><ion-radio  on-tap="setWifi(network.SSID) ">{{network.SSID}}</ion-radio> </div>',
            type: "success",
            showCancelButton: true,
            cancelButtonText : "cancel",
            closeOnConfirm: true,
            html: true
          }, function(){
          });
        };


        $scope.setWifi = function(network){
            $scope.wifi.network = network
           // $scope.myPopup.close();
        };

        $scope.submit = function(){
            if($scope.wifi && $scope.wifi.password && $scope.wifi.network){
                Wifi.join(
                    $scope.wifi.network,
                    $scope.wifi.password,
                    function succeed(message){
                        console.log(message);
                },
                function failed(message){
                    console.log(message);
                });
            }
        };
    }]);
