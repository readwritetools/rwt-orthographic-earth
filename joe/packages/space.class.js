/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BasePackage from './base-package.class.js';

import GeneralFeature from '../features/general-feature.class.js';

import expect from '../joezone/expect.js';

const degreesToRadians = Math.PI / 180;

export default class Space extends BasePackage {
    constructor(e) {
        super(e), this.createStarField(500);
        var a = new Object;
        a['deep-space'] = 'visible', a['deep-space-color'] = '#093640', a['deep-space-star-count'] = 500, 
        a['deep-space-star-color'] = '#E0E070', a['earth-glow'] = 'hidden', a['earth-glow-size'] = 0, 
        a['earth-glow-offset'] = null, a['earth-glow-axis'] = 0, a['earth-glow-inner-color'] = '#107187', 
        a['earth-glow-outer-color'] = '#093640', a.sunrise = 'hidden', a['sunrise-inner-radius'] = 0, 
        a['sunrise-outer-radius'] = null, a['sunrise-inner-color'] = '#107187', a['sunrise-outer-color'] = '#093640', 
        this.properties = new GeneralFeature(a, 'space'), this.packagePointsNeedGeoCoords = !0, 
        this.packagePointsNeedProjection = !0, this.packagePointsNeedTransformation = !0, 
        this.packagePointsNeedPlacement = !0, this.rwtOrthographicEarth.broadcastMessage('package/space', null), 
        Object.seal(this);
    }
    recomputeStyles(e, a, t) {
        expect(e, 'vssStyleSheet'), expect(a, 'Layer'), expect(t, 'Number'), this.properties.computeFeatureStyle(e, a.vssClassname, a.vssIdentifier, 0, t);
        var s = this.properties.canvasParams['deep-space'], r = this.properties.canvasParams['deep-space-star-count'];
        'visible' == s && r != this.stars.length && this.createStarField(r), a.layerNeedsRestyling = !1;
    }
    runCourtesyValidator(e, a, t) {
        expect(e, 'vssStyleSheet'), expect(a, 'Layer'), expect(t, 'Number'), this.properties.runCourtesyValidator(e, a.vssClassname, a.vssIdentifier, 0, t);
    }
    static courtesyValidator(e) {
        switch (e) {
          case 'visibility':
          case 'deep-space':
          case 'deep-space-color':
          case 'deep-space-star-count':
          case 'deep-space-star-color':
          case 'earth-glow':
          case 'earth-glow-size':
          case 'earth-glow-offset':
          case 'earth-glow-axis':
          case 'earth-glow-inner-color':
          case 'earth-glow-outer-color':
          case 'sunrise':
          case 'sunrise-inner-radius':
          case 'sunrise-outer-radius':
          case 'sunrise-inner-color':
          case 'sunrise-outer-color':
            return !0;

          default:
            return !1;
        }
    }
    createStarField(e) {
        this.stars = [];
        for (var a = 0; a < e; a++) {
            var t = new Object;
            t.x = Math.random(), t.y = Math.random(), t.radius = .5, a > .9 * e && (t.radius = 1), 
            a > .97 * e && (t.radius = 1.5), a > .99 * e && (t.radius = 2), this.stars.push(t);
        }
    }
    rotation(e) {
        this.packagePointsNeedGeoCoords = !1, this.packagePointsNeedProjection = !0;
    }
    projection(e) {
        this.packagePointsNeedProjection = !1, this.packagePointsNeedTransformation = !0;
    }
    transformation(e) {
        this.packagePointsNeedTransformation = !1, this.packagePointsNeedPlacement = !0;
    }
    placement(e) {
        this.packagePointsNeedPlacement = !1;
    }
    renderLayer(e, a) {
        expect(e, 'Earth'), expect(a, 'Number');
        let t = this.properties.canvasParams.get(a);
        if (expect(t, 'vssCanvasParameters'), 'hidden' != t.visibility) {
            var s = e.getVisualizedRadius(), r = parseInt(t['earth-glow-size']);
            r < 0 && (r = 0), r > s && (r = s);
            var i = t['earth-glow-offset'];
            null == i && (i = r), (i = parseInt(i)) < 0 && (i = 0), i > r && (i = r);
            var o = parseFloat(t['earth-glow-axis']);
            'visible' == t['deep-space'] && this.renderDeepSpace(e, t), 'visible' == t['earth-glow'] && this.renderEarthGlow(e, t, r, i, o), 
            'visible' == t.sunrise && this.renderSunrise(e, t, r, i, o);
        }
    }
    renderDeepSpace(e, a) {
        expect(e, 'Earth'), expect(a, 'vssCanvasParameters');
        var t = e.canvas.getContext('2d');
        t.fillStyle = a['deep-space-color'], t.fillRect(0, 0, e.canvas.width, e.canvas.height), 
        t.fillStyle = a['deep-space-star-color'];
        for (var s = a['deep-space-star-count'], r = 0; r < s; r++) {
            var i = e.canvas.width * this.stars[r].x, o = e.canvas.height * this.stars[r].y, c = this.stars[r].radius;
            t.beginPath(), t.arc(i, o, c, 0, 2 * Math.PI, !1), t.closePath(), t.fill();
        }
    }
    renderEarthGlow(e, a, t, s, r) {
        expect(e, 'Earth'), expect(a, 'vssCanvasParameters');
        var i = e.canvas.getContext('2d'), o = e.carte.translate.a * e.carte.multiplier, c = e.carte.translate.b * e.carte.multiplier, n = e.viewport.centerPoint.x + o, l = e.viewport.centerPoint.y + c, p = e.getVisualizedRadius(), d = degreesToRadians * r, h = n + Math.cos(d) * s, u = l - Math.sin(d) * s, g = p + t, v = p - t, P = i.createRadialGradient(h, u, v, h, u, g);
        P.addColorStop(0, a['earth-glow-inner-color']), P.addColorStop(1, a['earth-glow-outer-color']), 
        i.fillStyle = P, i.beginPath(), i.arc(h, u, g, 0, 2 * Math.PI, !1), i.closePath(), 
        i.fill();
    }
    renderSunrise(e, a, t, s, r) {
        expect(e, 'Earth'), expect(a, 'vssCanvasParameters');
        var i = e.canvas.getContext('2d'), o = e.carte.translate.a * e.carte.multiplier, c = e.carte.translate.b * e.carte.multiplier, n = e.viewport.centerPoint.x + o, l = e.viewport.centerPoint.y + c, p = e.getVisualizedRadius(), d = degreesToRadians * (r + 180), h = n + Math.cos(d) * p, u = l - Math.sin(d) * p, g = parseInt(a['sunrise-inner-radius']);
        g < 0 && (g = 0), g > p / 4 && (g = p / 4);
        var v = a['sunrise-outer-radius'];
        null == v && (v = p / 2), (v = parseInt(v)) < 0 && (v = 0), v > 4 * p && (v = 4 * p), 
        v < g && (v = g + 1);
        var P = i.createRadialGradient(h, u, g, h, u, v);
        P.addColorStop(0, a['sunrise-inner-color']), P.addColorStop(1, a['sunrise-outer-color']), 
        i.fillStyle = P, i.beginPath(), i.arc(h, u, v, 0, 2 * Math.PI, !1), i.closePath(), 
        i.fill();
    }
}