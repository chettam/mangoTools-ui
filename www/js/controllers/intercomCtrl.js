/**
 * Created by jbblanc on 28/08/2015.
 */

angular.module('mangoPanel')
    .controller('IntercomCtrl',[ '$scope','$rootScope','Config','Utils','$window','Status','$state', 'Sip','ngAudio', function ($scope,$rootScope,Config,Utils,$window,Status,$state, Sip,ngAudio) {


        $scope.panel = Status.getPanel();
        $scope.homFiController = Status.getHomFiController();

        var remoteVideo = document.querySelector('#remote-video');
        var localVideo = document.querySelector('#local-video');


        $scope.callStatus = Sip.getCallStatus();


        $rootScope.$on('panel',function(){
            $scope.panel = Status.getPanel();
            $scope.homFiController = Status.getHomFiController();
        });

        $rootScope.$on('intercom:callStatus',function(){
            if(Sip.getCallStatus() === 'incoming') {
                if($scope.callStatus === 'established') return Sip.hangup();
                $scope.soundIncoming.play();
                $scope.soundIncoming.loop = true;
            }
            if(Sip.getCallStatus() === 'registered') {
                $scope.soundIncoming.stop();
            }
            $scope.callStatus = Sip.getCallStatus();
        });

        $rootScope.$on('intercom:localStream',function(){
            var stream = Sip.getLocalStream();
            localVideo.src = $window.URL.createObjectURL(stream);
        });

        $rootScope.$on('intercom:remoteStream',function(){
            var stream = Sip.getRemoteStream();
            remoteVideo.src = $window.URL.createObjectURL(stream);
        });

        // Changement de room
        $rootScope.$on('room:current',function(){
            $state.go('index');
        });

        $scope.soundIncoming = ngAudio.load("sounds/phone01.mp3");
        $scope.soundOutgoing = ngAudio.load("sounds/tone01.mp3");
        $scope.soundIncoming.unbind();
        $scope.soundIncoming.volume = 1; // max
        $scope.soundOutgoing.unbind();
        $scope.soundOutgoing.volume = 1; // max


        $scope.$on(
            "$destroy",
            function handleDestroyEvent() {
                $scope.soundIncoming.stop();
                $scope.soundOutgoing.stop();
            }
        );

        if($scope.callStatus === 'incoming'){
            $scope.soundIncoming.play();
            $scope.soundIncoming.loop = true;
        }


        $scope.talking = false; // For talkie walkie mode


        $scope.clients =[];
        $scope.stream ={};


        $rootScope.$on('client:update',function(){
            _.forEach(Config.clients,function(client){
                if(client.intercom && !_.isEmpty(client.sipService) && client.room !== $scope.panel.room){
                    $scope.clients.push(client)
                }
            });
        });


        _.forEach(Config.clients,function(client){
            if(client.intercom && !_.isEmpty(client.sipService) && client.room !== $scope.panel.room){
              $scope.clients.push(client)
            }
        });

        $scope.selection = {};
        //$scope.$watch('selection', function(){
        //    if($scope.selection){
        //        console.log($scope.selection)
        //    }
        //},true);


        $scope.makeCall =function(){
            _.forEach($scope.selection,function(client){
                Sip.call(client['sipService'].user+'@'+client['sipService'].host,true,true)
            })
        };

        /**
         * Accept incoming call
         */
        $scope.acceptCall = function(){
            $scope.soundIncoming.stop();
           Sip.accept(true,true);
        };

        /**
         * Reject incoming call
         */
        $scope.rejectCall = function(){
            Sip.decline();
        };

        /**
         * End current call
         */
        $scope.endCall = function(){
            Sip.hangup();
        };
    }]);
