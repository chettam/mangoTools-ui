/**
 * Created by jbblanc on 24/10/2016.
 */
angular.module('mangoPanel')
  .factory('Proximity',[ '$state','ScreenSaver',function($state,ScreenSaver){

    function onSuccess(state) {
      if(state[0] === 0){
        ScreenSaver.resetTimeIdle();
      }
    }

    return {
      start : function(){
        if(ionic.Platform.isAndroid()) {
          sensors.enableSensor("PROXIMITY");
          
          setInterval(function(){
            if($state.current.name !== 'settings' && $state.current.name !== 'intercom' && $state.current.name !== 'doorPanel' && $state.current.name !== 'musicPlayer' ) {
              sensors.getState(onSuccess);
            }
          },1000);}

      }
    }
  }]);




