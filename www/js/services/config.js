/**
 * Created by jbblanc on 16/07/2015.
 */


angular.module('mangoPanel')
    .factory('Config',[function(){

        var rooms = {}, devices ={} , categories = {}, states = {}, clients ={};

        return {
            rooms : rooms,
            categories : categories,
            devices : devices,
            states : states,
            clients : clients,
            reset : function(){
                rooms = {};
                devices = {};
                categories = {};
                states = {};
                clients ={};
            }

        };
    }]);
