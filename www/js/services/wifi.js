/**
 * Created by jbblanc on 21/08/2015.
 */


angular.module('mangoPanel')
  .factory('Wifi',['$rootScope',function($rootScope){

      var addNetwork = function(ssid, password, succeedCallback, failedCallback){
        var config = WifiWizard.formatWPAConfig(ssid, password);
        WifiWizard.addNetwork(config, function(){
          console.log("new wifi configuration added");
          console.log("connect to it");
          WifiWizard.connectNetwork(ssid,succeedCallback,failedCallback);
        }, failedCallback);
      };
    return {
      enable : function(callback) {
        if(ionic.Platform.isAndroid()) {
          WifiWizard.setWifiEnabled(true);
          WifiWizard.isWifiEnabled(function (wifi, err) {
            callback(err, wifi);
          });
        }
      },
      ssid : function(callback) {
        if(ionic.Platform.isAndroid()) {
          async.waterfall([
            function (callback) {
              WifiWizard.isWifiEnabled(function (wifi, err) {
                callback(err, wifi);
              });
            },
            function (wifi, callback) {
              if (wifi) {
                WifiWizard.getCurrentSSID(function (ssid, err) {
                  if (err) return callback(err, "Could not retrieve network Information")
                  callback(null, ssid.replace(/['"]+/g, ''));
                });
              } else {
                callback(null, "Wifi Disconnected")
              }

            }
          ], function (err, ssid) {
            callback(ssid);
          });
        }
      },
      startScan : function(){
        if(ionic.Platform.isAndroid()) {
          WifiWizard.startScan(function (success, err) {
          });
        }
      },
      availableNetworks : function(callback){
        if(ionic.Platform.isAndroid()) {
          WifiWizard.getScanResults(function (availableNetworks, err) {
            if (err) return callback(err, "Could not retrieve network Information")

            var networkList = [];

            _.forEach(availableNetworks, function (value, key) {
              if (value['capabilities'].includes('WPA'))
                networkList.push(value)
            });
            callback(err, networkList);
          });
        }
      },
      join : function(ssid, password, succeedCallback, failedCallback) {
        if (ionic.Platform.isAndroid()) {
          // Liste des reseaux deja configur�s
          WifiWizard.listNetworks(function (networks) {
            var foundIndex = null;
            for (var i = 0; i < networks.length; i++) {
              if (networks[i].ssid === ssid) {
                foundIndex = i;
                break;
              }
            }
            // Si le reseau existe d�j�, on le supprime puis on le recree
            if (foundIndex) {
              console.log("remove existing configuration");
              WifiWizard.removeNetwork(function () {
                addNetwork(ssid, password, succeedCallback, failedCallback)
              }, failedCallback);
            }
            else {
              addNetwork(ssid, password, succeedCallback, failedCallback)
            }
          }, failedCallback);
          var config = WifiWizard.formatWPAConfig(ssid, password);
          WifiWizard.addNetwork(config, function () {
            WifiWizard.connectNetwork(ssid, succeedCallback, failedCallback);
          }, failedCallback);
        }
      }
    }

  }]);
