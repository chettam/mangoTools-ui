/**
 * Created by togunrek on 9/15/16.
 */

'use strict';

angular.module('mangoPanel')
  .controller('LockScreenCtrl',[ '$scope','$rootScope','$interval','$timeout','Status','$state', 'Config', function ($scope,$rootScope,$interval,$timeout,Status,$state, Config) {

    // Using Fisher-Yates algorithm
    $scope.shuffle = function(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
      return array;
    };

    $scope.panel = Status.getPanel();

    $scope.password = _.uniq($scope.panel.settings.lock.selected);
    $scope.iconArray = _.difference(['ion-social-youtube','ion-social-twitter','ion-social-facebook','ion-social-google','ion-social-instagram-outline','ion-social-whatsapp', 'ion-social-snapchat-outline','ion-social-pinterest','ion-social-dribbble','ion-social-octocat','ion-social-github','ion-social-rss', 'ion-social-tumblr','ion-social-wordpress-outline','ion-social-reddit-outline','ion-social-skype-outline','ion-social-linkedin-outline','ion-social-vimeo','ion-social-twitch','ion-social-buffer','ion-social-hackernews','ion-social-designernews','ion-social-dropbox','ion-social-apple'],$scope.password);
    $scope.iconList = _.take($scope.iconArray, 12- $scope.password.length);


    _.forEach($scope.password,function(password){
      $scope.iconList.push(password);
      $scope.iconList = $scope.shuffle($scope.iconList)
    });


    $scope.iconList =_.chunk( $scope.iconList, 3);

    $scope.icons = [];
    var asterisk = '*';
    $scope.asterisk = [];

    $scope.removeIcon = function() {
      $scope.icons.pop();
      $scope.asterisk.pop()
    };

    $scope.clickedIcon = function(selectedIcon){
      if($scope.icons.length < 4){
        $scope.icons.push(selectedIcon);
        $scope.asterisk.push(asterisk);
      }
    };

    Array.prototype.diff = function(arr2) {
      var ret = [];
      for(var i in this) {
        if(arr2.indexOf( this[i] ) > -1){
          ret.push( this[i] );
        }
      }
      return ret;
    };

    $scope.$watchCollection('icons', function(){
     // $scope.res = _.intersection($scope.icons, $scope.panel.settings.lock.selected);

      if(($scope.icons.diff($scope.panel.settings.lock.selected)).length === 4){
        $state.go('index');
      }
      else if (($scope.icons.length === 4) && (($scope.icons.diff($scope.panel.settings.lock.selected)).length != 4))
      {
        $scope.icons = [];
        $scope.asterisk = [];
        $scope.$broadcast('ERROR');
        $scope.iconList = $scope.shuffle($scope.iconList)
      }
    });

  }]);
