/**
 * Created by jbblanc on 16/09/2015.
 */

angular.module('mangoPanel')
    .controller('DoorPanelCtrl',['$scope','$rootScope','Intercom','$sce','Status','HomFiConnect','$log','ngAudio','$state','Utils','Sip','$window', function ($scope,$rootScope,Intercom,$sce,Status,HomFiConnect,$log,ngAudio,$state,Utils,Sip,$window) {

        $scope.doorPanel = Utils.getDoorPanel();
        $scope.panel = Status.getPanel();

        $rootScope.$on('panel',function(){
            $scope.panel = Status.getPanel();
        });

        $scope.callStatus = Sip.getCallStatus();

        $scope.outStates = [];


        if(!_.isEmpty($scope.doorPanel.videoFeed) && $scope.doorPanel.videoFeed.user != "" && $scope.doorPanel.videoFeed.pass != "") {
            $scope.authStream = $sce.trustAsResourceUrl('http://' + $scope.doorPanel.videoFeed.user + ':' + $scope.doorPanel.videoFeed.pass + '@' + $scope.doorPanel.videoFeed.streamUrl.replace(/.*?:\/\//g, ""));

          setTimeout(function(){
            $scope.videoStream =  $sce.trustAsResourceUrl($scope.doorPanel.videoFeed.streamUrl);
          }, 500);
        }


      


        $scope.audio = $scope.doorPanel.audioFeed;
      
        _.forEach($scope.doorPanel.states,function(state){
            if(state.execute){
                $scope.outStates.push(state);
            }
        });


        // Changement de room
        $rootScope.$on('room:current',function(){
            $state.go('index');
        });

        $scope.soundIncoming = ngAudio.load("sounds/doorbell01.mp3");
        $scope.soundIncoming.unbind();
        $scope.soundIncoming.volume = 1; // max
        $scope.$on(
            "$destroy",
            function handleDestroyEvent() {
                $scope.soundIncoming.stop();
            }
        );

        $rootScope.$on('intercom:callStatus',function(){
            $scope.callStatus = Sip.getCallStatus();
        });


        $rootScope.$on('doorPanel:Ringing',function(){
            $scope.soundIncoming.restart();
            $scope.soundIncoming.play();
        });


        $scope.circleOptions ={
            disable : true
        };

        $scope.intercom ={};

        $scope.sipcall = null;
        $scope.authStream = null;
        $scope.registered = false;
        $scope.notReady = true;
        $scope.onCall = false;

        var remoteAudio = document.querySelector('#remote-audio');

        $rootScope.$on('intercom:remoteStream',function(){
            var stream = Sip.getRemoteStream();
            remoteAudio.src = $window.URL.createObjectURL(stream);
        });


        $scope.doAction = function(state){
            HomFiConnect.execute(state,1);
        };

        $scope.stopAction = function(state){
            HomFiConnect.execute(state,0);
        };

        $scope.tap = function(){
            if(Sip.getCallStatus() === 'registered') {
                $scope.call();
            } else {
                $scope.endCall();
            }

        };

        $scope.call = function() {
            Sip.call($scope.audio.user +'@' + $scope.audio.host,false,false);
        };

        $scope.endCall = function(){
            Sip.hangup();
        };





    }]);
