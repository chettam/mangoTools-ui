/**
 * Created by jean-baptisteblanc on 07/07/2015.
 */

'use strict';
angular.module('mangoPanel')
    .directive('background',['$rootScope','Status','$window','imageLocator',function ($rootScope,Status,$window,imageLocator) {
        return {
            restrict: 'A',
            link: function postLink(scope, element) {
                element.addClass('background');
            },
            controller: function ($element, $scope) {

                var applyBackground = function(background){
                    if(background && background.path){

                        var localOrigin;
                        if(background.rotation === 0){
                            localOrigin = "50% 50% 0";
                        } else if(background.rotation === -90) {
                            localOrigin = "360px 360px 0";
                        } else if(background.rotation === 90) {
                            localOrigin = "640px 640px 0";
                        } else if(background.rotation === 180) {
                            localOrigin = "50% 50% 0";
                        }

                        var width = background.rotation === 90 || background.rotation === -90 ? $window.innerHeight : $window.innerWidth;
                        var height = background.rotation === 90 || background.rotation === -90 ? $window.innerWidth : $window.innerHeight;
                        var brightness = Math.floor(background.brightness) / 100;
                        $element.css({
                            'width':  width + 'px',
                            'height': height +'px',
                            'background-image': 'url(' + imageLocator.url(background.path) +')',
                            'background-size' : 'cover',
                            'background-position': 'center',
                            'transform': 'rotate(' + (background.rotation || 0) + 'deg)',
                            'transform-origin': localOrigin,
                            'filter':'brightness(' + (brightness || 1) + ')'
                            // '-webkit-filter': 'blur(10px)',
                            // '-moz-filter': 'blur(10px)',
                            // '-o-filter': 'blur(10px)',
                            // '-ms-filter': 'blur(10px)',
                            // 'filter': 'blur(10px)',
                            //  'z-index': '0'
                        });
                    }
                };

                if(Status.getPanel() &&  Status.getPanel().settings && Status.getPanel().settings.background)  {
                    applyBackground(Status.getPanel().settings.background);
                } else {
                  applyBackground({path :'/img/default.png',rotation : 0});
                }

                $rootScope.$on('panel',function(){
                    if(Status.getPanel() &&  Status.getPanel().settings && Status.getPanel().settings.background) {
                        applyBackground(Status.getPanel().settings.background);
                    }
                });

            }
        }
    }]);
