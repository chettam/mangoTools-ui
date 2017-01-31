/**
 * Created by jbblanc on 10/02/2016.
 */

/**
 * Created by jbblanc on 21/08/2015.
 */

angular.module('mangoPanel')
    .factory('ScreenSaver',[ '$state','Status','$rootScope',function($state,Status,$rootScope){
        var timeIdle =0, panel = Status.getPanel();

        $rootScope.$on('panel', function(){
            panel = Status.getPanel();
        });

        function resetTimeIdle(){
            timeIdle =0;
            if($state.current.name === 'screenSaver'){
                brightness.setBrightness(panel.dimBrightness);
                if(!_.isEmpty(panel.room))  Status.setCurrentRoom(panel.room);
                $rootScope.$broadcast('room:current');
              panel.settings.hasOwnProperty('lock') && panel.settings.lock.enabled ? $state.go('lockScreen') : $state.go('index');

            }
        }

        function  updateScreenSaver(){
            timeIdle = timeIdle + 1 ;
            if(/*false*/timeIdle >= parseInt(panel['settings']['screenSaver'].timeout) && $state.current !=='screenSaver') {

                brightness.getBrightness(function(defaultBrighness,err){
                    panel.dimBrightness =  defaultBrighness;
                    Status.setPanel(panel);
                    brightness.setBrightness(panel.dimBrightness);
                    $state.go('screenSaver');
                });

            }
        }

        $rootScope.$on('$stateChangeSuccess',function(){
            if($state.current.name !== 'screenSaver') resetTimeIdle();
        });

        return {
            start : function(){
              if(ionic.Platform.isAndroid()) {
                setInterval(function () {
                  if ($state.current.name !== 'settings' && $state.current.name !== 'intercom' && $state.current.name !== 'doorPanel') {
                    updateScreenSaver()
                  }
                }, 1000);
              }
            },
            resetTimeIdle : resetTimeIdle
        }

    }]);
