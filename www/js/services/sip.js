/**
 * Created by jbblanc on 04/10/2015.
 */

angular.module('mangoPanel')
    .factory('Sip',['$rootScope', '$state', 'Status', 'Config','$log', function($rootScope, $state, Status, Config,$log){
        var panel = Status.getPanel();
        var homFiController = Status.getHomFiController();
        var session = {},callStatus , ready =false ,jsep ={};
        var remoteStream ={}, localStream = {};

        //setCallStatus('unregistered');

        $rootScope.$on('panel',function(){
            panel = Status.getPanel();
        });

        function setJsep(newJsep){
            jsep = newJsep;
        }
        function getJsep(){
            return jsep;
        }
        function setCallStatus(newCallStatus){
            callStatus = newCallStatus;
            $rootScope.$broadcast('intercom:callStatus');
        }
        function setLocalStream(stream){
            localStream = stream;
            $rootScope.$broadcast('intercom:localStream');
        }

        function setRemoteStream(stream){
            remoteStream = stream;
            $rootScope.$broadcast('intercom:remoteStream');
        }

        function register() {
            var register = {
                "request" : "register",
                "username" : 'sip:'+panel.sipService.user+'@'+panel.sipService.host,
                //"proxy": "sip:sip.mango.tools:5060",
                "ha1_secret" : CryptoJS.MD5(panel.sipService.user+':'+panel.sipService.host+':'+panel.sipService.password).toString(CryptoJS.enc.Hex)
            };
            session.send({"message": register});
        };

        function decline(){
            var body = { "request": "decline" };
            session.send({"message": body});
        };

        function hangup(){
            var hangup = { "request": "hangup" };
            session.send({"message": hangup});
            session.hangup();
            setCallStatus('registered');

        };

        function call(user,sendVideo,receiveVideo){
            session.createOffer(
                {
                    media: {
                        audioSend: true, audioRecv: true,		// We DO want audio
                        videoSend: sendVideo || false, videoRecv: receiveVideo || false	    // No Video here
                    },
                    success: function(jsep) {
                        //var body = { "request": "call", uri:'sip:504F941046BD-intercom@sip.mango.tools' };
                        var body = { "request": "call", uri:'sip:'+ user};
                        session.send({"message": body, "jsep": jsep});
                        setCallStatus('inviting')
                    },
                    error: function(error) {
                        console.log("WebRTC error...");
                        console.log(error);
                    }
                });
        };

        function accept(receiveAudio,receiveVideo){
            console.log(getJsep())
            session.createAnswer(
                {
                    jsep: getJsep(),
                    media: { audio: receiveAudio, video: receiveVideo },
                    success: function(jsep) {
                        var body = { request: "accept" };
                        session.send({"message": body, "jsep": jsep});
                        setCallStatus('established')
                    },
                    error: function(error) {
                        console.log(error)
                        var body = { "request": "decline", "code": 480 };
                        session.send({"message": body});
                        setCallStatus('registered')
                    }
                });
        };


        return {
            start : function(){


                if(panel.intercom && !_.isEmpty(panel.sipService)){
                    Janus.init({
                        debug: false,
                        callback: function () {
                            if(!_.isEmpty(session)){
                                $log.debug(" ::: Janus already started :::");
                            }
                            $log.debug(" ::: Starting Janus :::");
                            var janus = new Janus(
                                {
                                    //server: ['ws://'+homFiController.host+':8188'],
                                    server: ['ws://192.168.1.71:8188'],
                                    //server: ['https://janus.conf.meetecho.com/janus'],
                                    success: function () {
                                        janus.attach(
                                            {
                                                plugin: "janus.plugin.sip",
                                                success: function (pluginHandle) {
                                                    session = pluginHandle;
                                                    register();
                                                },
                                                error: function (error) {
                                                    console.log("  -- Error attaching plugin... " + error);
                                                },
                                                onmessage: function (msg, jsep) {
                                                    $log.debug(" ::: Got a message :::");
                                                    $log.debug(JSON.stringify(msg));
                                                    setJsep(jsep) ;

                                                    var result = msg["result"];
                                                    if (result !== null && result !== undefined && result["event"] !== undefined && result["event"] !== null) {
                                                        var event = result["event"];
                                                        if (event === 'registration_failed') {
                                                            $log.warn("Registration failed: " + result["code"] + " " + result["reason"]);
                                                            setCallStatus('unregistered');
                                                        }
                                                        else if (event === 'registered') {
                                                            setCallStatus('registered');
                                                            $log.info("Successfully registered as " + result["username"] + "!");
                                                        } else if (event === 'calling') {
                                                            $log.info("Waiting for the peer to answer...");
                                                        } else if (event === 'incomingcall') {
                                                            $state.go('intercom');
                                                            setCallStatus('incoming');

                                                        } else if (event === 'accepted') {
                                                            $log.info(result["username"] + " accepted the call!");
                                                            // TODO Video call can start
                                                            if (jsep !== null && jsep !== undefined) {
                                                                session.handleRemoteJsep({
                                                                    jsep: jsep,
                                                                    error: hangup
                                                                });
                                                            }
                                                        } else if (event === 'hangup') {
                                                            $log.info("Call hung up (" + result["code"] + " " + result["reason"] + ")!");
                                                            setCallStatus('registered');
                                                            session.hangup();

                                                        }
                                                    }

                                                },
                                                onlocalstream: function (stream) {
                                                    $log.debug(" ::: Got a local stream :::");
                                                    setLocalStream(stream);
                                                    $rootScope.$broadcast('intercom:localStream');
                                                },
                                                onremotestream: function (stream) {
                                                    $log.debug(" ::: Got a remote stream :::");
                                                    setRemoteStream(stream);
                                                },
                                                oncleanup: function () {
                                                    $log.info(" ::: Got a cleanup notification :::");
                                                }

                                            }
                                        )
                                    },
                                    error: function (cause) {
                                        console.log('Oh Boy :  ' + cause)
                                    },
                                    destroyed: function () {
                                      session = {};
                                    }
                                });
                        }
                    });
                }
            },
            getCallStatus : function(){
                return callStatus
            },
            getLocalStream: function(){
             return localStream
            },
            getRemoteStream: function(){
                return remoteStream
            },
            ready : ready,
            call : call,
            accept : accept,
            decline : decline,
            session : session,
            hangup :hangup
        }

    }]);
