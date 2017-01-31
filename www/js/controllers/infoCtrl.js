/**
 * Created by jbblanc on 27/09/2015.
 */

'use strict';

angular.module('mangoPanel')
    .controller('InfoCtrl',[ '$scope','$rootScope','Utils', function ($scope,$rootScope,Utils) {

        $scope.infoList = [];

        _.forEach(Utils.getRoomInfo(),function(info){
            var value ="N/A";
            switch(info.kind) {
                case 'textDevice':
                    value = info.states.value.format ? StringFormat.format(info.states.value.format,[info.states.value.value || 0]) : info.states.value.value;
                    info.formattedValue = value;
                    break;
                case 'textDeviceBinary' :
                    value = info.states.value.value === 1 ? info.states.value.on : info.states.value.off
                    info.formattedValue = value;
                    break;
                case 'monitoringEnergy' :
                    value ="";
                    _.forEach(info.states,function(state){
                    value += " " + state.name+": " +  StringFormat.format(state.format,[state.value || 0])   
                    });
                    info.formattedValue = value;
                    break;
                default:
                    info.formattedValue = value;

            }
            $scope.infoList.push(info)
        })


    }]);
