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
        if (null != this.canvasParams && 'hidden' != this.canvasParams.visibility) {
            var e = t.canvas.getContext('2d');
            e.beginPath(), this.render_ring(t, e, !1);
            for (var i = 0; i < this.innerRings.length; i++) {
                this.innerRings[i].render_ring(t, e, !0);
            }
            e.closePath(), e.fillStyle = this.canvasParams.computeFillPlusTransparency(), e.strokeStyle = this.canvasParams['stroke-color'], 
            e.lineWidth = this.canvasParams['stroke-width'], 'none' != this.canvasParams['stroke-width'] && e.stroke(), 
            e.globalCompositeOperation = this.canvasParams['fill-type'], 'none' != this.canvasParams['fill-color'] && e.fill(), 
            e.globalCompositeOperation = 'source-over';
        }
    }
    render_ring(t, e, i) {
        for (var n = t.carte.translate.a * t.carte.multiplier, a = t.carte.translate.b * t.carte.multiplier, r = t.viewport.centerPoint.x + n, s = t.viewport.centerPoint.y + a, o = t.getVisualizedRadius(), l = !1, h = !1, g = !0, u = null, c = null, v = null, R = 0; R < this.outerRing.length; R++) {
            var f = this.outerRing[R], P = this.outerRing[R - 1];
            if (h = f.visible, 1 == g) 1 == h && (e.moveTo(f.canvasX, f.canvasY), R > 0 && (u = f.projectedTheta), 
            g = !1); else if (1 == h && 1 == l) e.lineTo(f.canvasX, f.canvasY); else if (0 == h && 1 == l) {
                c = P.projectedTheta;
                let t = r + o * Math.cos(c), i = s + o * Math.sin(c);
                e.lineTo(t, i);
            } else if (1 == h && 0 == l) {
                if (c != (v = f.projectedTheta)) {
                    var d = c, m = v, p = Math.abs(m - d) > Math.PI;
                    'night' == this.featureName ? e.arc(r, s, o, d, m, !0) : p ? d > m ? e.arc(r, s, o, d, m, !1) : e.arc(r, s, o, d, m, !0) : d < m ? e.arc(r, s, o, d, m, !1) : e.arc(r, s, o, d, m, !0);
                    let t = r + o * Math.cos(v), i = s + o * Math.sin(v);
                    e.lineTo(t, i);
                }
                c = null, v = null;
            }
            l = f.visible;
        }
        if (null != c && null != u) {
            if (c != u) {
                d = c, m = u, p = Math.abs(m - d) > Math.PI;
                'night' == this.featureName ? e.arc(r, s, o, d, m, !0) : p ? d > m ? e.arc(r, s, o, d, m, !1) : e.arc(r, s, o, d, m, !0) : d < m ? e.arc(r, s, o, d, m, !1) : e.arc(r, s, o, d, m, !0);
                let t = r + o * Math.cos(u), i = s + o * Math.sin(u);
                e.lineTo(t, i);
            }
            c = null, u = null;
        }
    }
    isPointerInsidePolygon(t, e) {
        var i = this.outerRing.length, n = !1, a = 0;
        for (let t = 0; t < i && a < 3; t++) 1 == this.outerRing[t].visible && a++;
        if (a < 3) return !1;
        var r = null;
        for (let t = 0; t < i; t++) if (1 == this.outerRing[t].visible) {
            r = t;
            break;
        }
        var s = r;
        for (let a = s + 1; a < i; a++) {
            if (0 == this.outerRing[a].visible) continue;
            let i = s;
            var o = this.outerRing[a].canvasX, l = this.outerRing[a].canvasY, h = this.outerRing[i].canvasX;
            if (l > e != (g = this.outerRing[i].canvasY) > e) t < (h - o) * (e - l) / (g - l) + o && (n = !n);
            s = a;
        }
        var g;
        o = this.outerRing[r].canvasX, l = this.outerRing[r].canvasY, h = this.outerRing[s].canvasX;
        l > e != (g = this.outerRing[s].canvasY) > e && (t < (h - o) * (e - l) / (g - l) + o && (n = !n));
        return n;
    }
}