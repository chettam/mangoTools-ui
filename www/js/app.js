// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('mangoPanel', ['ionic','ionic.cloud','ngAudio','uuid4', 'ds.clock','dndLists'])
  .config(function($ionicCloudProvider,$urlRouterProvider,$stateProvider) {
    $ionicCloudProvider.init({
      "core": {
        "app_id": "792a6067"
      }
    });

    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('index', {
        url: '/',
        templateUrl: 'views/main.html',
        controller:'MainCtrl'
      })
      .state('subMenu', {
        url: '/subMenu',
        templateUrl: 'views/subMenu.html',
        controller:'SubMenuCtrl'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'views/settings.html',
        controller:'SettingsCtrl'
      })
      .state('homFiController', {
        url: '/homFiController',
        templateUrl: 'views/settings/home.html',
        controller:'HomFiCtrl'
      })
      .state('screenSaver', {
        url: '/screenSaver',
        templateUrl: 'views/screenSaver.html',
        controller:'ScreenSaverCtrl'
      })
      .state('intercom', {
        url: '/intercom',
        templateUrl: 'views/intercom.html',
        controller:'IntercomCtrl'
      })
      .state('loading', {
        url: '/loading',
        templateUrl: 'views/loading.html',
        controller:'LoadingCtrl'
      })
      .state('doorPanel', {
        url: '/doorPanel/:panelId',
        templateUrl: 'views/doorPanel.html',
        controller:'DoorPanelCtrl'
      })
      .state('info', {
        url: '/info',
        templateUrl: 'views/info.html',
        controller:'InfoCtrl'
      })
      .state('roomSelector', {
        url: '/roomSelector',
        templateUrl: 'views/roomSelector.html',
        controller:'RoomSelectorCtrl'
      })
      .state('musicPlayer' , {
        url: '/musicPlayer/:deviceId',
        templateUrl: 'views/musicHome.html',
        controller:'MusicCtrl'
      })
      .state('musicPlaylist' , {
        url: '/musicPlaylist',
        templateUrl: 'views/musicPlaylist.html',
        controller:'PlaylistCtrl'
      })
    .state('lockScreen' , {
      url: '/lockScreen',
      templateUrl: 'views/lockScreen.html',
      controller:'LockScreenCtrl'
    });
  })

.run(['$ionicPlatform','$ionicGesture','ScreenSaver','Update','HomFiConnect','Proximity',function($ionicPlatform,$ionicGesture,ScreenSaver,Update,HomFiConnect,Proximity) {

  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }


    if(ionic.Platform.isAndroid()){
      window.plugins.insomnia.keepAwake()
      window.brightness = cordova.require("cordova.plugin.Brightness.Brightness");
    }

    ScreenSaver.start();
    Update.start();
    HomFiConnect.start();
    Proximity.start();

    $ionicGesture.on('touch', function(event){
      ScreenSaver.resetTimeIdle();
    }, document.getElementsByTagName('body'));


  });
}]);
