/**
 * Created by adidoo on 28/12/15.
 *
 *
 */
'use strict';
angular.module('mangoPanel')
    .factory('CanvasCircle', function ($ionicPosition, CanvasCircleTouch, CanvasCircleRgb, CanvasCircleMainButton, CanvasCircleDoubleButton, CanvasCircleExtraButton) {

        /**
         * Constructor, with class name
         */
        function CanvasCircle(canvas, options) {

            // Public properties, assigned to the instance ('this')
            this.canvas = canvas;
            this.context = this.canvas.getContext('2d');
            this.options = options || {};

            // Default values
            this.options.padding = this.options.padding || 40;
            if(this.options.gapDeg === undefined) this.options.gapDeg = 30;                                     // Position du début/fin du cercle (180° = en bas)
            this.options.gapRad = this.options.gapDeg / 180 * Math.PI;                                          // This is calculated - must fill the one in degree
            if(this.options.rotateDeg === undefined) this.options.rotateDeg = 180;                              // Position du début/fin du cercle (180° = en bas)
            this.options.rotateRad = this.options.rotateDeg / 180 * Math.PI;                                    // This is calculated - must fill the one in degree
            if(this.options.lineWidth === undefined) this.options.lineWidth = 10;
            if(this.options.backgroundLineWidth === undefined) this.options.backgroundLineWidth = this.options.lineWidth;
            if(this.options.defaultRadius === undefined) this.options.defaultRadius = (this.options.size - this.options.lineWidth) / 2 - this.options.padding;
            if(this.options.disable === undefined) this.options.disable = false;                                // disable circle touch

            // By position
            this.options.positions = this.options.positions || undefined;                                       // Number of position for selector

            this.options.enableRgbPicker   = this.options.enableRgbPicker   || false;
            this.options.enableMainButton  = this.options.enableMainButton  || false;
            this.options.enableExtraButton = this.options.enableExtraButton || false;

            this.PI2 = Math.PI * 2;
            this.radius = (this.options.size - this.options.lineWidth) / 2 - this.options.padding;

            this.config = this.config || {};
            if(this.options.positions) this.config.nbPositions = Object.keys(this.options.positions).length;

            // Manage value range
            this.config.value = {
                step: this.options.step,
                min: this.options.min,
                max: this.options.max,
                range: this.options.max - this.options.min,
                valueToRatio: function(value){                      // Retourne la valeur entre 0 (min) et 1 (max)
                    if(!value)
                        return 0; // For the off state
                    return (value - this.min) / this.range;
                },
                rationToValue: function(ratio){                     // Retourne une valeur entre min et max
                    if(!ratio)
                        return 0; // For the off state
                    return ratio*this.range + this.min;
                },
                discreet: function(value){
                    if(!value)
                        return 0; // For the off state
                    if(this.step){
                        return (Math.round(value/this.step)*this.step);
                    }
                    else{
                        return value;
                    }
                }
            };

            if(this.config.nbPositions && (this.config.nbPositions >=2)){

                this.config.positions = [];

                this.config.positions.radius = this.options.lineWidth/2;

                this.config.positions.step = (this.PI2 - this.options.gapRad*2) / (this.config.nbPositions-1);
                this.config.positions.stepPercent = this.config.value.range / (this.config.nbPositions-1);

                var i=0;
                for (var item in this.options.positions) {
                    if (this.options.positions.hasOwnProperty(item)) {
                        if(i === 0){
                            var angle =  this.options.gapRad;
                            this.config.positions.push({
                                item:item,
                                content:this.options.positions[item],
                                value: angle,
                                percent: this.config.value.min,
                                x: this.radius*Math.cos(angle),
                                y: this.radius*Math.sin(angle)
                            });

                        }
                        else if(i === (this.config.nbPositions-1)) {
                            var angle =  this.PI2 - this.options.gapRad;
                            this.config.positions.push({
                                item:item,
                                content:this.options.positions[item],
                                value: angle,
                                percent:this.config.value.max,
                                x: this.radius*Math.cos(angle),
                                y: this.radius*Math.sin(angle)
                            });
                        }
                        else{
                            var angle = this.options.gapRad + i*this.config.positions.step;
                            this.config.positions.push({
                                item:item,
                                content:this.options.positions[item],
                                value: angle,
                                percent: this.config.value.min + i*this.config.positions.stepPercent,
                                x: this.radius*Math.cos(angle),
                                y: this.radius*Math.sin(angle)
                            });
                        }
                        i++;
                    }
                }
}

            // Prepare orientation for drawing
            this.context.translate(this.options.size / 2, this.options.size / 2); // change to center
            this.context.rotate((-1 / 2 + this.options.rotateDeg / 180) * Math.PI);   // rotate for positioning 0 / 100% (ex: 180 -> At bottom)

            // RGB picker initialisation
            if(this.options.enableRgbPicker){
                CanvasCircleRgb.Extend(CanvasCircle, this);
            }

            if(this.options.enableMainButton){
                CanvasCircleMainButton.Extend(CanvasCircle, this);
            }

            if(this.options.enableDoubleButton){
                CanvasCircleDoubleButton.Extend(CanvasCircle, this);
            }

            if(this.options.enableExtraButton){
                CanvasCircleExtraButton.Extend(CanvasCircle, this);
            }


            // Generic touch functions
            CanvasCircleTouch.Extend(CanvasCircle, this);
        }

        /**
         * Public method, assigned to prototype
         *
         * @param data
         * {
         *   value,         // Between 0 & 1
         *   color,         // Html text color
         *   shadowedValue, // Between 0 & 1
         *   shadowedColor  // Html text color
         * }
         */
        CanvasCircle.prototype.Draw = function (data) {

            // Draw background arc
            this.DrawArc(this.options.backgroundColor, this.options.backgroundLineWidth, 1);

            // Draw value arc
            if(data.value!== undefined && data.color!== undefined){
                if(this.options.vertical){

                    this.DrawArcVertical(data.color, this.options.lineWidth, this.config.value.valueToRatio(data.value));
                }else{
                    this.DrawArc(data.color, this.options.lineWidth, this.config.value.valueToRatio(data.value));
                }
            }

            // Draw shadowedValue
            if(data.shadowedColor != undefined && data.shadowedValue != undefined && data.shadowedValue !== data.value){
                if(this.options.vertical){
                    this.DrawArcVertical(data.shadowedColor, this.options.lineWidth, this.config.value.valueToRatio(data.shadowedValue));
                }else{
                    this.DrawArc(data.shadowedColor, this.options.lineWidth, this.config.value.valueToRatio(data.shadowedValue));
                }
            }

            if(this.options.positions){
                this.DrawPositions(this.config.value.valueToRatio(data.value)*100);
            }
            if(this.options.enableRgbPicker){
                this.DrawRgb();
            }

            if(this.options.enableMainButton){
                this.DrawMainButton();
            }

            if(this.options.enableDoubleButton){
                this.DrawDoubleButton();
            }

            if(this.options.enableExtraButton){
                this.DrawExtraButton();
            }

        };

        /**
         * Clear canvas (before drawing)
         */
        CanvasCircle.prototype.ClearCanvas = function () {
            // Store the current transformation matrix
            this.context.save();

            // Use the identity matrix while clearing the canvas
            this.context.setTransform(1, 0, 0, 1, 0, 0);
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Restore the transform
            this.context.restore();
        };

        /**
         *sudo ad start Draw the progress or backgrounds arcs
         * @param color
         * @param lineWidth     in px
         * @param value         Between 0 and 1
         * @param radius        in px
         * @param fullCircle    boolean, ignore gap
         */
        CanvasCircle.prototype.DrawArc = function(color, lineWidth, value, radius, fullCircle) {

            radius = radius || this.options.defaultRadius;
            value = Math.min(Math.max(0, value), 1);
            this.context.beginPath();

            this.context.arc(0, 0, radius, fullCircle ? 0 : this.options.gapRad, fullCircle ? value * 2 * Math.PI : (this.options.gapRad + (Math.PI - this.options.gapRad) * 2 * value), false);
            this.context.strokeStyle = color;
            this.context.lineCap = 'round'; // butt, round or square
            this.context.lineWidth = lineWidth;
            this.context.stroke();
        };

        // For vertical drawing
        CanvasCircle.prototype.DrawArcVertical = function(color, lineWidth, value, radius, fullCircle) {
            radius = radius || this.options.defaultRadius;
            value = Math.min(Math.max(0, value), 1);
            // Nothing to display at 100%
            if(value===1)
                return;
            this.context.beginPath();
            this.context.arc(0, 0, radius, fullCircle ? value * Math.PI : (this.options.gapRad + (Math.PI - this.options.gapRad) * value), fullCircle ? - value * Math.PI : - (this.options.gapRad + (Math.PI - this.options.gapRad) * value),false);
            this.context.strokeStyle = color;
            this.context.lineCap = 'round'; // butt, round or square
            this.context.lineWidth = lineWidth
            this.context.stroke();
        };
        /**
         * Draw gradient circle between two radius
         * @param colorInner
         * @param colorExt
         * @param radiusInner
         * @param radiusExt
         * @constructor
         */
        CanvasCircle.prototype.DrawFilledGradientCircle = function(colorInner, colorExt, radiusInner, radiusExt) {

            this.context.beginPath();
            this.context.arc(0, 0, radiusExt, 0, this.PI2, false);
            // create radial gradient
            var grd = this.context.createRadialGradient(0, 0, radiusInner, 0, 0, radiusExt);
            grd.addColorStop(0, colorInner);
            grd.addColorStop(1, colorExt);

            this.context.fillStyle = grd;
            this.context.fill();
        };

        CanvasCircle.prototype.DrawPositions = function(targetPercent) {
            // Need at least min and max
            if(!this.config.positions || this.displayDefaultPosition){
                return;
            }

            for(var i = 0; i< this.config.positions.length; i++){
                var color = (targetPercent<(this.config.positions[i].percent-this.config.positions.stepPercent/2))?this.options.backgroundColor:this.options.positionsColor;
                this.context.beginPath();
                this.context.arc(this.config.positions[i].x, this.config.positions[i].y, this.config.positions.radius, 0, this.PI2);
                this.context.strokeStyle = color;
                //this.context.lineWidth = 1
                this.context.stroke();

            }
        };

        CanvasCircle.prototype.CalcPosition = function(targetPercent){
            var result = {};
            var goodPos = false;
            var prev = this.config.positions[0];
            var next = this.config.positions[this.config.positions.length-1];
            for(var i = 0; i < this.config.positions.length; i++){
                if(targetPercent === this.config.positions[i].percent){
                    result.positionItem = this.config.positions[i].item;
                    result.positionContent = this.config.positions[i].content;
                    goodPos = true;
                    break;
                }

                if(this.config.positions[i].percent > prev.percent && this.config.positions[i].percent < targetPercent){
                    prev = this.config.positions[i];
                }
                if(this.config.positions[i].percent < next.percent && this.config.positions[i].percent > targetPercent){
                    next = this.config.positions[i];
                }
            }
            if(goodPos){
                result.percent = targetPercent;
                return result;
            }

            // If here, need to snap on nearest point
            var delta = next.percent - prev.percent;
            if(targetPercent<prev.percent+delta/2){
                result.positionItem = prev.item;
                result.positionContent = prev.content;
                result.percent = prev.percent;
                return result;
            } else {
                result.positionItem = next.item;
                result.positionContent = next.content;
                result.percent = next.percent;
                return result;
            }
        };
        /**
         * Private property
         */
        //var possibleRoles = ['admin', 'editor', 'guest'];

        /**
         * Private function
         */
        //function checkRole(role) {
        //    return possibleRoles.indexOf(role) !== -1;
        //}

        /**
         * Static property
         * Using copy to prevent modifications to private property
         */
        //CanvasCircle.possibleRoles = angular.copy(possibleRoles);

        /**
         * Static method, assigned to class
         * Instance ('this') is not available in static context
         */
        //CanvasCircle.build = function (data) {
        //    if (!checkRole(data.role)) {
        //        return;
        //    }
        //    return new CanvasCircle(
        //        data.first_name,
        //        data.last_name,
        //        data.role,
        //        Organisation.build(data.organisation) // another model
        //    );
        //};

        /**
         * Return the constructor function
         */
        return CanvasCircle;
    })
