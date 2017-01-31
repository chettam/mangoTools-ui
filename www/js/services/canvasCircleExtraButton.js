/**
 * Created by adidoo on 08/01/16.
 *
 * options = {
 *  enableExtraButton: true;
 *  extraButton: {
 *      buttonTopLeft: {
 *          // icon or text or IconCb or TextCb
 *          icon: 'F1B9',
 *          text: 'A',
 *          IconCb: function(){
 *              return 'F1B9';
 *          },
 *          TextCb: function(){
 *              return 'A';
 *          },
 *          // color or ColorCb
 *          color: '#EDEDED',
 *          ColorCb: function(){
 *              return ''
 *          },
 *          // circleColor or CircleColorCb
 *          circleColor: '#EDEDED',
 *          CircleColorCb: function(){
 *              return ''
 *          },
 *          // backgroundColor or BackgroundColorCb
 *          backgroundColor: 'white',
 *          BackgroundColorCb: function(){
 *              return ''
 *          }
 *          ActionCb: function(){
 *              // Do something
 *          }
 *      },
 *      buttonTopRight: {
 *          ...
 *      },
 *      buttonBottomLeft: {
 *          ...
 *      },
 *      buttonBottomRight: {
 *          ...
 *      },
 *  }
 * }
 */
'use strict';
angular.module('mangoPanel')
    .factory('CanvasCircleExtraButton', function () {

        return {
            Extend: function(CanvasCircle, canvasCircle){

                // RGB picker initialisation
                canvasCircle.options.extraButton = canvasCircle.options.extraButton || {};
                canvasCircle.options.extraButton.radius = canvasCircle.options.extraButton.radius || 30;
                canvasCircle.options.extraButton.touchRadius = canvasCircle.options.extraButton.touchRadius || 40;
                canvasCircle.options.extraButton.padding = canvasCircle.options.extraButton.padding || 10;

                canvasCircle.extraButton = {
                    offset: Math.round(canvasCircle.options.size/2 - canvasCircle.options.extraButton.padding - canvasCircle.options.extraButton.radius)
                };

                // Initialize default value for defined button
                var setDefault = function(buttonOptions){
                    if(!buttonOptions.ColorCb){
                        buttonOptions.color = buttonOptions.color || 'transparent';
                    }
                    if(!buttonOptions.CircleColorCb){
                        buttonOptions.circleColor = buttonOptions.circleColor || 'transparent';
                    }
                    if(!buttonOptions.BackgroundColorCb){
                        buttonOptions.backgroundColor = buttonOptions.backgroundColor || 'transparent';
                    }
                    buttonOptions.iconFont = buttonOptions.iconFont || "Ionicons";              // Font used for Icon related to IconCb unicode return
                    buttonOptions.iconSize = buttonOptions.iconSize || "30px";                  // Icon size in css format

                }
                if(canvasCircle.options.extraButton.buttonTopLeft){
                    setDefault(canvasCircle.options.extraButton.buttonTopLeft);
                }
                if(canvasCircle.options.extraButton.buttonTopRight){
                    setDefault(canvasCircle.options.extraButton.buttonTopRight);
                }
                if(canvasCircle.options.extraButton.buttonBottomLeft){
                    setDefault(canvasCircle.options.extraButton.buttonBottomLeft);
                }
                if(canvasCircle.options.extraButton.buttonBottomRight){
                    setDefault(canvasCircle.options.extraButton.buttonBottomRight);
                }

                /**
                 * Draw button
                 * @param buttonOption
                 */
                CanvasCircle.prototype.DrawExtraButtonItem = function(buttonOption, buttonPressed, x, y){
                    var color = buttonOption.color || buttonOption.ColorCb();
                    var circleColor = buttonOption.circleColor || buttonOption.CircleColorCb();
                    var backgroundColor = buttonOption.backgroundColor || buttonOption.BackgroundColorCb();

                    this.context.save();

                    this.context.translate(x, y); // change center
                    this.context.textBaseline = 'middle';
                    this.context.textAlign = "center";

                    this.DrawArc(color, 2, 1, this.options.extraButton.radius,true);

                    if(buttonPressed){
                        this.DrawFilledGradientCircle(backgroundColor, circleColor, this.options.extraButton.radius, this.options.extraButton.touchRadius);
                    }else{
                        this.DrawArc(circleColor, 2, 1, this.options.extraButton.radius, true);
                    }

                    var icon = buttonOption.icon;
                    if(!icon && buttonOption.IconCb) icon = buttonOption.IconCb();
                    var text = buttonOption.text;
                    if(!text && buttonOption.TextCb) text = buttonOption.TextCb();

                    if(icon){
                        this.context.save();
                        // Remove rotation, but keep centred
                        this.context.rotate(-(-1 / 2 + this.options.rotateDeg / 180) * Math.PI);
                        var iconVal = String.fromCharCode(parseInt(icon,16));
                        this.context.font = buttonOption.iconSize + " " + buttonOption.iconFont;
                        this.context.fillStyle = color;
                        this.context.fillText(iconVal ,0,0);
                        this.context.restore();
                    }
                    else if(text){
                        this.context.save();
                        // Remove rotation, but keep centred
                        this.context.rotate(-(-1 / 2 + this.options.rotateDeg / 180) * Math.PI);
                        this.context.font = "30px Helvetica Neue";
                        this.context.fillStyle = color;
                        this.context.fillText(text ,0,0);
                        this.context.restore();
                    }

                    this.context.restore();
                }

                /**
                 *
                 * @param data
                 */
                CanvasCircle.prototype.DrawExtraButton = function (data) {


                    if(this.options.extraButton.buttonTopLeft){
                        this.DrawExtraButtonItem(this.options.extraButton.buttonTopLeft, this.extraButton.buttonTopLeftPressed, -this.extraButton.offset, this.extraButton.offset);
                    }
                    if(this.options.extraButton.buttonTopRight){
                        this.DrawExtraButtonItem(this.options.extraButton.buttonTopRight, this.extraButton.buttonTopRightPressed, -this.extraButton.offset, -this.extraButton.offset);
                    }
                    if(this.options.extraButton.buttonBottomLeft){
                        this.DrawExtraButtonItem(this.options.extraButton.buttonBottomLeft, this.extraButton.buttonBottomLeftPressed, this.extraButton.offset, this.extraButton.offset);
                    }
                    if(this.options.extraButton.buttonBottomRight){
                        this.DrawExtraButtonItem(this.options.extraButton.buttonBottomRight, this.extraButton.buttonBottomRightPressed, this.extraButton.offset, -this.extraButton.offset);
                    }
                };

                /**
                 * Get selected color if any
                 * @param event         touch event
                 * @param isDraging     touch event occured during a drag
                 * @param dx            horizontal distance to center in pixel
                 * @param dy            vertical distance to center in pixel
                 * @param x             absolute horizontal position
                 * @param y             absolute verticale position
                 * @returns Color       {r: *, g: *, b: *}
                 */
                CanvasCircle.prototype.GetExtraButtonTouch = function(event, isDraging, dx, dy, x, y){

                    if(isDraging && this.extraButtonPressed){
                        return true; // Cancel other actions
                    }

                    var cx, cy;
                    if(this.options.extraButton.buttonTopLeft){
                        cx = dx + this.extraButton.offset;
                        cy = dy + this.extraButton.offset;
                        var distance = Math.sqrt(cx*cx + cy*cy);

                        if(distance < this.options.extraButton.touchRadius){
                            this.extraButton.ActionCb = this.options.extraButton.buttonTopLeft.ActionCb;
                            this.extraButton.buttonTopLeftPressed = true;
                            this.extraButtonPressed = true;
                            return true;
                        }
                    }
                    if(this.options.extraButton.buttonTopRight){
                        cx = dx - this.extraButton.offset;
                        cy = dy + this.extraButton.offset;
                        var distance = Math.sqrt(cx*cx + cy*cy);

                        if(distance < this.options.extraButton.touchRadius){
                            this.extraButton.ActionCb = this.options.extraButton.buttonTopRight.ActionCb;
                            this.extraButton.buttonTopRightPressed = true;
                            this.extraButtonPressed = true;
                            return true;
                        }

                    }
                    if(this.options.extraButton.buttonBottomLeft){
                        cx = dx + this.extraButton.offset;
                        cy = dy - this.extraButton.offset;
                        var distance = Math.sqrt(cx*cx + cy*cy);

                        if(distance < this.options.extraButton.touchRadius){
                            this.extraButton.ActionCb = this.options.extraButton.buttonBottomLeft.ActionCb;
                            this.extraButton.buttonBottomLeftPressed = true;
                            this.extraButtonPressed = true;
                            return true;
                        }

                    }
                    if(this.options.extraButton.buttonBottomRight){
                        cx = dx - this.extraButton.offset;
                        cy = dy - this.extraButton.offset;
                        var distance = Math.sqrt(cx*cx + cy*cy);

                        if(distance < this.options.extraButton.touchRadius){
                            this.extraButton.ActionCb = this.options.extraButton.buttonBottomRight.ActionCb;
                            this.extraButton.buttonBottomRightPressed = true;
                            this.extraButtonPressed = true;
                            return true;
                        }
                    }
                    return false;
                };

                CanvasCircle.prototype.OnTouchReleaseExtraButton = function(){


                    // Call callback
                    if(this.options.extraButton.buttonTopLeft && this.extraButton.buttonTopLeftPressed){
                        if(this.options.extraButton.buttonTopLeft.ActionCb)
                            this.options.extraButton.buttonTopLeft.ActionCb();
                        this.extraButton.buttonTopLeftPressed = false;
                    }
                    else if(this.options.extraButton.buttonTopRight && this.extraButton.buttonTopRightPressed){
                        if(this.options.extraButton.buttonTopRight.ActionCb)
                            this.options.extraButton.buttonTopRight.ActionCb();
                        this.extraButton.buttonTopRightPressed = false;
                    }
                    else if(this.options.extraButton.buttonBottomLeft && this.extraButton.buttonBottomLeftPressed){
                        if(this.options.extraButton.buttonBottomLeft.ActionCb)
                            this.options.extraButton.buttonBottomLeft.ActionCb();
                        this.extraButton.buttonBottomLeftPressed = false;
                    }
                    else if(this.options.extraButton.buttonBottomRight && this.extraButton.buttonBottomRightPressed){
                        if(this.options.extraButton.buttonBottomRight.ActionCb)
                            this.options.extraButton.buttonBottomRight.ActionCb();
                        this.extraButton.buttonBottomRightPressed = false;
                    }
                };

            }
        };
    })
