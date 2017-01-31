/**
 * Created by jbblanc on 14/07/2015.
 */

function parseEndPointUrl(homfiController,endPoint) {

  if(endPoint){
    return 'http://'+homfiController.host+':'+homfiController.port + endPoint;
  }
  return 'http://'+homfiController.host+':'+homfiController.port ;
}


angular.module('mangoPanel')
  .factory('HomFiUtils',['Config','Status','$http', function(Config,Status,$http){



    function createOrUpdate(device) {
      var deviceId = device._id;


      var categoryId = device.hasOwnProperty('category') ? device.category._id : null

      //delete device.room;
      delete device.states;
      //delete device.category;

      Config.devices[deviceId] = device;
      Config.devices[deviceId].states = {};

      if(device.room && device.room._id ){
        var roomId = device.room._id;
        Config.devices[deviceId].room = Config.rooms[roomId];
      }


      if (categoryId) {
        Config.devices[deviceId].category = Config.categories[categoryId];
      }

      _.forEach(Config.states, function (value, key) {
        if (value.hasOwnProperty('device') && value.device._id === deviceId) {
          Config.devices[deviceId].states[value.name] = value;
        }
      });
    }

    return {
      /**
       * Move lightning devices to sub actuator array when sceneController is present
       * @param deviceList raw device list
       * @param callback(newDeviceList)
       */
      groupdSceneDevices: function (deviceList, callback) {
        var index = _.findIndex(deviceList, 'kind', 'sceneController');
        // If sceneController is present
        if (index !== -1) {

          var newDeviceList = [];
          var sceneDevice = deviceList[index];
          sceneDevice.subDevice = [];
          newDeviceList.push(sceneDevice);

          _.forEach(deviceList, function (device) {
            if (device.kind === 'dimmer' || device.kind === 'switch' || device.kind === 'lightSwitch' || device.kind === 'colorPicker') {
              sceneDevice.subDevice.push(device)
            }
            else if (device.kind !== 'sceneController') {
              newDeviceList.push(device)
            }
          });

          // Return result
          if (callback) {
            return callback(newDeviceList);
          }
          else {
            return newDeviceList;
          }
        }
        else {
          // Return result
          if (callback) {
            return callback(deviceList);
          }
          else {
            return deviceList;
          }
        }
      },
      createOrUpdate :createOrUpdate,
      getConfig: function (homFiController,socket, callback) {
        Config.reset();
        async.series([
            function (callback) {
              $http({
                method: 'GET',
                url:  parseEndPointUrl(Status.getHomFiController(),'/api/auth/client'),
                headers: {apiKey : homFiController.apiKeyEnc ,authorization: 'Bearer ' + homFiController.token || {}}
              }).then(function successCallback(response) {
                Config.clients ={};
                _.forEach(response.data, function (client) {
                  if (client.serial !== homFiController.serial) {
                    if (!Config.clients.hasOwnProperty(client.serial))  Config.clients[client.serial] = {};
                    Config.clients[client.serial] = client;
                  }else {
                    Status.setPanel(client);
                  }
                });
                callback();
              }, function errorCallback(response) {
                callback(response)
              });
            },
            function (callback) {
              $http({
                method: 'GET',
                url:  parseEndPointUrl(Status.getHomFiController(),'/api/anon/room'),
                headers: {apiKey : homFiController.apiKeyEnc}
              }).then(function successCallback(response) {
                Config.rooms = {};
                _.forEach(response.data, function (room) {
                  var roomId = room._id;
                  if (!Config.rooms[roomId]) {
                    Config.rooms[roomId] = room
                  }
                });
                callback();
              }, function errorCallback(response) {
                callback(response)
              });
            },
            function (callback) {
              $http({
                method: 'GET',
                url:  parseEndPointUrl(Status.getHomFiController(),'/api/auth/state'),
                headers: {apiKey : homFiController.apiKeyEnc ,authorization: 'Bearer ' + homFiController.token || {}}
              }).then(function successCallback(response) {
                Config.states ={};
                Config.states = response.data || {};
                callback();
              }, function errorCallback(response) {
                callback(response)
              });

            },
            function (callback) {
              $http({
                method: 'GET',
                url:  parseEndPointUrl(Status.getHomFiController(),'/api/anon/category'),
                headers: {apiKey : homFiController.apiKeyEnc}
              }).then(function successCallback(response) {
                Config.categories = {};
                _.forEach(response.data, function (category) {
                  var categoryId = category._id;
                  if (!Config.categories[categoryId]) {
                    Config.categories[categoryId] = category
                  }
                });
                callback();
              }, function errorCallback(response) {
                callback(response)
              });
            },
            function (callback) {
              $http({
                method: 'GET',
                url:  parseEndPointUrl(Status.getHomFiController(),'/api/anon/device'),
                headers: {apiKey : homFiController.apiKeyEnc}
              }).then(function successCallback(response) {
                Config.devices = {};
                _.forEach(response.data, function (device) {
                  createOrUpdate(device);
                });
                callback();
              }, function errorCallback(response) {
                callback(response)
              });
            }],

          function (err, results) {
            if (err) return callback(err);
            callback()
          }
        );
      },
      parseEndPointUrl :parseEndPointUrl
    }
  }]);
