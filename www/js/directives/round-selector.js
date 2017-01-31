/**
 * Created by bosc on 22/06/2015.
 */
'use strict';

angular.module('mangoPanel')
    .directive('roundSelector', function ($ionicGesture, $ionicSlideBoxDelegate, $ionicPosition, $timeout) {
        return {
            restrict: 'AE',
            scope: {
                ngModel:'=?',
                list:'=?',
                options:'=?'
            },
            transclude: true,
            replace: true,
            template: '' +
            '<div class="round-selector" on-release="onReleaseMain()">' +
            '   <div class="items">' +
            '       <div ng-repeat="item in list" class="room" ng-class="{selected: ngModel[item.serial], disabled: !item.present}" on-touch="onTouchItem(item)" on-release="onReleaseItem(item)">' +
            '           <img ng-src={{item.room.icon}}>' +
            '       </div>' +
            '       <div class="inner">' +
            '           <div ng-hide="pressedItem">' +
            '               <ng-transclude></ng-transclude>' +
            '           </div>' +
            '           <span ng-show="pressedItem" class="animate-show">{{pressedItem.name}}</span>' +
            '       </div>' +
            '   </div>' +
            '</div>',
            link: function postLink(scope, element) {
                var PI2 = Math.PI*2;

                scope.options = scope.options || {};
                scope.options.size = scope.options.size || 500;
                scope.options.gap = scope.options.gap || 10;
                scope.options.ratio = scope.options.ratio || 0.5;

                scope.config = {};
                scope.config.radius = {};
                scope.config.radius.max = scope.options.size;// - scope.options.padding*2;
                scope.config.radius.ext = 100;//scope.config.radius.max * (1-scope.options.ratio) / 2;
                scope.config.radius.main = scope.config.radius.max - (scope.config.radius.ext + scope.options.gap)*2;//scope.config.radius.max * scope.options.ratio;
                scope.config.radius.extCenter = scope.config.radius.main + scope.config.radius.ext + scope.options.gap;

                scope.config.center = {
                    x: scope.options.size/2,
                    y: scope.options.size/2
                };

                var itemsDiv = element.find(".items");
                var innerDiv = element.find(".inner");


                scope.$watch('list', function(){
                    if(!scope.list || !scope.list.length){
                        return;
                    }
                    //itemsDiv.empty();

                    scope.config.step = PI2 / scope.list.length;

                    var itemsDivArray = itemsDiv.children();

                    var update = [];
                    for(var i=0; i<scope.list.length; i++){
                        var itemSource = scope.list[i];
                        var itemDiv = $(itemsDivArray[i]);
                        var x= scope.config.center.x - scope.config.radius.ext/2 + scope.config.radius.extCenter/2*Math.cos(scope.config.step*i - Math.PI/2);
                        var y= scope.config.center.y - scope.config.radius.ext/2 + scope.config.radius.extCenter/2*Math.sin(scope.config.step*i - Math.PI/2);
                        update.push({
                            itemDiv: itemDiv,
                            x:x,
                            y:y,
                        });
                    }

                    var setUpdate = function(i){
                        $timeout(function(){
                            update[i].itemDiv.css("left",update[i].x);
                            update[i].itemDiv.css("top",update[i].y);
                        },200+100*i);
                    }

                    for(var i=0; i<update.length; i++){
                        setUpdate(i);
                    }
                });
            },
            controller: function ($scope, $rootScope, $element, $location) {

                $scope.ngModel = $scope.ngModel || {};

                $scope.onTouchItem = function(item){
                    $scope.pressedItem = item;
                };

                $scope.onReleaseItem = function(item){
                    toggleSelection(item);
                };

                $scope.onReleaseMain = function(){
                    $scope.pressedItem = undefined;
                };

                var toggleSelection = function(item){
                    if($scope.ngModel.hasOwnProperty(item.serial)){
                        delete  $scope.ngModel[item.serial]
                    } else {
                        $scope.ngModel[item.serial] = item
                    }
                }
            }
        }
    });
