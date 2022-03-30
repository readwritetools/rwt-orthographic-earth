/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BasePackage from './base-package.class.js';

import GeneralFeature from '../features/general-feature.class.js';

import expect from '../dev/expect.js';

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
    recomputeStyles(e, a, r, t) {
        expect(e, 'RenderClock'), expect(a, 'vssStyleSheet'), expect(r, 'Layer'), expect(t, 'Number'), 
        super.recomputeStyles(e, a, r, (() => {
            this.properties.computeFeatureStyle(e, a, r.vssClassname, r.vssIdentifier, 0, t);
            var s = this.properties.canvasParams['deep-space'], i = this.properties.canvasParams['deep-space-star-count'];
            'visible' == s && i != this.stars.length && this.createStarField(i);
        }));
    }
    runCourtesyValidator(e, a, r) {
        expect(e, 'vssStyleSheet'), expect(a, 'Layer'), expect(r, 'Number'), super.runCourtesyValidator((() => {
            this.properties.runCourtesyValidator(e, a.vssClassname, a.vssIdentifier, 0, r);
        }));
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
            var r = new Object;
            r.x = Math.random(), r.y = Math.random(), r.radius = .5, a > .9 * e && (r.radius = 1), 
            a > .97 * e && (r.radius = 1.5), a > .99 * e && (r.radius = 2), this.stars.push(r);
        }
    }
    rotation(e, a) {
        expect(e, 'RenderClock'), expect(a, 'GeocentricCoordinates'), super.rotation(e, a, (() => {}));
    }
    projection(e, a) {
        expect(e, 'RenderClock'), expect(a, 'OrthographicProjection'), super.projection(e, a, (() => {}));
    }
    transformation(e, a) {
        expect(e, 'RenderClock'), expect(a, 'CartesianTransformation'), super.transformation(e, a, (() => {}));
    }
    placement(e, a) {
        expect(e, 'RenderClock'), expect(a, 'Viewport'), super.placement(e, a, (() => {}));
    }
    drawLayer(e, a, r) {
        expect(e, 'RenderClock'), expect(a, 'Earth'), expect(r, 'Number'), super.drawLayer(e, (() => {
            let e = this.properties.canvasParams.get(r);
            'hidden' != e.visibility && this.drawSpace(a, e);
        }));
    }
    drawSpace(e, a) {
        expect(e, 'Earth'), expect(a, 'vssCanvasParameters');
        var r = e.getVisualizedRadius(), t = parseInt(a['earth-glow-size']);
        t < 0 && (t = 0), t > r && (t = r);
        var s = a['earth-glow-offset'];
        null == s && (s = t), (s = parseInt(s)) < 0 && (s = 0), s > t && (s = t);
        var i = parseFloat(a['earth-glow-axis']);
        'visible' == a['deep-space'] && this.renderDeepSpace(e, a), 'visible' == a['earth-glow'] && this.renderEarthGlow(e, a, t, s, i), 
        'visible' == a.sunrise && this.renderSunrise(e, a, t, s, i);
    }
    renderDeepSpace(e, a) {
        expect(e, 'Earth'), expect(a, 'vssCanvasParameters');
        var r = e.canvas.getContext('2d');
        r.fillStyle = a['deep-space-color'], r.fillRect(0, 0, e.canvas.width, e.canvas.height), 
        r.fillStyle = a['deep-space-star-color'];
        for (var t = a['deep-space-star-count'], s = 0; s < t; s++) {
            var i = e.canvas.width * this.stars[s].x, o = e.canvas.height * this.stars[s].y, c = this.stars[s].radius;
            r.beginPath(), r.arc(i, o, c, 0, 2 * Math.PI, !1), r.closePath(), r.fill();
        }
    }
    renderEarthGlow(e, a, r, t, s) {
        expect(e, 'Earth'), expect(a, 'vssCanvasParameters');
        var i = e.canvas.getContext('2d'), o = e.carte.translate.a * e.carte.multiplier, c = e.carte.translate.b * e.carte.multiplier, n = e.viewport.centerPoint.x + o, l = e.viewport.centerPoint.y + c, p = e.getVisualizedRadius(), d = degreesToRadians * s, u = n + Math.cos(d) * t, h = l - Math.sin(d) * t, v = p + r, g = p - r, x = i.createRadialGradient(u, h, g, u, h, v);
        x.addColorStop(0, a['earth-glow-inner-color']), x.addColorStop(1, a['earth-glow-outer-color']), 
        i.fillStyle = x, i.beginPath(), i.arc(u, h, v, 0, 2 * Math.PI, !1), i.closePath(), 
        i.fill();
    }
    renderSunrise(e, a, r, t, s) {
        expect(e, 'Earth'), expect(a, 'vssCanvasParameters');
        var i = e.canvas.getContext('2d'), o = e.carte.translate.a * e.carte.multiplier, c = e.carte.translate.b * e.carte.multiplier, n = e.viewport.centerPoint.x + o, l = e.viewport.centerPoint.y + c, p = e.getVisualizedRadius(), d = degreesToRadians * (s + 180), u = n + Math.cos(d) * p, h = l - Math.sin(d) * p, v = parseInt(a['sunrise-inner-radius']);
        v < 0 && (v = 0), v > p / 4 && (v = p / 4);
        var g = a['sunrise-outer-radius'];
        null == g && (g = p / 2), (g = parseInt(g)) < 0 && (g = 0), g > 4 * p && (g = 4 * p), 
        g < v && (g = v + 1);
        var x = i.createRadialGradient(u, h, v, u, h, g);
        x.addColorStop(0, a['sunrise-inner-color']), x.addColorStop(1, a['sunrise-outer-color']), 
        i.fillStyle = x, i.beginPath(), i.arc(u, h, g, 0, 2 * Math.PI, !1), i.closePath(), 
        i.fill();
    }
}