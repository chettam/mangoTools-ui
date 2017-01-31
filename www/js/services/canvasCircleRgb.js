/**
 * Created by adidoo on 28/12/15.
 */
'use strict';
angular.module('mangoPanel')
    .factory('CanvasCircleRgb', function () {

        return {
            Extend: function(CanvasCircle, canvasCircle){

                // RGB picker initialisation
                canvasCircle.imageReady = false;
                canvasCircle.image = new Image();
                canvasCircle.image.onload = function () {
                    canvasCircle.imageReady = true;
                    canvasCircle.options.AsyncUpdate();
                }
                canvasCircle.image.src = "img/color_wheel.png";
                /**
                 *
                 * @param data
                 */
                CanvasCircle.prototype.DrawRgb = function (data) {

                    // Draw background arc
                    if(this.imageReady){
                        // TODO: Relative size
                        var size = this.canvas.width - 148;
                        var orig = -this.canvas.width / 2 + (this.canvas.width - size) / 2;
                        this.context.drawImage(this.image, orig, orig, size, size); // draw the image on the canvas
                        this.DrawArc(this.options.backgroundColor, 2, 1, this.radius-this.options.lineWidth*1.1, 1, true);
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
                CanvasCircle.prototype.GetRgbTouch = function(event, isDraging, dx, dy, x, y){
                    if(!this.imageReady){
                        return;
                    }

                    var distance = Math.sqrt(dx*dx + dy*dy);
                    var extRadius = (this.options.size - this.options.lineWidth)/2  - this.options.lineWidth - this.options.padding;

                    if(distance > extRadius){
                        return;
                    }

                    var imageData = this.context.getImageData(x, y, 1, 1);
                    var pixel = [ imageData.data[0], imageData.data[1], imageData.data[2], imageData.data[3]] ;

                    for(var i=1; i<4; i++){
                        pixel[0] += imageData.data[i*4];
                        pixel[1] += imageData.data[i*4+1];
                        pixel[2] += imageData.data[i*4+2];
                        pixel[3] += imageData.data[i*4+3];
                    }

                    pixel[0] = parseInt(pixel[0]/4);
                    pixel[1] = parseInt(pixel[1]/4);
                    pixel[2] = parseInt(pixel[2]/4);
                    pixel[3] = parseInt(pixel[3]/4);

                    // If not transparent
                    if(pixel[3] !== 0) {
                        return {
                            r: pixel[0],
                            g: pixel[1],
                            b: pixel[2]
                        };
                    }
                };
            }
        };
    })
