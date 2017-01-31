/**
 * Created by adidoo on 28/12/15.
 */
'use strict';
angular.module('mangoPanel')
    .factory('CanvasCircleTouch', function () {

        return {
            Extend: function(CanvasCircle, canvasCircle){

                canvasCircle.pressed = false;
                canvasCircle.circlePressed = false;
                canvasCircle.rgbPressed = false;

                canvasCircle.options.longPressDelay = canvasCircle.options.longPressDelay || 300;
                /**
                 * On touch event, get angle from center
                 * @param event         Ionic event
                 * @param isDraging     Difference between 'touch' and 'drag' events
                 * @param dx            Horizontal offset in pixel from center
                 * @param dy            Vertical offset in pixel from center
                 * @returns             Angle in radian
                 */
                CanvasCircle.prototype.GetTouchAngle = function(event, isDraging, dx, dy){
                    var distance = Math.sqrt(dx*dx + dy*dy);

                    // Get tolerance for circle selection
                    var extRadius = (this.options.size - this.options.lineWidth)/2 + this.options.lineWidth*2 - this.options.padding;


                    var innerRadius;
                    if(this.options.enableRgbPicker){
                        innerRadius = (this.options.size - this.options.lineWidth)/2  - this.options.lineWidth - this.options.padding;
                    }
                    else if(this.options.displayInnerButton) {
                        innerRadius = this.config.buttonRadius;
                    }
                    else{
                        // S'il n'y a rien au millieu, nous avons plus de place pour sélectionner le cercle
                        innerRadius = this.options.defaultRadius/10;
                    }

                    if(this.options.enableRgbPicker || !this.options.hasExtraButtons){
                        extRadius = this.options.size;
                    }

                    if(isDraging!==true && (distance > extRadius || distance < innerRadius)){
                        return;
                    }

                    // If touched position accepted, we can stop propagation
                    event.stopPropagation();
                    event.preventDefault();

                    // Compute angle between 0 and current position

                    var endAngle = (Math.atan2(dx, -dy) + this.PI2 - this.options.rotateRad)/* % this.PI2*/;

                    //// Set angle in precentage
                    var endValue = 0;

                    if(endAngle < this.options.gapRad){
                        endValue = 0;
                    }
                    else if(endAngle > (this.PI2 - this.options.gapRad)){
                        endValue = this.config.value.max;
                    }
                    else{
                        //endValue = parseInt((endAngle - this.options.gapRad) / (this.PI2-this.options.gapRad*2) * 100);
                        endValue = this.config.value.discreet(
                            this.config.value.rationToValue(
                                (endAngle - this.options.gapRad) / (this.PI2-this.options.gapRad*2)));
                    }

                    if(endValue>this.config.value.max) endValue = this.config.value.max;
                    if(endValue<this.config.value.min)   endValue = this.config.value.min;

                    // Si le cercle est complet, cela permet de ne pas faire un tour complet et aide à atteindre les min et max
                    if(isDraging && !this.options.gapRad){
                        if(endValue > (this.config.value.step*0.75) && this.ngModel < (this.config.value.step*0.25)){
                            endValue = this.config.value.min;
                        }else if(endValue < (this.config.value.step*0.25) && this.ngModel > (this.config.value.step*0.75)){
                            endValue = this.config.value.max;
                        }
                    }

                    return endValue;
                };

                /**
                 * On touch event, get vertical position from bottom
                 * @param event         Ionic event
                 * @param isDraging     Difference between 'touch' and 'drag' events
                 * @param dy            Vertical offset in pixel from center
                 * @returns             Position from bottom from 0% to 100%
                 */
                CanvasCircle.prototype.GetTouchVertical = function(event, isDraging, dy){

                    var extRadius = (this.options.size - this.options.lineWidth)/2 + this.options.lineWidth/2 - this.options.padding;
                    if(isDraging!==true && (dy > extRadius)){
                        return;
                    }

                    event.stopPropagation();
                    event.preventDefault();

                    // Express position as percentage
                    var endPercent = parseInt(((-dy / (extRadius) * 100 )+100)/2);

                    if(endPercent>100) endPercent = 100;
                    if(endPercent<0)   endPercent = 0;

                    return endPercent;
                };

                /**
                 * Called on 'touch' or 'drag' ionic events
                 * @param event         Ionic event
                 * @param isDraging     Difference between 'touch' and 'drag' events
                 * @param dx            Horizontal offset in pixel from center
                 * @param dy            Vertical offset in pixel from center
                 * @returns             true if need to redraw tile
                 * @constructor
                 */
                CanvasCircle.prototype.OnTouch = function(event, isDraging, x, y){

                    this.pressed = true;

                    // Get coords from center
                    var dx = x - this.canvas.width/2;
                    var dy = y - this.canvas.height/2;

                    if(!this.circlePressed){
                        // Get Main button if enable
                        if(this.options.enableMainButton && this.GetMainButtonTouch(event, isDraging, dx, dy, x, y)){
                            return true; // Action validated by MainButton
                        }
                        /// Get Double button if enable
                        else if(this.options.enableDoubleButton && this.GetDoubleButtonTouch(event, isDraging, dx, dy, x, y)){
                            return true; // Action validated by MainButton
                        }

                        // Get Extra button if enable
                        if(this.options.enableExtraButton && this.GetExtraButtonTouch(event, isDraging, dx, dy, x, y)){
                            return true; // Action validated by ExtraButton
                        }

                        // Get color if enable
                        if(this.options.enableRgbPicker || this.rgbPressed){
                            var rgbColor = this.GetRgbTouch(event, isDraging, dx, dy, x, y);
                            //if(!isDraging) this.rgbPressed = true;
                            if(rgbColor){
                                this.options.SetRgbColor(rgbColor);
                                this.rgbPressed = true;
                                return true; // Action validated by RgbPicker
                            }
                            else if(this.rgbPressed){
                                return true; // Keep dragging on rgb
                            }
                        }
                    }

                    if(!this.options.disable){
                        // Get circle value
                        var newTargetPercent;

                        if(this.options.vertical){
                            newTargetPercent = this.GetTouchVertical(event, isDraging, dy);
                        }
                        else {
                            newTargetPercent = this.GetTouchAngle(event, isDraging, dx, dy);
                        }



                        if(newTargetPercent!==undefined){

                            // Snap to position
                            if(this.config.positions){
                                var res = this.CalcPosition(newTargetPercent);
                                newTargetPercent = res.percent;
                                this.options.SetPosition(res);
                            }

                            this.circlePressed = true;
                            if(this.options.displayTarget){
                                this.options.SetTargetPercent(newTargetPercent);
                            }else{
                                this.options.SetNgModel(newTargetPercent);
                            }
                            this.mode="circle";
                            return true; // Something as change. Can refresh drawing
                        }
                    }

                    // Nothing change. Update is not mandatory
                    return false;
                };

                CanvasCircle.prototype.OnTouchRelease = function(){
                    // Reset press mode
                    this.mode=null;
                    this.pressed = false;
                    this.circlePressed = false;
                    this.rgbPressed = false;
                    this.extraButtonPressed = false;
                    if(this.options.enableMainButton){
                        this.OnTouchReleaseMainButton();
                    }
                    if(this.options.enableExtraButton){
                        this.OnTouchReleaseExtraButton();
                    }
                    if(this.options.enableDoubleButton){
                        this.OnTouchReleaseDoubleButton();
                    }
                    if(this.options.OnTouchReleaseCb){
                        this.options.OnTouchReleaseCb();
                    }
                };

            }
        };
    })

