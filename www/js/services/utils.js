/**
 * Created by jbblanc on 26/08/2015.
 */



angular.module('mangoPanel')
    .factory('Utils',[function(){

        var subActuators = {},
            roomInfo = [],
            doorPanel ={},
            callType = {},
            incomingCall = null,
            incomingCallRequest = null,
            remoteStreams = [];



        return {
            setSubActuators : function(actuators){
                subActuators = actuators ;
            },
            getSubActuators : function(){
                return subActuators;
            },
            setRoomInfo : function(info){
                roomInfo = info ;
            },
            getRoomInfo : function(){
                return roomInfo;
            },
            setDoorPanel : function(panel){
                doorPanel = panel
            },
            getDoorPanel : function(){
                return doorPanel
            },
            incomingCall : incomingCall,
            incomingCallRequest :incomingCallRequest,
            remoteStreams :remoteStreams
        }

    }]);
