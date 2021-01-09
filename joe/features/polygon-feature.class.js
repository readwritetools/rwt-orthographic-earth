/* Copyright (c) 2021 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BaseFeature from './base-feature.class.js';

export default class PolygonFeature extends BaseFeature {
    constructor() {
        super(), this.outerRing = [], this.innerRings = [];
    }
    get featureType() {
        return 'region';
    }
    addPoint(t) {
        this.outerRing.push(t);
    }
    computeStyle(t, e, i, n) {
        this.canvasParams = t.computeStyle('polygon', e, i, this.featureName, this.kvPairs, n);
    }
    toGeoCoords(t) {
        for (var e = 0; e < this.outerRing.length; e++) t.toGeoCoords(this.outerRing[e]);
        for (e = 0; e < this.innerRings.length; e++) this.innerRings[e].toGeoCoords(t);
    }
    toPlane(t) {
        for (var e = 0; e < this.outerRing.length; e++) t.toPlane(this.outerRing[e]);
        for (e = 0; e < this.innerRings.length; e++) this.innerRings[e].toPlane(t);
    }
    toPixels(t) {
        for (var e = 0; e < this.outerRing.length; e++) t.toPixels(this.outerRing[e], !0, !0, !0);
        for (e = 0; e < this.innerRings.length; e++) this.innerRings[e].toPixels(t);
    }
    toCanvas(t) {
        for (var e = 0; e < this.outerRing.length; e++) t.toCanvas(this.outerRing[e]);
        for (e = 0; e < this.innerRings.length; e++) this.innerRings[e].toCanvas(t);
    }
    render(t) {
        if (void 0 != this.canvasParams && 'hidden' != this.canvasParams.visibility) {
            var e = t.canvas.getContext('2d');
            e.fillStyle = this.canvasParams['fill-color'], e.strokeStyle = this.canvasParams['stroke-color'], 
            e.lineWidth = this.canvasParams['stroke-width'], e.beginPath(), this.render_ring(t, e, !1);
            for (var i = 0; i < this.innerRings.length; i++) {
                this.innerRings[i].render_ring(t, e, !0);
            }
            e.closePath(), e.stroke(), e.fill();
        }
    }
    render_ring(t, e, i) {
        for (var n = t.carte.translate.a * t.carte.multiplier, r = t.carte.translate.b * t.carte.multiplier, s = t.viewport.centerPoint.x + n, a = t.viewport.centerPoint.y + r, o = t.getVisualizedRadius(), l = !1, h = !1, g = !0, u = null, c = null, v = null, R = 0; R < this.outerRing.length; R++) {
            var f = this.outerRing[R], d = this.outerRing[R - 1];
            if (h = f.visible, 1 == g) 1 == h && (e.moveTo(f.canvasX, f.canvasY), R > 0 && (u = f.projectedTheta), 
            g = !1); else if (1 == h && 1 == l) e.lineTo(f.canvasX, f.canvasY); else if (0 == h && 1 == l) {
                c = d.projectedTheta;
                let t = s + o * Math.cos(c), i = a + o * Math.sin(c);
                e.lineTo(t, i);
            } else if (1 == h && 0 == l) {
                if (c != (v = f.projectedTheta)) {
                    var P = c, m = v, p = Math.abs(m - P) > Math.PI;
                    'night' == this.featureName ? e.arc(s, a, o, P, m, !0) : p ? P > m ? e.arc(s, a, o, P, m, !1) : e.arc(s, a, o, P, m, !0) : P < m ? e.arc(s, a, o, P, m, !1) : e.arc(s, a, o, P, m, !0);
                    let t = s + o * Math.cos(v), i = a + o * Math.sin(v);
                    e.lineTo(t, i);
                }
                c = null, v = null;
            }
            l = f.visible;
        }
        if (null != c && null != u) {
            if (c != u) {
                P = c, m = u, p = Math.abs(m - P) > Math.PI;
                'night' == this.featureName ? e.arc(s, a, o, P, m, !0) : p ? P > m ? e.arc(s, a, o, P, m, !1) : e.arc(s, a, o, P, m, !0) : P < m ? e.arc(s, a, o, P, m, !1) : e.arc(s, a, o, P, m, !0);
                let t = s + o * Math.cos(u), i = a + o * Math.sin(u);
                e.lineTo(t, i);
            }
            c = null, u = null;
        }
    }
    isPointerInsidePolygon(t, e) {
        var i = this.outerRing.length, n = 0, r = 0, s = !1;
        for (n = 0, r = i - 1; n < i; r = n++) {
            if (0 == this.outerRing[n].visible || 0 == this.outerRing[r].visible) return !1;
            var a = this.outerRing[n].canvasX, o = this.outerRing[n].canvasY, l = this.outerRing[r].canvasX, h = this.outerRing[r].canvasY;
            if (o > e != h > e) t < (l - a) * (e - o) / (h - o) + a && (s = !s);
        }
        return s;
    }
};