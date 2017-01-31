angular.module('mangoPanel')
  .factory('Color',[function(){
    // Colors to be synchronized with _variables.scss
    return {
      positive: '#9575cd',
      calm: '#4dd0e1',
      balanced: '#4db6ac',
      energized: '#ff8a65',
      assertive: '#e51c23',
      royal: '#03a9f4',
      dark: 'rgb(38, 50, 56)', //$color-blackbluegrey
      defaultGrey: '#B2B2B2',

      transparentEnergized: 'rgba(255,138,101,0.3)',

      /**
       *
       * @param cmyk 0-100
       * @returns {*} 0-255
       */
      convertCMYKToRGB: function (cmyk) {
        if (cmyk.k === 100) {
          return [0, 0, 0];
        }
        return {
          r: 255 * (1 - cmyk.c / 100) * (1 - cmyk.k / 100),
          g: 255 * (1 - cmyk.m / 100) * (1 - cmyk.k / 100),
          b: 255 * (1 - cmyk.y / 100) * (1 - cmyk.k / 100)
        }
      },
      /**
       *
       * @param rgb 0-255
       * @returns {{c: number, m: number, y: number, k: number}}  0-100
       */
      convertRGBToCMYK: function (rgb) {
        var k = (1 - Math.max(rgb.r / 255, rgb.g / 255, rgb.b / 255)),
          c = (1 - rgb.r / 255 - k ) / (1 - k),
          m = (1 - rgb.g / 255 - k ) / (1 - k),
          y = (1 - rgb.b / 255 - k ) / (1 - k);

        c = c * 100 || 0;
        m = m * 100 || 0;
        y = y * 100 || 0;
        k = k * 100;

        return {c: c, m: m, y: y, k: k};

      },

      /**
       * HSV to RGB color conversion
       *
       * H runs from 0 to 360 degrees
       * S and V run from 0 to 100
       *
       * Ported from the excellent java algorithm by Eugene Vishnevsky at:
       * http://www.cs.rit.edu/~ncs/color/t_convert.html
       */
      convertHSVtoRGB: function (h, s, v) {
        var r, g, b;
        var i;
        var f, p, q, t;

        // Make sure our arguments stay in-range
        h = Math.max(0, Math.min(360, h));
        s = Math.max(0, Math.min(100, s));
        v = Math.max(0, Math.min(100, v));

        // We accept saturation and value arguments from 0 to 100 because that's
        // how Photoshop represents those values. Internally, however, the
        // saturation and value are calculated from a range of 0 to 1. We make
        // That conversion here.
        s /= 100;
        v /= 100;

        if (s == 0) {
          // Achromatic (grey)
          r = g = b = v;
          return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        }

        h /= 60; // sector 0 to 5
        i = Math.floor(h);
        f = h - i; // factorial part of h
        p = v * (1 - s);
        q = v * (1 - s * f);
        t = v * (1 - s * (1 - f));

        switch (i) {
          case 0:
            r = v;
            g = t;
            b = p;
            break;

          case 1:
            r = q;
            g = v;
            b = p;
            break;

          case 2:
            r = p;
            g = v;
            b = t;
            break;

          case 3:
            r = p;
            g = q;
            b = v;
            break;

          case 4:
            r = t;
            g = p;
            b = v;
            break;

          default: // case 5:
            r = v;
            g = p;
            b = q;
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
      },
      /* accepts parameters
       * r  Object = {r:x, g:y, b:z}
       * OR
       * r, g, b
       */
      convertRGBtoHSV: function rgbToHsv(rgb) {
        var rr, gg, bb,
          r = rgb.r / 255,
          g = rgb.g / 255,
          b = rgb.b / 255,
          h, s,
          v = Math.max(r, g, b),
          diff = v - Math.min(r, g, b),
          diffc = function(c){
            return (v - c) / 6 / diff + 1 / 2;
          };

        if (diff == 0) {
          h = s = 0;
        } else {
          s = diff / v;
          rr = diffc(r);
          gg = diffc(g);
          bb = diffc(b);

          if (r === v) {
            h = bb - gg;
          }else if (g === v) {
            h = (1 / 3) + rr - bb;
          }else if (b === v) {
            h = (2 / 3) + gg - rr;
          }
          if (h < 0) {
            h += 1;
          }else if (h > 1) {
            h -= 1;
          }
        }
        return "hsv(" + Math.round(h * 360) + "," + Math.round(s * 100) + "," + Math.round(v * 100) + ")";
        //return [h, s, v];
      }
    }

  }]);
