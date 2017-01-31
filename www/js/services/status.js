/**
 * Created by jbblanc on 21/08/2015.
 */

angular.module('mangoPanel')
    .factory('Status',['$localStorage','$rootScope', function($localStorage,$rootScope){
      
        return {
            getPanel : function(){
                return $localStorage.get('panel');
            },
            setPanel : function(panel){
                 $localStorage.set('panel',panel);
                $rootScope.$broadcast('panel');
            },
            getHomFiController : function(){
                return $localStorage.get('homFiController');
            },
            setHomFiController : function(homFiController){
                $localStorage.set('homFiController',homFiController);
                $rootScope.$broadcast('homFiController');
            },
            getCurrentRoom : function(){
                return $localStorage.get('room');
            },
            setCurrentRoom : function(room){
                $localStorage.set('room',room);
            }
        }


    }]);
