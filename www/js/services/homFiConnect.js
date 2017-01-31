angular.module('mangoPanel')
    .factory('HomFiConnect',['$log','$rootScope','Config','Status','HomFiUtils','$state','Intercom','$http','uuid4','Sip','$window',function($log,$rootScope,Config,Status,HomFiUtils,$state,Intercom,$http,uuid4,Sip,$window){
        var socket = {}, panel = {}, homFiController = {};



        function start() {
          $log.debug('HomFi Controller Initialised connection');
          homFiController = Status.getHomFiController();
          if(homFiController.host && homFiController.port) {
            panel.callStatus = false;
            if (!homFiController.hasOwnProperty('serial') || _.isEmpty(homFiController['serial'])) homFiController.serial = uuid4.generate();

            login(function () {
              socket = {};
              socket = io.connect(HomFiUtils.parseEndPointUrl(homFiController), {'query': 'apiKey=' + homFiController.apiKeyEnc + '&token=' + homFiController.token});

              socket.on('connect', function () {
                HomFiUtils.getConfig(homFiController, socket, function (err) {
                  if (err) {
                    $log.error(err)
                  }
                  $state.go('index');
                });
              });

              socket.on('reconnect', function () {
                Config.reset();
                setTimeout(function () {
                  $window.location.reload(true)
                }, 15000);

              });

              socket.on('message', function (msg) {
                console.log(msg)
              });

              socket.on('state', function (msg) {
                $rootScope.$apply(function () {
                  switch (msg.verb) {
                    case 'created':
                      Config.states[msg.uid] = msg.data;
                      Config.devices[msg.data.device._id].states[msg.data.name] = Config.states[msg.uid];
                      break;
                    case 'updated' :
                      if(Config.states[msg.uid]) {
                        angular.merge(Config.states[msg.uid], msg.data);
                      } else {
                        Config.states[msg.uid] = msg.data;
                        if(!Config.devices[msg.data.device._id]) Config.devices[msg.data.device._id] ={};
                        if(!Config.devices[msg.data.device._id].states) Config.devices[msg.data.device._id].states ={};
                        Config.devices[msg.data.device._id].states[msg.data.name] = Config.states[msg.uid];
                      }
                      break;
                    case 'destroyed' :
                      delete Config.devices[msg.data.device._id].states[msg.data.name];
                      delete Config.states[msg.uid];
                      break;
                    default:
                      return; // ignore any unrecognized messages
                  }
                });
              });

              socket.on('device', function (msg) {
                $rootScope.$apply(function () {
                  switch (msg.verb) {
                    case 'created':
                      HomFiUtils.createOrUpdate(msg.data);
                      Intercom.start();
                      break;
                    case 'updated' :
                      HomFiUtils.createOrUpdate(msg.data);
                      break;
                    case 'destroyed' :
                      delete Config.devices[msg.id];
                      break;

                    default:
                      return; // ignore any unrecognized messages
                  }
                });
              });

              socket.on('room', function (msg) {
                $rootScope.$apply(function () {
                  switch (msg.verb) {
                    case 'created':
                      Config.rooms[msg.id] = msg.data;
                      break;

                    case 'updated' :
                      _.extend(Config.rooms[msg.id], msg.data);
                      break;
                    case 'destroyed' :
                      delete Config.rooms[msg.id];
                      break;

                    default:
                      return; // ignore any unrecognized messages
                  }
                });
              });

              socket.on('category', function (msg) {
                $rootScope.$apply(function () {
                  switch (msg.verb) {
                    case 'created':
                      Config.categories[msg.id] = msg.data;
                      break;

                    case 'updated' :
                      _.extend(Config.categories[msg.id], msg.data);
                      break;
                    case 'destroyed' :
                      delete Config.categories[msg.id];
                      break;

                    default:
                      return; // ignore any unrecognized messages
                  }
                });
              });

              socket.on('client', function (msg) {
                console.log(msg)
                $rootScope.$apply(function () {
                  switch (msg.verb) {
                    case 'created' :
                      if (panel.serial === msg.data.serial) {
                        _.extend(panel, msg.data);
                        Status.setPanel(panel);
                      } else {
                        _.extend(Config.clients[msg.data.serial], msg.data);
                        $rootScope.$broadcast('client:update');
                      }
                    case 'updated' :
                      if (panel.serial === msg.data.serial) {
                        _.extend(panel, msg.data);
                        Status.setPanel(panel);
                      } else {
                        _.extend(Config.clients[msg.data.serial], msg.data);
                        $rootScope.$broadcast('client:update');
                      }
                      break;

                    default:
                      return; // ignore any unrecognized messages
                  }
                });
              });

              socket.on('error', function (err) {
                console.log(err)
                homFiController.connected = false;
                Status.setHomFiController(homFiController);
                start()
              });

            });
          }
        }

        function login(cb){
            async.series([
                    function(callback) {
                        $http({
                            method: 'GET',
                            url:  HomFiUtils.parseEndPointUrl(homFiController,'/api/apiKey')
                        }).then(function successCallback(response) {
                            homFiController.apiKeyEnc= CryptoJS.HmacSHA256(response.data,"Y9+q-Ths*6LdN-?*6#XJS^HfD6tp%u73V7+Uyk_k&").toString();
                            Status.setHomFiController(homFiController);
                            callback();
                        }, function errorCallback(response) {
                            callback(response)
                        });
                    },
                    function(callback){
                        if(!homFiController.hasOwnProperty('authToken') || _.isEmpty(homFiController['authToken'])){
                            $http({
                                method: 'POST',
                                url:  HomFiUtils.parseEndPointUrl(homFiController,'/api/anon/client/'),
                                data:  { serial : homFiController.serial},
                                headers: { apiKey : homFiController.apiKeyEnc}
                            }).then(function successCallback(response) {
                                homFiController.authToken = response.data.client.authToken;
                                delete  response.data.client.authToken;
                                _.extend(panel,response.data.client);
                                homFiController.token = response.data.token;
                                homFiController.connected = true;
                                Status.setHomFiController(homFiController);
                                callback();
                            }, function errorCallback(response) {
                                $log.error(response)
                            });

                        } else {
                            $http({
                                method: 'POST',
                                url:  HomFiUtils.parseEndPointUrl(homFiController,'/api/anon/client/login'),
                                data:  {serial : homFiController.serial , authToken : homFiController.authToken},
                                headers: { apiKey : homFiController.apiKeyEnc}
                            }).then(function successCallback(response) {
                                if(response.data.hasOwnProperty('err')){
                                    $log.debug('Login Failed. Retrying');
                                    delete homFiController.data.authToken;
                                    login();
                                } else {
                                    homFiController.token = response.data.token;
                                    _.extend(panel,response.data.client);
                                    homFiController.connected = true;
                                    Status.setHomFiController(homFiController);
                                    callback();
                                }
                            }, function errorCallback(response) {
                                $log.debug('Login Failed. Retrying');
                                delete homFiController.authToken;
                                login();
                            });
                        }

                    },
                    function(callback){
                        $log.debug('Starting Sip');
                        Intercom.start();
                        Sip.start();
                        callback()

                    }
                ],
                function(err, results){
                    if(err) console.log(err);
                    $log.debug('startup complete');
                    cb()
                });
        }

        return {
          
            start : start,

            /**
             * Execute command throw Homfi Ctrl
             * @param data
             * @param successCallback
             * @param errorCallback
             */
            execute: function(state, value) {
                $log.debug({'state' : state,'value': value })
                socket.emit('/api/auth/state/execute', {'state' : state,'value': value });
            }
        }
    }]);
