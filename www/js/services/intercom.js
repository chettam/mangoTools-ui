/**
 * Created by jbblanc on 14/09/2015.
 */


angular.module('mangoPanel')
    .factory('Intercom',['$rootScope','$log','$state','Config','Utils',function($rootScope,$log,$state,Config,Utils){

        var intercoms = {};
        $rootScope.$watch(function() {
            return intercoms
        }, function watchCallback() {
            _.forEach(intercoms,function(value,key){
                _.forEach(value.states,function(state){
                    if(state.name === "bell" && state.value === 1){
                        Utils.setDoorPanel(value);
                        $rootScope.$broadcast('doorPanel:Ringing');
                        $state.go('doorPanel')
                    }
                })
            })


        },true);


        return {
            start : function(){
                _.forEach(Config.devices,function(device){
                    if(device.kind === 'doorPanel' && !intercoms[device.uid]){
                        intercoms[device.uid] = device;
                    }
                })
            }
        }

    }]);
