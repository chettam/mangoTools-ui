/**
 * Created by bosc on 22/06/2015.
 */
'use strict';

angular.module('mangoPanel')
    .directive('progressCircle', function ($ionicGesture, $ionicSlideBoxDelegate, $ionicPosition) {
        return {
            restrict: 'A',
            scope: {
                ngModel:'=?',
                ngGetText:'&?',
                setTargetValue:'=?',        // Used to force new value from external.
                options:'=?',
                position:'=?',
                rgbColor:'=?',
                ngColor:'=?',

            },
            link: function postLink(scope, element) {

                var PI2 = Math.PI*2;
                // progress-circle class restricts the size of the Circle to 395x 395
                if(!scope.options.hasOwnProperty('addProgressClass') || scope.options.addProgressClass == undefined){
                    element.addClass("progress-circle");
                 }

                scope.$watch('options', function(){

                    scope.options = scope.options || {};
                    scope.options.vertical = scope.options.vertical || false;
                    scope.options.rotate = scope.options.rotate || 180;                                                 // Position du début/fin du cercle (180° = en bas)
                    scope.options.gap = scope.options.gap || 0;                                                         // Si le cercle n'est pas complet.
                    scope.options.button = scope.options.button || false;                                               // Si on simule un bouton
                    scope.options.hasExtraButtons = scope.options.hasExtraButtons || false;                             // Si la tile utilise des boutons dans les coins
                    scope.options.buttonCallback = scope.options.buttonCallback || null;
                    scope.options.size = scope.options.size || 426;
                    scope.options.padding = scope.options.padding || 30;
                    scope.options.color = scope.options.color || '#ff8a65'; //'rgb(255, 138, 101)'
                    scope.options.backgroundColor = scope.options.backgroundColor || '#dddddd';
                    scope.options.lineWidth = scope.options.lineWidth || 10;
                    scope.options.disable = scope.options.disable || false;
                    scope.options.displayTarget = scope.options.displayTarget || false;
                    scope.options.targetColor = scope.options.targetColor || 'rgba(255, 138, 101, 0.3)';
                    scope.options.positions = scope.options.positions || undefined; // Pour les selecteurs comme les scenes
                    if(scope.options.step === undefined) scope.options.step = 1; // Pas d'increment. Si 0, alors float
                    scope.options.min = scope.options.min || 0; // Valeur min (par defaut, 0%)
                    scope.options.max = scope.options.max || 100; // Valeur max (par defaut, 100%)

                    scope.options.positionsColor = scope.options.positionsColor || scope.options.color;
                    scope.options.onTouchCallback = scope.options.onTouchCallback || null;
                    scope.options.onReleaseCallback = scope.options.onReleaseCallback || null;
                    scope.options.displayRgbPicker = scope.options.displayRgbPicker || false;

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

                    // Configuration pour les bouttons:
                    scope.config.buttonRadius = 50;

                    if(scope.ngModel === undefined) scope.ngModel = 100;

                    scope.ngColor = scope.ngColor || scope.options.color;

                    scope.mode = null;
                    scope.rotateRad = scope.options.rotate / 180 * Math.PI;

                    element.css({width: scope.options.size, height: scope.options.size});

                    element.find("canvas").remove();

                    scope.canvas = document.createElement('canvas');
                    scope.canvas.width = scope.canvas.height = scope.options.size;

                    element[0].insertBefore(scope.canvas, element[0].firstChild);

                    scope.ctx = scope.canvas.getContext('2d');

                    // Pour centrer le text sur la coordonnée donnée
                    scope.ctx.textBaseline = 'middle';
                    scope.ctx.textAlign = "center";
                    scope.ctx.font = "40px Helvetica Neue";


                    scope.ctx.translate(scope.options.size / 2, scope.options.size / 2); // change center
                    scope.ctx.rotate((-1 / 2 + scope.options.rotate / 180) * Math.PI); // rotate -90 deg


                    scope.radius = (scope.options.size - scope.options.lineWidth) / 2 - scope.options.padding;

                    if(scope.options.displayRgbPicker){
                        scope.imageReady = false;
                        scope.image = new Image();
                        scope.image.onload = function () {
                            scope.imageReady = true;
                            scope.$apply(function(){
                                scope.refresh();
                            })
                        }
                        scope.image.src = "img/color_wheel.png";
                    }

                    scope.$canvas = element.find('canvas');
                    if(scope.options.disable === false){
                        $ionicGesture.on('touch', scope.onCanvas, scope.$canvas);
                        $ionicGesture.on('drag',  function(event){scope.onCanvas(event,true);}, scope.$canvas);
                        $ionicGesture.on('touch', function(event){
                            $ionicSlideBoxDelegate.enableSlide( false );
                        }, scope.$canvas);
                        $ionicGesture.on('release', function(event){
                            // Re activate Slide Box sliding
                            $ionicSlideBoxDelegate.enableSlide( true );

                            // Reset press mode
                            scope.mode=null;

                            // Reset button press action
                            scope.buttonPressed = false;

                            // Notify Release callback if needed
                            if(scope.options.onReleaseCallback){
                                scope.options.onReleaseCallback();
                            }
                        }, scope.$canvas);
                    }

                    if(scope.config.nbPositions && (scope.config.nbPositions >=2)){

                        scope.config.positions = [];

                        scope.config.positions.radius = scope.options.lineWidth/2;

                        scope.config.positions.step = (PI2 - scope.options.gap*2) / (scope.config.nbPositions-1);
                        scope.config.positions.stepPercent = scope.config.value.range / (scope.config.nbPositions-1);

                        var i=0;
                        for (var item in scope.options.positions) {
                            if (scope.options.positions.hasOwnProperty(item)) {
                                if(i === 0){
                                    var angle =  scope.options.gap;
                                    scope.config.positions.push({
                                        item:item,
                                        content:scope.options.positions[item],
                                        value: angle,
                                        percent: scope.config.value.min,
                                        x: scope.radius*Math.cos(angle),
                                        y: scope.radius*Math.sin(angle)
                                    });

                                }
                                else if(i === (scope.config.nbPositions-1)) {
                                    var angle =  PI2 - scope.options.gap;
                                    scope.config.positions.push({
                                        item:item,
                                        content:scope.options.positions[item],
                                        value: angle,
                                        percent:scope.config.value.max,
                                        x: scope.radius*Math.cos(angle),
                                        y: scope.radius*Math.sin(angle)
                                    });
                                }
                                else{
                                    var angle = scope.options.gap + i*scope.config.positions.step;
                                    scope.config.positions.push({
                                        item:item,
                                        content:scope.options.positions[item],
                                        value: angle,
                                        percent: scope.config.value.min + i*scope.config.positions.stepPercent,
                                        x: scope.radius*Math.cos(angle),
                                        y: scope.radius*Math.sin(angle)
                                    });
                                }
                                i++;
                            }
                        }

                    }
                    scope.refresh();
                }, true);

                /**
                 * Draw the progress or backgrounds arcs
                 * @param color
                 * @param lineWidth     in px
                 * @param value         Between 0 and 1
                 * @param radius        in px
                 */
                scope.drawCircle = function(color, lineWidth, value, radius) {

                    radius = radius || scope.radius;
                    value = Math.min(Math.max(0, value), 1);
                    scope.ctx.beginPath();
                    scope.ctx.arc(0, 0, radius, scope.options.gap, scope.options.gap + (Math.PI - scope.options.gap) * 2 * value, false);
                    scope.ctx.strokeStyle = color;
                    scope.ctx.lineCap = 'round'; // butt, round or square
                    scope.ctx.lineWidth = lineWidth;
                    scope.ctx.stroke();
                };

                scope.drawFilledGradientCircle = function(colorInner, colorExt, radiusInner, radiusExt) {

                    scope.ctx.beginPath();
                    scope.ctx.arc(0, 0, radiusExt, 0, PI2, false);
                    // create radial gradient
                    var grd = scope.ctx.createRadialGradient(0, 0, radiusInner, 0, 0, radiusExt);
                    grd.addColorStop(0, colorInner);
                    grd.addColorStop(1, colorExt);

                    scope.ctx.fillStyle = grd;
                    scope.ctx.fill();
                };

                // For vertical drawing
                scope.drawArc = function(color, lineWidth, percent) {
                    percent = Math.min(Math.max(0, percent), 1);
                    scope.ctx.beginPath();
                    scope.ctx.arc(0, 0, scope.radius, - Math.PI * percent, Math.PI * percent, false);
                    scope.ctx.strokeStyle = color;
                    scope.ctx.lineCap = 'round'; // butt, round or square
                    scope.ctx.lineWidth = lineWidth;
                    scope.ctx.stroke();
                };

                scope.drawPositions = function() {
                    // Need at least min and max
                    if(!scope.config.positions || scope.displayDefaultPosition){
                        return;
                    }

                    for(var i = 0; i< scope.config.positions.length; i++){
                        var color = (scope.ngModel<(scope.config.positions[i].percent-scope.config.positions.stepPercent/2))?scope.options.backgroundColor:scope.options.positionsColor;
                        scope.ctx.beginPath();
                        scope.ctx.arc(scope.config.positions[i].x, scope.config.positions[i].y, scope.config.positions.radius, 0, PI2);
                        scope.ctx.strokeStyle = color;
                        //scope.ctx.lineWidth = 1
                        scope.ctx.stroke();

                    }
                };

                scope.refresh = function(){

                    if(!scope.options){
                        return;
                    }

                    if(scope.ngModel>scope.config.value.max)
                        scope.ngModel = scope.config.value.max;
                    if(scope.ngModel!==0 && scope.ngModel<scope.config.value.min) // If 0 then Off so we keep it like this
                        scope.ngModel = scope.config.value.min;

                    // Store the current transformation matrix
                    scope.ctx.save();

                    // Use the identity matrix while clearing the canvas
                    scope.ctx.setTransform(1, 0, 0, 1, 0, 0);
                    scope.ctx.clearRect(0, 0, scope.canvas.width, scope.canvas.height);

                    // Restore the transform
                    scope.ctx.restore();

                    var value = Math.round(scope.ngModel);
                    if(scope.config.positions){
                        var res = calcPosition(scope.ngModel);
                        value = res.percent;
                    }
                    if(scope.targetPercent === undefined) scope.targetPercent = value
                    // Draw complete background circle (minus arc)
                    scope.drawCircle(scope.options.backgroundColor, scope.options.lineWidth, 1);

                    if(scope.buttonPressed){
                        scope.drawFilledGradientCircle('white', '#EFEFEF', scope.config.buttonRadius, scope.radius*0.9);
                    }

                    if(scope.ngGetText){
                        scope.ctx.save();
                        scope.ctx.rotate(-(-1 / 2 + scope.options.rotate / 180) * Math.PI); // rotate -90 deg
                        var text = scope.ngGetText();
                        scope.ctx.fillStyle = "#B2B2B2";
                        scope.ctx.fillText(text ,0,0);
                        scope.ctx.restore();
                    }
                    if(scope.options.vertical){
                        scope.drawArc(scope.ngColor, scope.options.lineWidth, scope.config.value.valueToRatio(value));
                        if(scope.options.displayTarget && scope.targetPercent!==value ) {
                            scope.drawArc(scope.options.targetColor, scope.options.lineWidth, scope.config.value.valueToRatio(scope.targetPercent));
                        }
                    } else {
                        var color = scope.ngColor;
                        if(scope.options.displayDefaultPosition){
                            color = scope.options.targetColor;
                        }
                        if(scope.options.displayRgbPicker && scope.rgbColor){
                            scope.rgbColor.r = Math.round(scope.rgbColor.r);
                            scope.rgbColor.g = Math.round(scope.rgbColor.g);
                            scope.rgbColor.b = Math.round(scope.rgbColor.b);
                            color = 'rgb('+scope.rgbColor.r+','+scope.rgbColor.g+','+scope.rgbColor.b+')';
                        }
                        scope.drawCircle(color, scope.options.lineWidth, scope.config.value.valueToRatio(value));
                        if(scope.options.displayTarget && scope.targetPercent!==value){
                            scope.drawCircle(scope.options.targetColor, scope.options.lineWidth, scope.config.value.valueToRatio(scope.targetPercent));
                        }
                        scope.drawPositions();
                    }
                    if(scope.options.displayRgbPicker && scope.imageReady){
                        var size = scope.canvas.width - 148;
                        var orig = -scope.canvas.width/2 + (scope.canvas.width - size) / 2
                        scope.ctx.drawImage(scope.image, orig, orig, size, size); // draw the image on the canvas
                        scope.drawCircle(scope.options.backgroundColor, 2, 1, scope.radius-scope.options.lineWidth*1.2)
                    }
                    // Image for album art
                    if(scope.options.hasOwnProperty('image') && scope.options.image !== undefined){
                      var size = scope.canvas.width - 90;
                      var orig = -scope.canvas.width/2 + (scope.canvas.width - size) / 2;
                       var img = new Image();
                        img.onload = function(){
                          scope.ctx.drawImage(img, orig, orig , size, size);
                       };
                       img.src = scope.options.image;

                    }
                    //console.log(scope.ngModel);
                };

                var getTouchAngle = function(event, isDraging, dx, dy){
                    var distance = Math.sqrt(dx*dx + dy*dy);

                    var extRadius = (scope.options.size - scope.options.lineWidth)/2 + scope.options.lineWidth*2 - scope.options.padding;


                    var innerRadius;
                    if(scope.options.displayRgbPicker){
                        innerRadius = (scope.options.size - scope.options.lineWidth)/2  - scope.options.lineWidth - scope.options.padding;
                    }
                    else if(scope.options.button) {
                        innerRadius = scope.config.buttonRadius;
                    }
                    else{
                        // S'il n'y a rien au millieu, nous avons plus de place pour sélectionner le cercle
                        innerRadius = 30;//(scope.options.size - scope.options.lineWidth)/2  - scope.options.lineWidth*2 - scope.options.padding;
                    }

                    if(scope.options.displayRgbPicker || !scope.options.hasExtraButtons){
                        extRadius = scope.options.size;
                    }

                    if(isDraging!==true && (distance > extRadius || distance < innerRadius)){
                        return;
                    }

                    event.stopPropagation();
                    event.preventDefault();

                    var endAngle = (Math.atan2(dx, -dy) + PI2 - scope.rotateRad)/* % PI2*/;
                    // Set angle in precentage

                    // scope.ctx.arc(0, 0, radius, scope.options.gap, scope.options.gap + (Math.PI - scope.options.gap) * 2 * percent, false);
                    var endPercent = 0;

                    if(endAngle < scope.options.gap){
                        endPercent = 0;
                    }
                    else if(endAngle > (PI2 - scope.options.gap)){
                        endPercent = scope.config.value.max;
                    }
                    else{
                        //endPercent = parseInt((endAngle - scope.options.gap) / (PI2-scope.options.gap*2) * 100);
                        endPercent = scope.config.value.discreet(
                            scope.config.value.rationToValue(
                                (endAngle - scope.options.gap) / (PI2-scope.options.gap*2)));
                    }

                    if(endPercent>scope.config.value.max) endPercent = scope.config.value.max;
                    if(endPercent<scope.config.value.min)   endPercent = scope.config.value.min;

                    // Si le cercle est complet, cela permet de ne pas faire un tour complet et aide à atteindre les min et max
                    if(isDraging && !scope.options.gap){
                        if(endPercent > (scope.config.value.step*0.75) && scope.ngModel < (scope.config.value.step*0.25)){
                            endPercent = scope.config.value.min;
                        }else if(endPercent < (scope.config.value.step*0.25) && scope.ngModel > (scope.config.value.step*0.75)){
                            endPercent = scope.config.value.max;
                        }
                    }

                    return endPercent;
                };

                var getTouchVertical = function(event, isDraging, dy){

                    var extRadius = (scope.options.size - scope.options.lineWidth)/2 + scope.options.lineWidth/2 - scope.options.padding;
                    if(isDraging!==true && (dy > extRadius)){
                        return;
                    }

                    event.stopPropagation();
                    event.preventDefault();

                    // Set position in precentage
                    var endPercent = parseInt(((-dy / (extRadius) * 100 )+100)/2);

                    if(endPercent>100) endPercent = 100;
                    if(endPercent<0)   endPercent = 0;

                    return endPercent;
                };

                var getRgbTouch = function(event, isDraging, dx, dy, x, y){
                    if(!scope.options.displayRgbPicker || !scope.imageReady){
                        return;
                    }

                    var distance = Math.sqrt(dx*dx + dy*dy);
                    var innerRadius = (scope.options.size - scope.options.lineWidth)/2  - scope.options.lineWidth - scope.options.padding;

                    if(distance > innerRadius){
                        return;
                    }

                    var imageData = scope.ctx.getImageData(x, y, 1, 1);

                  var pixel =  scope.ctx.getImageData(x, y, 1, 1).data;
                  return {'r' : pixel[0],'g' : pixel[1],'b' : pixel[2] }
                };

                var getPressedButton = function(event, isDraging, dx, dy, x, y){

                    if(isDraging){
                        return false;
                    }

                    var distance = Math.sqrt(dx*dx + dy*dy);
                    var innerRadius = scope.config.buttonRadius;

                    if(distance < innerRadius){
                        return true;
                    }
                    return false;
                }
                scope.onCanvas = function(event, isDraging){

                    // Get angle from position
                    var canvasOffset = $ionicPosition.offset(scope.$canvas);
                    var touch = event.gesture.touches[0];
                    // taking offset into consideration
                    var x = touch.pageX - canvasOffset.left;
                    var y = touch.pageY - canvasOffset.top;
                    var dx = x - scope.canvas.width/2;
                    var dy = y - scope.canvas.height/2;
                  
                    var newTargetPercent;

                    if(!isDraging || scope.mode!=="rgb"){
                        if(scope.options.vertical){
                            newTargetPercent = getTouchVertical(event, isDraging, dy);
                        } else {
                            newTargetPercent = getTouchAngle(event, isDraging, dx, dy);
                        }
                    }

                    if(newTargetPercent===undefined){
                        // Recup�ration de la couleur si le mode est activ�
                        if(scope.options.displayRgbPicker || scope.imageReady){
                            scope.rgbColor = getRgbTouch(event, isDraging, dx, dy, x, y);
                            if(!isDraging) scope.mode="rgb";
                        }else if(scope.options.button){
                          //console.log(getPressedButton(event, isDraging, dx, dy, x, y))
                            scope.buttonPressed = getPressedButton(event, isDraging, dx, dy, x, y);
                        }else{
                            return;
                        }
                    }else{
                        scope.buttonPressed = false;
                        if(scope.options.displayTarget){
                            scope.targetPercent = newTargetPercent;
                        }else{
                            scope.ngModel = newTargetPercent;
                        }
                        scope.mode="circle";
                    }
                    notifyAndRefresh();
                };

                var notifyAndRefresh = function(){
                    if(scope.options.onTouchCallback){
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
                    if(scope.options.button){
                        if(scope.buttonPressed){
                            if(scope.options.buttonCallback){
                                scope.options.buttonCallback();
                            }
                        }
                    }
                    //scope.$apply();
                    scope.$apply(function() {
                        scope.refresh();
                        //console.log(x + ' ' + y + ': ' + scope.ngModel);
                    });
                };
                var calcPosition = function(targetPercent){
                    var result = {};
                    var goodPos = false;
                    var prev = scope.config.positions[0];
                    var next = scope.config.positions[scope.config.positions.length-1];
                    for(var i = 0; i < scope.config.positions.length; i++){
                        if(targetPercent === scope.config.positions[i].percent){
                            result.positionItem = scope.config.positions[i].item;
                            result.positionContent = scope.config.positions[i].content;
                            goodPos = true;
                            break;
                        }

                        if(scope.config.positions[i].percent > prev.percent && scope.config.positions[i].percent < targetPercent){
                            prev = scope.config.positions[i];
                        }
                        if(scope.config.positions[i].percent < next.percent && scope.config.positions[i].percent > targetPercent){
                            next = scope.config.positions[i];
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

                scope.$watch('ngModel', function(){
                    if(scope.ngModel!==undefined){
                        scope.refresh();
                    }
                });
              
                scope.$watch('ngColor', function(){
                    if(scope.ngColor){
                        scope.refresh();
                    }
                });

                scope.$watch('rgbColor', function(){
                    if(scope.rgbColor){
                        scope.refresh();
                    }
                });

                scope.$watch('position', function(){
                    if(scope.position === undefined || scope.config.positions===undefined)
                        return;

                    // TODO: Cas du custom à re gérer
                    if(scope.position === -1){
                        scope.displayDefaultPosition = true;
                        if(scope.ngModel===100){
                            scope.refresh();
                        }
                        else{
                            scope.ngModel = 100;
                        }
                    }
                    else{
                        scope.displayDefaultPosition = false;
                        // Finf pos
                        var pos = undefined;
                        for(var i=0; i<scope.config.positions.length; i++){
                            if(parseInt(scope.config.positions[i].item) === scope.position){
                                pos = scope.config.positions[i];
                                break;
                            }
                        }
                        if(pos && pos.percent != scope.ngModel){
                            scope.ngModel = pos.percent;
                        }
                    }
                });

            },
            controller: function ($scope, $rootScope, $element, $location) {

            }
        }
    });
