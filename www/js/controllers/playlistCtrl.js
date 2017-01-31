/**
 * Created by tokwii on 9/19/16.
 */

'use strict';

angular.module('mangoPanel')
  .controller('PlaylistCtrl',[ '$scope', 'Config', 'Status', function ($scope, Config, Status) {
      var mediaDevice = _.find(Config.devices, function(device) { return device.kind === 'mediaPlayer'; });
    }]);
