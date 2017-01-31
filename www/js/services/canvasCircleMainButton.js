/**
 * Created by adidoo on 08/01/16.
 */
/*

Options:
 options = {
     enableMainButton: true,
    mainButton: {
        color: "#B2B2B2"                                // Text or icon color (only one)
        ColorCb: function(){ return "#B2B2B2"}          // Text or icon color (only one)
        TextCb: function(){                             // Display text
            return "Sample test";
        },
        IconCb: function(){                             // Or displayed Icon
            return "F1B9"; // Return unicode
        },
        ActionCb: function(){},                         // User press the button
        LongActionCb: function(){},                     // User make a long press (define by options.longPressDelay in CanvasCircleTouch)
        ReleaseActionCb: function(){},                  // User release buton
    }
 }

 */


'use strict';
angular.module('mangoPanel')
    .factory('CanvasCircleMainButton', function ($timeout, Color) {

        return {
            Extend: function(CanvasCircle, canvasCircle){

                // Button initialisation
                canvasCircle.options.mainButton = canvasCircle.options.mainButton || {};
                canvasCircle.options.mainButton.touchRadius = canvasCircle.options.mainButton.touchRadius || 70;                // Button touch radius
                canvasCircle.options.mainButton.radius = canvasCircle.options.mainButton.radius || canvasCircle.radius*0.9;     // Button physical radius
                canvasCircle.options.mainButton.color = canvasCircle.options.mainButton.color || "#B2B2B2";                     // Button text or icon color
                canvasCircle.options.mainButton.iconFont = canvasCircle.options.mainButton.iconFont || "Ionicons";              // Font used for Icon related to IconCb unicode return
                canvasCircle.options.mainButton.iconSize = canvasCircle.options.mainButton.iconSize || "120px";                     // Icon size in css format
                canvasCircle.options.mainButton.showTextOnCircleTouch = canvasCircle.options.mainButton.showTextOnCircleTouch || false;                     // Icon size in css format

                // Private vars
                canvasCircle.mainButton = {};
                canvasCircle.mainButton.buttonPressed = false;
                /**
                 *
                 * @param data
                 */
                CanvasCircle.prototype.DrawMainButton = function (data) {

                    this.context.save();

                    // Pour centrer le text sur la coordonnée donnée
                    this.context.textBaseline = 'middle';
                    this.context.textAlign = "center";

                    if(this.mainButton.buttonPressed){
                        this.DrawFilledGradientCircle('white', '#EFEFEF', this.options.mainButton.touchRadius, this.options.mainButton.radius);
                    }else{
                        this.DrawArc('#EFEFEF', 2, 1, this.options.mainButton.radius, true);
                    }

                    if((this.options.mainButton.IconCb || this.options.mainButton.icon) && !(this.options.mainButton.showTextOnCircleTouch && this.circlePressed)){
                        this.context.save();
                        // Remove rotation, but keep centred
                        this.context.rotate(-(-1 / 2 + this.options.rotateDeg / 180) * Math.PI);

                        var iconText;
                        if(this.options.mainButton.IconCb) iconText = this.options.mainButton.IconCb();
                        else iconText = this.options.mainButton.icon;

                        var icon = String.fromCharCode(parseInt(iconText,16));
                        this.context.font = this.options.mainButton.iconSize + " " + this.options.mainButton.iconFont;
                        if(this.options.mainButton.ColorCb){

                        }
                        this.context.fillStyle = this.options.mainButton.ColorCb? this.options.mainButton.ColorCb() : this.options.mainButton.color;
                        this.context.fillText(icon ,0,0);
                        this.context.restore();
                    }
                    else if(this.options.mainButton.TextCb){
                        this.context.save();
                        // Remove rotation, but keep centred
                        this.context.rotate(-(-1 / 2 + this.options.rotateDeg / 180) * Math.PI);
                        var text = this.options.mainButton.TextCb();
                        this.context.font = "40px Helvetica Neue";
                        this.context.fillStyle = this.options.mainButton.ColorCb? this.options.mainButton.ColorCb() : this.options.mainButton.color;
                        this.context.fillText(text ,0,0);
                        this.context.restore();
                    }

                    this.context.restore();
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
                CanvasCircle.prototype.GetMainButtonTouch = function(event, isDraging, dx, dy, x, y){

                    var _this = this;
                    // Only tap on button, no drag
                    if(this.mainButton.buttonPressed){
                        return true;
                    }
                    if(isDraging){
                        //this.mainButton.buttonPressed = false; // Cancel button press and use press for something else
                        return false;
                    }
                    else

                    var distance = Math.sqrt(dx*dx + dy*dy);

                    if(distance < this.options.mainButton.touchRadius){
                        this.mainButton.buttonPressed = true;
                        // Detect long press instead of single tap
                        if(this.mainButton.longPressButtonTiemout){
                            $timeout.cancel(this.mainButton.longPressButtonTiemout);
                        }
                        this.mainButton.longPressButton = false;
                        this.mainButton.longPressButtonTiemout = new $timeout(function(){
                            _this.mainButton.longPressButton = true;
                        }, this.options.longPressDelay);
                        return true;
                    }
                    return false;
                };

                CanvasCircle.prototype.OnTouchReleaseMainButton = function(){

                    // Call callback
                    if(this.mainButton.buttonPressed && this.options.mainButton.ActionCb){
                        this.options.mainButton.ActionCb();
                    }
                    if(this.options.mainButton.buttonPressed){
                        // On press
                        if(this.mainButton.longPressButton && this.options.mainButton.button1.LongActionCb){
                            this.options.mainButton.LongActionCb();
                        }// On tap
                        else if(this.options.mainButton.ActionCb){
                            this.options.mainButton.ActionCb();
                        }

                        // On release
                        if(this.options.mainButton.ReleaseActionCb){
                            this.options.mainButton.ReleaseActionCb();
                        }
                    }
                    // Remove state
                    this.mainButton.buttonPressed = false;
                };
            }
        };
    })
