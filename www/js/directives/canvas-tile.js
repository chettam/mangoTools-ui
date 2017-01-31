/**
 * Created by bosc on 22/06/2015.
 */
'use strict';

angular.module('mangoPanel')
    .directive('canvasTile', function ($ionicGesture, $ionicSlideBoxDelegate, $ionicPosition, $timeout, CanvasCircle) {
        return {
            restrict: 'A',
            scope: {
                ngModel:'=?',               // Not watched, if update needed, $broadcast('update');
                position:'=?',              // Not watched, if update needed, $broadcast('update');
                rgbColor:'=?',              // Not watched, if update needed, $broadcast('update');
                ngColor:'=?',               // Not watched, if update needed, $broadcast('update');
                ngGetText:'&?',
                options:'=?',               // Not watched, if update needed, $broadcast('update_options');

            },
            link: function postLink(scope, element) {

                element.addClass("progress-circle");

                /**
                 * Create or recreate canvas on the tile
                 */
                scope.CreateCanvas = function(){
                    element.css({width: scope.options.size, height: scope.options.size});

                    element.find("canvas").remove();

                    scope.canvas = document.createElement('canvas');
                    scope.canvas.width = scope.canvas.height = scope.options.size;

                    element[0].insertBefore(scope.canvas, element[0].firstChild);

                    scope.context = scope.canvas.getContext('2d');

                    scope.$canvas = element.find('canvas');
                };

                /**
                 * Update tile display
                 * Called when data values are changed (after broadcasting or emitting a 'update' event)
                 */
                scope.Update = function(){

                    if(!scope.options){
                        return;
                    }

                    if(scope.position){
                        if(scope.position === -1){
                            scope.ngModel = 100;
                            scope.options.displayTarget = false;
                        }
                    }

                    // Prepare values

                    if(scope.ngModel>scope.config.value.max)
                        scope.ngModel = scope.config.value.max;
                    if(scope.ngModel!==0 && scope.ngModel<scope.config.value.min) // If 0 then Off so we keep it like this
                        scope.ngModel = scope.config.value.min;

                    // Format value
                    var value;

                    value = Math.round(scope.ngModel);
                    if(scope.config.positions){
                        var res = CanvasCircle.CalcPosition(scope.ngModel);
                        value = res.percent;
                    }


                    //Format color
                    var color;

                    if(scope.options.enableRgbPicker){
                        if(scope.rgbColor){
                            scope.rgbColor.r = Math.round(scope.rgbColor.r);
                            scope.rgbColor.g = Math.round(scope.rgbColor.g);
                            scope.rgbColor.b = Math.round(scope.rgbColor.b);
                            color = 'rgb('+scope.rgbColor.r+','+scope.rgbColor.g+','+scope.rgbColor.b+')';
                        } else{
                            color = scope.ngColor || scope.options.color;
                        }
                    }
                    else{
                        color = scope.ngColor || scope.options.color || scope.ColorCb();
                    }

                    // Format Shadowed value
                    var shadowedValue;

                    if(scope.options.displayTarget) {
                        if (scope.targetPercent > scope.config.value.max)
                            scope.targetPercent = scope.config.value.max;
                        if (scope.targetPercent !== 0 && scope.targetPercent < scope.config.value.min) // If 0 then Off so we keep it like this
                            scope.targetPercent = scope.config.value.min;

                        shadowedValue = Math.round(scope.targetPercent);
                        if (scope.config.positions) {
                            var res = calcPosition(scope.targetPercent);
                            shadowedValue = res.percent;
                        }
                    }
                    // Format Shadowed color
                    var shadowedColor;
                    if(scope.options.displayTarget) {
                        if(scope.options.enableRgbPicker){
                            if(scope.rgbColor){
                                scope.rgbColor.r = Math.round(scope.rgbColor.r);
                                scope.rgbColor.g = Math.round(scope.rgbColor.g);
                                scope.rgbColor.b = Math.round(scope.rgbColor.b);
                                shadowedColor = 'rgba('+scope.rgbColor.r+','+scope.rgbColor.g+','+scope.rgbColor.b+',0.3)';
                            } else{
                                shadowedColor = scope.ngColor || scope.options.color;
                            }
                        }
                        else{
                            shadowedColor = scope.ngColor || scope.options.color || scope.ColorCb();
                        }
                    }


                    var data = {
                        value: value,
                        color: color,
                        shadowedValue: shadowedValue,
                        shadowedColor: shadowedColor
                    };
                    scope.canvasCircle.ClearCanvas();
                    scope.canvasCircle.Draw(data);
                };

                /**
                 * Notify controller that data changed
                 */
                scope.Notify = function(){
                    if(scope.options.onTouchSliderCallback){
                        if(scope.options.positions){
                            var result;
                            if(scope.options.displayTarget){
                                result = calcPosition(scope.targetPercent);
                            }else{
                                result = calcPosition(scope.ngModel);
                            }
                            scope.options.onTouchCallback(result.percent, result.positionItem, result.positionContent);
                        }
                        else if(scope.options.displayTarget) {
                            scope.options.onTouchCallback(scope.targetPercent,null,scope.rgbColor);
                        }
                        else {
                            scope.options.onTouchCallback(scope.ngModel,null,scope.rgbColor);
                        }
                    }
                    //if(scope.options.button){
                    //    if(scope.buttonPressed){
                    //        if(scope.options.buttonCallback){
                    //            scope.options.buttonCallback();
                    //        }
                    //    }
                    //}
                };

                /**
                 * Called when initial options are modified (at creation or after broadcasting or emitting an 'update_options' event)
                 */
                scope.UpdateOption = function(){

                    if(!scope.options){
                        return;
                    }

                    // Add internal options
                    //395;
                    scope.options.size = scope.options.size || 700;                                                       // 100 px square for display
                    scope.options.color = scope.options.color || '#ff8a65'; //'rgb(255, 138, 101)'
                    scope.options.backgroundColor = scope.options.backgroundColor || '#dddddd';

                    if(scope.options.step === undefined) scope.options.step = 1; // Pas d'increment. Si 0, alors float
                    if(scope.options.min === undefined) scope.options.min =   0; // Valeur min (par defaut, 0%)
                    if(scope.options.max === undefined) scope.options.max = 100; // Valeur max (par defaut, 100%)


                    scope.options.AsyncUpdate = function(cb){
                        scope.$apply(function(){
                            if(cb){
                                cb();
                            }
                            else{
                                scope.Update();
                            }
                        })
                    }

                    scope.options.SetNgModel = function(value){
                        scope.ngModel = value;
                        if(scope.options.OnNgModelUpdate){
                            scope.options.OnNgModelUpdate(scope.ngModel);
                        }
                    }

                    scope.options.SetTargetPercent = function(value){
                        scope.targetPercent = value;
                        if(scope.options.OnTargetPercentUpdate){
                            scope.options.OnTargetPercentUpdate(scope.targetPercent);
                        }

                        // Reset TargetPercent after 1 sec. Must not be displayed if value changed from external.
                        // Just shown when waiting for ng-model to be updated.
                        if(scope.ClearTargetPercentTimeout){
                            $timeout.cancel(scope.ClearTargetPercentTimeout);
                            delete scope.ClearTargetPercentTimeout;
                        }
                        scope.ClearTargetPercentTimeout = $timeout(function(){
                            scope.targetPercent = undefined;
                        },1000);
                    }

                    scope.options.SetPosition = function(posObj){
                        console.log(posObj)
                        scope.position = posObj.positionItem;
                        if(scope.options.OnPositionUpdate){
                            scope.options.OnPositionUpdate(scope.position);
                        }
                    }

                    scope.options.SetRgbColor = function(value){
                        scope.rgbColor = value;
                        if(scope.options.OnRgbColorUpdate){
                            scope.options.OnRgbColorUpdate(scope.rgbColor);
                        }
                    }

                    // Create config values
                    scope.config = scope.config || {};
                    if(scope.options.positions) scope.config.nbPositions = Object.keys(scope.options.positions).length;

                    // Ajout d'une gestion de plage de valeur au lieu du pourcentage
                    scope.config.value = {
                        step: scope.options.step,
                        min: scope.options.min,
                        max: scope.options.max,
                        range: scope.options.max - scope.options.min,
                        valueToRatio: function(value){                      // Retourne la valeur entre 0 (min) et 1 (max)
                            if(!value)
                                return 0; // For the off state
                            return (value - scope.config.value.min) / scope.config.value.range;
                        },
                        rationToValue: function(ratio){                     // Retourne une valeur entre min et max
                            if(!ratio)
                                return 0; // For the off state
                            return ratio*scope.config.value.range + scope.config.value.min;
                        },
                        discreet: function(value){
                            if(!value)
                                return 0; // For the off state
                            if(scope.config.value.step){
                                return (Math.round(value/scope.config.value.step)*scope.config.value.step);
                            }
                            else{
                                return value;
                            }
                        }
                    };

                    scope.CreateCanvas();

                    // Create main Canvas managed class

                    scope.canvasCircle = new CanvasCircle(scope.canvas, scope.options);

                    // Override some options



                    // Bind touch events

                    $ionicGesture.on('touch', scope.OnCanvas, scope.$canvas);
                    $ionicGesture.on('drag',  function(event){scope.OnCanvas(event,true);}, scope.$canvas);

                    // Tiles are used inside an Ionic Slide Box. It must be disabled when touch is inside a tile. We use $ionicSlideBoxDelegate.enableSlide
                    $ionicGesture.on('touch', function(event){
                        $ionicSlideBoxDelegate.enableSlide( false );
                    }, scope.$canvas);
                    $ionicGesture.on('release', function(event){
                        // Re activate Slide Box sliding
                        $ionicSlideBoxDelegate.enableSlide( true );

                        scope.canvasCircle.OnTouchRelease();

                        // Notify Release callback if needed
                        if(scope.options.onReleaseCallback){
                            scope.options.onReleaseCallback();
                        }

                        // Update on release
                        scope.Update();

                    }, scope.$canvas);

                    // Update drawing
                    scope.Update();
                };

                /**
                 * Main touch function called on 'touch' or 'drag' event
                 * @param event         Ionic event
                 * @param isDraging     Difference between 'outch' and 'drag'
                 */
                scope.OnCanvas = function(event, isDraging) {

                    // Get angle from position
                    var canvasOffset = $ionicPosition.offset(scope.$canvas);
                    var touch = event.gesture.touches[0];
                    // taking offset into consideration
                    var x = touch.pageX - canvasOffset.left;
                    var y = touch.pageY - canvasOffset.top;

                    var isChanged = scope.canvasCircle.OnTouch(event, isDraging, x, y);

                    if(isChanged){
                        //scope.Notify();
                        scope.$apply(function() {
                            scope.Update();
                        });
                    }
                }

                scope.$on('update_options', scope.UpdateOption);
                scope.$on('update', scope.Update);

                // Launch at startup
                scope.UpdateOption();

            }
        }
    });
