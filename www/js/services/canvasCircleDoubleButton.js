/**
 * Created by adidoo on 08/01/16.
 */
/*

Options:
 options = {
     enableDoubleButton: true,
    doubleButton: {
         showTextOnCircleTouch: true,              // Display Icon normaly, Text on circle touch only - TextCb an IconCb are mandatory
         TextCb: function () {
             return $scope.volume + "%";
        },
        showMiddleText: true,                             // Display Text in the middle normaly, Text on circle touch only - TextCb an IconCb are mandatory
        MiddleTextCb: function () {
            return "My info";
        },
        vertical: true,                              // If vertical, then Button 1 = top, Button 2 = bottom, else Button 1 = left, Button 2 = right
        button1: {
            TextCb: function(){
                return "Sample test";
            },
            IconCb: function(){
                return "F1B9"; // Return unicode
            },
            ActionCb: function(){
                // Do something
            }
        },
        button2: {
            TextCb: function(){
                return "Sample test";
            },
            IconCb: function(){
                return "F1B9"; // Return unicode
            },
            ActionCb: function(){
                // Do something
            }
        },
    }
 }

 */


'use strict';
angular.module('mangoPanel')
    .factory('CanvasCircleDoubleButton', function ($timeout, Color) {

        return {
            Extend: function(CanvasCircle, canvasCircle){

                // Button initialisation
                canvasCircle.options.doubleButton = canvasCircle.options.doubleButton || {};
                canvasCircle.options.doubleButton.touchRadius = canvasCircle.options.doubleButton.touchRadius || 60;               // Button touch radius
                canvasCircle.options.doubleButton.radius = canvasCircle.options.doubleButton.radius || canvasCircle.radius*0.9;     // Button physical radius
                canvasCircle.options.doubleButton.iconFont = canvasCircle.options.doubleButton.iconFont || "Ionicons";              // Font used for Icon related to IconCb unicode return
                canvasCircle.options.doubleButton.iconSize = canvasCircle.options.doubleButton.iconSize || "70px";                  // Icon size in css format
                canvasCircle.options.doubleButton.offset = canvasCircle.options.doubleButton.offset || canvasCircle.options.size/6;  // Icon size in css format

                if(canvasCircle.options.doubleButton.vertical===undefined) canvasCircle.options.doubleButton.vertical = false;

                // Private vars
                canvasCircle.doubleButton = {};
                canvasCircle.doubleButton.button1Pressed = false;
                canvasCircle.doubleButton.button2Pressed = false;


                /**
                 *
                 * @param pressed
                 * @param buttonOption
                 * @constructor
                 */
                CanvasCircle.prototype.DrawDoubleButtonItem = function (pressed, buttonOption, isFirst) {

                    var angleOffset, dx = 0, dy = 0;
                    if(this.options.doubleButton.vertical){
                        angleOffset = isFirst? Math.PI/2 : Math.PI * 3/2;
                        dy = isFirst? -this.options.doubleButton.offset : this.options.doubleButton.offset;
                    }
                    else{
                        angleOffset = isFirst? 0 : Math.PI;
                        dx = isFirst? this.options.doubleButton.offset : -this.options.doubleButton.offset;
                    }

                    if(pressed){
                        //this.DrawFilledGradientCircle('white', '#EFEFEF', this.options.mainButton.touchRadius, this.options.mainButton.radius);
                        this.context.beginPath();
                        this.context.arc(0, 0, this.options.doubleButton.radius, angleOffset, angleOffset + Math.PI, false);
                        // create radial gradient
                        var grd = this.context.createRadialGradient(0, 0, this.options.doubleButton.touchRadius, 0, 0, this.options.doubleButton.radius);
                        grd.addColorStop(0, 'white');
                        grd.addColorStop(1, '#EFEFEF');

                        this.context.fillStyle = grd;
                        this.context.fill();
                    }else{
                        // Draw half circle
                        this.context.beginPath();
                        this.context.arc(0, 0, this.options.doubleButton.radius, angleOffset, angleOffset + Math.PI, false);
                        this.context.strokeStyle = '#EFEFEF';
                        this.context.lineCap = 'round'; // butt, round or square
                        this.context.lineWidth = 2;
                        this.context.stroke();
                    }


                    var icon = buttonOption.icon;
                    if(!icon && buttonOption.IconCb) buttonOption.IconCb();
                    var text = buttonOption.text;
                    if(!text && buttonOption.TextCb) buttonOption.TextCb();

                    if(icon){
                        this.context.save();
                        // Remove rotation, but keep centred
                        this.context.rotate(-(-1 / 2 + this.options.rotateDeg / 180) * Math.PI);
                        var icon = String.fromCharCode(parseInt(icon,16));
                        this.context.font = this.options.doubleButton.iconSize + " " + this.options.doubleButton.iconFont;
                        this.context.fillStyle = "#B2B2B2";
                        this.context.fillText(icon ,dx,dy);
                        this.context.restore();
                    }
                    else if(text){
                        this.context.save();
                        // Remove rotation, but keep centred
                        this.context.rotate(-(-1 / 2 + this.options.rotateDeg / 180) * Math.PI);
                        var text = text;
                        this.context.font = "40px Helvetica Neue";
                        this.context.fillStyle = "#B2B2B2";
                        this.context.fillText(text ,dx,dy);
                        this.context.restore();
                    }
                }

                CanvasCircle.prototype.SplitText = function (text) {
                    if(!text || text.length < 10){
                        return [text];
                    }
                    return text.split(" ");
                }
                /**
                 *
                 * @param data
                 */
                CanvasCircle.prototype.DrawDoubleButton = function (data) {

                    this.context.save();

                    // Pour centrer le text sur la coordonnée donnée
                    this.context.textBaseline = 'middle';
                    this.context.textAlign = "center";

                    if(this.options.doubleButton.showTextOnCircleTouch && this.circlePressed) {
                        if(this.options.doubleButton.TextCb){
                            this.context.save();
                            // Remove rotation, but keep centred
                            this.context.rotate(-(-1 / 2 + this.options.rotateDeg / 180) * Math.PI);
                            var textArray = this.SplitText(this.options.doubleButton.TextCb());
                            this.context.font = "40px Helvetica Neue";
                            this.context.fillStyle = "#B2B2B2";
                            var offset;
                            if(textArray.length%2 === 1){
                                offset = -textArray.length / 2;
                            }else{
                                offset = -(textArray.length-1) / 2;
                            }
                            for(var i=0; i<textArray.length; i++){
                                this.context.fillText(textArray[i] ,0,offset*40);
                                offset++;
                            }
                            this.context.restore();
                        }

                        this.context.restore();
                    }
                    // Display buttons except if ShowCb is defined and return false
                    else if(!this.options.doubleButton.ShowCb || (this.options.doubleButton.ShowCb && this.options.doubleButton.ShowCb())){
                        if(this.options.doubleButton.button1){
                            this.DrawDoubleButtonItem(this.doubleButton.button1Pressed, this.options.doubleButton.button1, true);
                        }
                        if(this.options.doubleButton.button2){
                            this.DrawDoubleButtonItem(this.doubleButton.button2Pressed, this.options.doubleButton.button2, false);
                        }
                    }
                    if(!(this.options.doubleButton.showTextOnCircleTouch && this.circlePressed) &&
                         this.options.doubleButton.showMiddleText && this.options.doubleButton.MiddleTextCb){

                        this.context.save();
                        // Remove rotation, but keep centred
                        this.context.rotate(-(-1 / 2 + this.options.rotateDeg / 180) * Math.PI);
                        var text = this.options.doubleButton.MiddleTextCb();
                        this.context.font = "40px Helvetica Neue";
                        this.context.fillStyle = "#B2B2B2";
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
                CanvasCircle.prototype.GetDoubleButtonTouch = function(event, isDraging, dx, dy, x, y){

                    var _this = this;
                    // Only tap on button, no drag
                    if(this.doubleButton.button1Pressed || this.doubleButton.button2Pressed){
                        return true;
                    }
                    if(isDraging){
                        //this.doubleButton.buttonPressed = false; // Cancel button press and use press for something else - Removed because bad feeling when used
                        return false;
                    }
                    else

                    if( !this.options.doubleButton.vertical && dx<0 ||
                        this.options.doubleButton.vertical && dy<0 ){

                        var cx = dx;
                        var cy = dy;
                        if(this.options.doubleButton.vertical)
                            cy += this.options.doubleButton.offset;
                        else
                            cx += this.options.doubleButton.offset;

                        var distance = Math.sqrt(cx*cx + cy*cy);

                        if(distance < this.options.doubleButton.touchRadius){
                            this.doubleButton.button1Pressed = true;
                            if(this.doubleButton.longPressButton1Tiemout){
                                $timeout.cancel(this.doubleButton.longPressButton1Tiemout);
                            }
                            this.doubleButton.longPressButton1 = false;
                            this.doubleButton.longPressButton1Tiemout = new $timeout(function(){
                                _this.doubleButton.longPressButton1 = true;
                            }, this.options.longPressDelay);
                            this.doubleButton.buttonPressed = true;
                            return true;
                        }
                    }
                    else if( !this.options.doubleButton.vertical && dx>=0 ||
                        this.options.doubleButton.vertical && dy>=0 ){

                        var cx = dx;
                        var cy = dy;
                        if(this.options.doubleButton.vertical)
                            cy -= this.options.doubleButton.offset;
                        else
                            cx -= this.options.doubleButton.offset;

                        var distance = Math.sqrt(cx*cx + cy*cy);

                        if(distance < this.options.doubleButton.touchRadius) {

                            this.doubleButton.button2Pressed = true;
                            if (this.doubleButton.longPressButton2Tiemout) {
                                $timeout.cancel(this.doubleButton.longPressButton2Tiemout);
                            }
                            this.doubleButton.longPressButton2 = false;
                            this.doubleButton.longPressButton2Tiemout = new $timeout(function () {
                                _this.doubleButton.longPressButton2 = true;
                            }, this.options.longPressDelay);
                            this.doubleButton.buttonPressed = true;
                            return true;
                        }
                    }
                    return false;
                };

                CanvasCircle.prototype.OnTouchReleaseDoubleButton = function(){

                    // Call callback
                    if(this.options.doubleButton.button1 &&this.doubleButton.button1Pressed){
                        // On tap
                        if(!this.doubleButton.longPressButton1 && this.options.doubleButton.button1.ActionCb){
                            this.options.doubleButton.button1.ActionCb();
                        }
                        // On press
                        else if(this.doubleButton.longPressButton1 && this.options.doubleButton.button1.LongActionCb){
                            this.options.doubleButton.button1.LongActionCb();
                        }
                        // On release
                        if(this.options.doubleButton.button1.ReleaseActionCb){
                            this.options.doubleButton.button1.ReleaseActionCb();
                        }
                    }
                    if(this.options.doubleButton.button2 &&this.doubleButton.button2Pressed){
                        // On tap
                        if(!this.doubleButton.longPressButton2 && this.options.doubleButton.button2.ActionCb){
                            this.options.doubleButton.button2.ActionCb();
                        }
                        // On press
                        else if(this.doubleButton.longPressButton2 && this.options.doubleButton.button2.LongActionCb){
                            this.options.doubleButton.button2.LongActionCb();
                        }
                        // On release
                        if(this.options.doubleButton.button2.ReleaseActionCb){
                            this.options.doubleButton.button2.ReleaseActionCb();
                        }
                    }
                    // Remove state
                    this.doubleButton.button1Pressed = false;
                    this.doubleButton.button2Pressed = false;
                    this.doubleButton.buttonPressed = false;
                };
            }
        };
    })
