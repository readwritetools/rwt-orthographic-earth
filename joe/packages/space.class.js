/* Copyright (c) 2021 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BasePackage from './base-package.class.js';

import GeneralFeature from '../features/general-feature.class.js';

const degreesToRadians = Math.PI / 180;

export default class Space extends BasePackage {
    constructor(e, a, s, r) {
        super(e, a, s, r);
        var t = new Object;
        t['deep-space'] = 'visible', t['deep-space-color'] = '#FFFFFF', t['deep-space-star-count'] = 1e3, 
        t['deep-space-star-color'] = '#FFFFFF', t['earth-glow'] = 'hidden', t['earth-glow-size'] = 0, 
        t['earth-glow-offset'] = null, t['earth-glow-axis'] = 0, t['earth-glow-inner-color'] = '#FFFFFF', 
        t['earth-glow-outer-color'] = '#FFFFFF', t.sunrise = 'hidden', t['sunrise-inner-radius'] = 0, 
        t['sunrise-outer-radius'] = null, t['sunrise-inner-color'] = '#FFFFFF', t['sunrise-outer-color'] = '#FFFFFF', 
        this.properties = new GeneralFeature(t), this.stars = new Array, this.packageNeedsRestyling = !0, 
        this.packagePointsNeedGeoCoords = !0, this.packagePointsNeedProjection = !0, this.packagePointsNeedTransformation = !0, 
        this.packagePointsNeedPlacement = !0, this.rwtOrthographicEarth.broadcastMessage('package/space', null);
    }
    recomputeStyles(e) {
        this.properties.computeStyle(e, this.classname, this.identifier, 0);
        var a = this.properties.canvasParams['deep-space'], s = this.properties.canvasParams['deep-space-star-count'];
        if ('visible' == a && s != this.stars.length) {
            this.stars = new Array;
            for (var r = 0; r < s; r++) {
                var t = new Object;
                t.x = Math.random(), t.y = Math.random(), t.radius = .5, r > .9 * s && (t.radius = 1), 
                r > .97 * s && (t.radius = 1.5), r > .99 * s && (t.radius = 2), this.stars.push(t);
            }
        }
        this.packageNeedsRestyling = !1;
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
    render(e) {
        if ('hidden' != this.properties.canvasParams.visibility) {
            var a = e.getVisualizedRadius(), s = parseInt(this.properties.canvasParams['earth-glow-size']);
            s < 0 && (s = 0), s > a && (s = a);
            var r = this.properties.canvasParams['earth-glow-offset'];
            null == r && (r = s), (r = parseInt(r)) < 0 && (r = 0), r > s && (r = s);
            var t = parseFloat(this.properties.canvasParams['earth-glow-axis']);
            'visible' == this.properties.canvasParams['deep-space'] && this.renderDeepSpace(e), 
            'visible' == this.properties.canvasParams['earth-glow'] && this.renderEarthGlow(e, s, r, t), 
            'visible' == this.properties.canvasParams.sunrise && this.renderSunrise(e, s, r, t);
        }
    }
    renderDeepSpace(e) {
        var a = e.canvas.getContext('2d');
        a.fillStyle = this.properties.canvasParams['deep-space-color'], a.fillRect(0, 0, e.canvas.width, e.canvas.height), 
        a.fillStyle = this.properties.canvasParams['deep-space-star-color'];
        for (var s = this.properties.canvasParams['deep-space-star-count'], r = 0; r < s; r++) {
            var t = e.canvas.width * this.stars[r].x, i = e.canvas.height * this.stars[r].y, o = this.stars[r].radius;
            a.beginPath(), a.arc(t, i, o, 0, 2 * Math.PI, !1), a.closePath(), a.fill();
        }
    }
    renderEarthGlow(e, a, s, r) {
        var t = e.canvas.getContext('2d'), i = e.carte.translate.a * e.carte.multiplier, o = e.carte.translate.b * e.carte.multiplier, n = e.viewport.centerPoint.x + i, c = e.viewport.centerPoint.y + o, p = e.getVisualizedRadius(), l = degreesToRadians * r, h = n + Math.cos(l) * s, d = c - Math.sin(l) * s, u = p + a, P = p - a, g = t.createRadialGradient(h, d, P, h, d, u);
        g.addColorStop(0, this.properties.canvasParams['earth-glow-inner-color']), g.addColorStop(1, this.properties.canvasParams['earth-glow-outer-color']), 
        t.fillStyle = g, t.beginPath(), t.arc(h, d, u, 0, 2 * Math.PI, !1), t.closePath(), 
        t.fill();
    }
    renderSunrise(e, a, s, r) {
        var t = e.canvas.getContext('2d'), i = e.carte.translate.a * e.carte.multiplier, o = e.carte.translate.b * e.carte.multiplier, n = e.viewport.centerPoint.x + i, c = e.viewport.centerPoint.y + o, p = e.getVisualizedRadius(), l = degreesToRadians * (r + 180), h = n + Math.cos(l) * p, d = c - Math.sin(l) * p, u = parseInt(this.properties.canvasParams['sunrise-inner-radius']);
        u < 0 && (u = 0), u > p / 4 && (u = p / 4);
        var P = this.properties.canvasParams['sunrise-outer-radius'];
        null == P && (P = p / 2), (P = parseInt(P)) < 0 && (P = 0), P > 4 * p && (P = 4 * p), 
        P < u && (P = u + 1);
        var g = t.createRadialGradient(h, d, u, h, d, P);
        g.addColorStop(0, this.properties.canvasParams['sunrise-inner-color']), g.addColorStop(1, this.properties.canvasParams['sunrise-outer-color']), 
        t.fillStyle = g, t.beginPath(), t.arc(h, d, P, 0, 2 * Math.PI, !1), t.closePath(), 
        t.fill();
    }
}