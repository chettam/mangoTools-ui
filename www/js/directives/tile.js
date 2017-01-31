/**
 * Created by jean-baptisteblanc on 29/05/2015.
 */
'use strict';

angular.module('mangoPanel')
    .directive('tile', function ($ionicGesture, $ionicSlideBoxDelegate, $timeout, $compile) {
        return {
            restrict: 'E',
            scope: {
                device: '=',
                subMenu: '=?'
            },
            replace: true,
            template: '<div></div>',
            link: function postLink(scope, element) {

                if(!scope.device) return;
                var compiledDirective;
                // Generate Lighting controller tile
                if(scope.device.kind === "sceneController") {
                    compiledDirective = $compile('<tile-scene></tile-scene>');
                }
                else if(scope.device.kind === "heating") {

                    compiledDirective = $compile('<tile-heating></tile-heating>');
                }
                else if(scope.device.kind === "shutters") {

                    compiledDirective = $compile('<tile-shutters></tile-shutters>');
                }
                else if(scope.device.kind === "media") {

                    compiledDirective = $compile('<tile-media></tile-media>');
                }
                else if(scope.device.kind === "mediaPlayer") {

                    compiledDirective = $compile('<tile-media></tile-media>');
                }
                else if(scope.device.kind === "pushButton") {

                    compiledDirective = $compile('<tile-push-button></tile-push-button>');
                }
                else if(scope.device.kind === "buttonUpDown"){
                            compiledDirective = $compile('<tile-up-down-button></tile-up-down-button>');
                }
                else if(scope.device.kind === "buttonLeftRight"){
                    compiledDirective = $compile('<tile-left-right-button></tile-left-right-button>');
                }
                else if(scope.device.kind === "switch") {

                    compiledDirective = $compile('<tile-switch></tile-switch>');
                }
                else if(scope.device.kind === "doorPanel") {

                    compiledDirective = $compile('<tile-door-panel></tile-door-panel>');
                }
                else if(scope.device.kind === "alarm") {

                    compiledDirective = $compile('<tile-alarm></tile-alarm>');
                }
                else if(scope.device.kind === "slider") {

                    compiledDirective = $compile('<tile-slider></tile-slider>');
                }
                else if(scope.device.kind === "smokeAlarm") {

                    compiledDirective = $compile('<tile-smoke-alarm></tile-smoke-alarm>');
                }
                else if(scope.device.kind === "info") {

                    compiledDirective = $compile('<tile-info></tile-info>');
                }
                else if(scope.device.kind === "colorPicker"){
                    compiledDirective = $compile('<tile-light-rgb></tile-light-rgb>');
                }
                else if(scope.device.kind === "lightSwitch"){
                    compiledDirective = $compile('<tile-light-switch></tile-light-switch>');
                }
                else if(scope.device.kind === "dimmer"){
                    compiledDirective = $compile('<tile-light-dimmer></tile-light-dimmer>');
                }
                else if(scope.device.kind === "switch"){
                    compiledDirective = $compile('<tile-light-switch></tile-light-switch>');
                }
                //else if(scope.actuator.detail) {
                //    if(scope.actuator.detail.Type === "Pushbutton"){
                //        compiledDirective = $compile('<tile-push-button></tile-push-button>');
                //    }
                //    else if(scope.actuator.detail.Type === "buttonUpDown"){
                //        compiledDirective = $compile('<tile-up-down-button></tile-up-down-button>');
                //    }
                else{
                    compiledDirective = $compile('<tile-in-progress></tile-in-progress>');
                }
                if(compiledDirective){
                    var directiveElement = compiledDirective(scope);
                    directiveElement.addClass(element.attr('class'));
                    element.removeClass();
                    element.append(directiveElement);

                    $ionicGesture.on('touch', function(event){
                        $ionicSlideBoxDelegate.enableSlide( false );
                    }, directiveElement);
                    $ionicGesture.on('release', function(event){
                        $ionicSlideBoxDelegate.enableSlide( true );
                    }, directiveElement);
                }
            }
        }
    });
