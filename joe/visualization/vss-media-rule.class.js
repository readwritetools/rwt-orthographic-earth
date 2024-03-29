/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import vssSelectorCollection from './vss-selector-collection.class.js';

import PointFeature from '../features/point-feature.class.js';

import LineFeature from '../features/line-feature.class.js';

import PolygonFeature from '../features/polygon-feature.class.js';

import GeneralFeature from '../features/general-feature.class.js';

import Space from '../packages/space.class.js';

import Sphere from '../packages/sphere.class.js';

import expect from '../dev/expect.js';

import terminal from 'softlib/terminal.js';

export default class vssMediaRule {
    constructor(e, r) {
        this.minScale = e, this.maxScale = r, this.vssSelectorCollection = new vssSelectorCollection;
    }
    selectorExists(e) {
        return this.vssSelectorCollection.selectorExists(e);
    }
    createNewSelector(e) {
        return this.vssSelectorCollection.createNewSelector(e);
    }
    getSelector(e) {
        return this.vssSelectorCollection.getSelector(e);
    }
    computeMediaRuleStyle(e, r, a, t, s, i, o, l) {
        var n = r, c = '.' + a, u = '#' + t, d = `["${i}"]`;
        if (this.assignPropertyValues(e, n, l), '' != a && this.assignPropertyValues(e, c, l), 
        '' != t && this.assignPropertyValues(e, u, l), '' != i && this.assignPropertyValues(e, d, l), 
        '' != a && '' != i && this.assignPropertyValues(e, c + d, l), '' != t && '' != i && this.assignPropertyValues(e, u + d, l), 
        null != o) for (var p in o) {
            var h = o[p];
            if ('' != a) {
                var v = `${c}[${p}="${h}"]`;
                this.assignPropertyValues(e, v, l);
            }
            if ('' != t) {
                var g = `${u}[${p}="${h}"]`;
                this.assignPropertyValues(e, g, l);
            }
        }
        if (s) {
            var m = '["selected"]';
            this.assignPropertyValues(e, n + m, l), this.assignPropertyValues(e, c + m, l), 
            this.assignPropertyValues(e, u + m, l);
        }
    }
    runCourtesyValidator(e, r, a, t, s, i) {
        var o = e, l = '.' + r, n = '#' + a, c = `["${t}"]`;
        if (this.courtesyValidator(o, e, r, a, t), '' != r && this.courtesyValidator(l, e, r, a, t), 
        '' != a && this.courtesyValidator(n, e, r, a, t), '' != t && this.courtesyValidator(c, e, r, a, t), 
        '' != r && '' != t && this.courtesyValidator(l + c, e, r, a, t), '' != a && '' != t && this.courtesyValidator(n + c, e, r, a, t), 
        null != s) for (var u in s) {
            var d = s[u];
            if ('' != r) {
                var p = `${l}[${u}="${d}"]`;
                this.courtesyValidator(p, e, r, a, t);
            }
            if ('' != a) {
                var h = `${n}[${u}="${d}"]`;
                this.courtesyValidator(h, e, r, a, t);
            }
        }
    }
    assignPropertyValues(e, r, a) {
        var t = this.lookupStyle(r);
        if (null != t) for (let r in t.properties) {
            var s = t.properties[r], i = s.name, o = s.value;
            if (Array.isArray(o)) {
                var l = o[a % o.length];
                e[i] = l;
            } else e[i] = o;
        }
    }
    lookupStyle(e) {
        if ('' != e) return this.selectorExists(e) ? this.getSelector(e) : void 0;
    }
    courtesyValidator(e, r, a, t, s) {
        var i = this.lookupStyle(e);
        if (null != i) for (let a in i.properties) {
            var o = i.properties[a], l = o.name, n = o.value, c = !1;
            switch (r) {
              case 'point':
                c = PointFeature.courtesyValidator(l);
                break;

              case 'line':
                c = LineFeature.courtesyValidator(l);
                break;

              case 'polygon':
                c = PolygonFeature.courtesyValidator(l);
                break;

              case 'space':
                c = Space.courtesyValidator(l);
                break;

              case 'sphere':
                c = Sphere.courtesyValidator(l);
                break;

              default:
                c = !1;
            }
            if (!c) return void terminal.warning(`${e} { ${l} } unsupported ${r} property`);
            if (null == n) return void terminal.warning(`${e} { ${l} } unable to parse value.`);
            switch (l) {
              case 'visibility':
              case 'deep-space':
              case 'earth-glow':
              case 'sunrise':
                this.validateVisibility(e, l, n);
                break;

              case 'transparency':
                this.validateTransparency(e, l, n);
                break;

              case 'size':
              case 'inner-size':
              case 'scale':
              case 'earth-glow-size':
              case 'earth-glow-offset':
              case 'earth-glow-axis':
              case 'sunrise-inner-radius':
              case 'sunrise-outer-radius':
                this.validateNumber(e, l, n);
                break;

              case 'node-count':
              case 'deep-space-star-count':
                this.validateInteger(e, l, n);
                break;

              case 'stroke-width':
                this.validateWidth(e, l, n);
                break;

              case 'fill-color':
                if (Array.isArray(n)) for (let r = 0; r < n.length; r++) this.validateColor(e, l, n[r]); else this.validateColor(e, l, n);
                break;

              case 'stroke-color':
              case 'deep-space-color':
              case 'deep-space-star-color':
              case 'earth-glow-inner-color':
              case 'earth-glow-outer-color':
              case 'sunrise-inner-color':
              case 'sunrise-outer-color':
                this.validateColor(e, l, n);
                break;

              case 'symbol-type':
                this.validateSymbolType(e, l, n);
                break;

              case 'stroke-type':
                this.validateStrokeType(e, l, n);
                break;

              case 'fill-type':
                this.validateFillType(e, l, n);
                break;

              case 'code-point':
                this.validateCodePoint(e, l, n);
                break;

              default:
                terminal.warning(`${e} { ${l}:${n} } not expected in validator.`);
            }
        }
    }
    validateVisibility(e, r, a) {
        var t = [ 'hidden', 'visible' ];
        return !!t.includes(a) || (terminal.warning(`${e} { ${r}:${a} } expected to be one of [${t.join(', ')}].`), 
        !1);
    }
    validateTransparency(e, r, a) {
        var t = Number.parseFloat(a);
        return Number.isNaN(t) ? (terminal.warning(`${e} { ${r}:${a} } expected a number.`), 
        !1) : !(t < 0 || t > 1) || (terminal.warning(`${e} { ${r}:${a} } should be between 0.0 and 1.0`), 
        !1);
    }
    validateWidth(e, r, a) {
        return 'none' == a || (!Number.isNaN(Number.parseFloat(a)) || (terminal.warning(`${e} { ${r}:${a} } expected a number.`), 
        !1));
    }
    validateNumber(e, r, a) {
        return !Number.isNaN(Number.parseFloat(a)) || (terminal.warning(`${e} { ${r}:${a} } expected a number.`), 
        !1);
    }
    validateInteger(e, r, a) {
        return !Number.isNaN(Number.parseInt(a)) || (terminal.warning(`${e} { ${r}:${a} } expected an integer.`), 
        !1);
    }
    validateColor(e, r, a) {
        return 'String' == a.constructor.name && -1 != a.indexOf('#') || ('none' == a || (terminal.warning(`${e} { ${r}:${a} } expected a color value in the form #rrggbb or #rrggbbaa.`), 
        !1));
    }
    validateSymbolType(e, r, a) {
        var t = [ 'circle', 'polygon', 'triangle', 'rhombus', 'pentagon', 'hexagon', 'star', 'diamond', 'trigram', 'shuriken', 'pentagram', 'hexagram', 'crosshair', 'x-mark', 'unicode' ];
        return !!t.includes(a) || (terminal.warning(`${e} { ${r}:${a} } expected to be one of [${t.join(', ')}].`), 
        !1);
    }
    validateStrokeType(e, r, a) {
        var t = [ 'solid', 'dotted', 'short-dash', 'long-dash', 'dot-dash', 'dot-dot-dash', 'dot-dot-dot-dash', 'dot-dash-dot' ];
        return !!t.includes(a) || (terminal.warning(`${e} { ${r}:${a} } expected to be one of [${t.join(', ')}].`), 
        !1);
    }
    validateFillType(e, r, a) {
        var t = [ 'source-over', 'source-in', 'source-out', 'source-atop', 'destination-over', 'destination-in', 'destination-out', 'destination-atop', 'lighter', 'copy', 'xor', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity' ];
        return !!t.includes(a) || (terminal.warning(`${e} { ${r}:${a} } expected to be one of [${t.join(', ')}].`), 
        !1);
    }
    validateCodePoint(e, r, a) {
        return !0;
    }
}