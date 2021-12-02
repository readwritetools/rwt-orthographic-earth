/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
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
        if (null != this.canvasParams && 'hidden' != this.canvasParams.visibility && ('none' != this.canvasParams['fill-color'] || 'none' != this.canvasParams['stroke-width'])) {
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
        for (var n = t.carte.translate.a * t.carte.multiplier, s = t.carte.translate.b * t.carte.multiplier, r = t.viewport.centerPoint.x + n, a = t.viewport.centerPoint.y + s, o = t.getVisualizedRadius(), l = !1, h = !1, g = !0, u = null, c = null, v = null, f = 0; f < this.outerRing.length; f++) {
            var R = this.outerRing[f], P = this.outerRing[f - 1];
            if (h = R.visible, 1 == g) 1 == h && (e.moveTo(R.canvasX, R.canvasY), f > 0 && (u = R.projectedTheta), 
            g = !1); else if (1 == h && 1 == l) e.lineTo(R.canvasX, R.canvasY); else if (0 == h && 1 == l) {
                c = P.projectedTheta;
                let t = r + o * Math.cos(c), i = a + o * Math.sin(c);
                e.lineTo(t, i);
            } else if (1 == h && 0 == l) {
                if (c != (v = R.projectedTheta)) {
                    var d = c, m = v;
                    'night' == this.featureName ? e.arc(r, a, o, d, m, !0) : this.drawArc(e, r, a, o, d, m, i);
                    let t = r + o * Math.cos(v), n = a + o * Math.sin(v);
                    e.lineTo(t, n);
                }
                c = null, v = null;
            }
            l = R.visible;
        }
        if (null != c && null != u) {
            if (c != u) {
                d = c, m = u;
                'night' == this.featureName ? e.arc(r, a, o, d, m, !0) : this.drawArc(e, r, a, o, d, m, i);
                let t = r + o * Math.cos(u), n = a + o * Math.sin(u);
                e.lineTo(t, n);
            }
            c = null, u = null;
        }
    }
    drawArc(t, e, i, n, s, r, a) {
        1 != a && (Math.abs(r - s) > Math.PI ? s > r ? t.arc(e, i, n, s, r, !1) : t.arc(e, i, n, s, r, !0) : s < r ? t.arc(e, i, n, s, r, !1) : t.arc(e, i, n, s, r, !0));
    }
    isPointerInsidePolygon(t, e) {
        var i = this.outerRing.length, n = !1, s = 0;
        for (let t = 0; t < i && s < 3; t++) 1 == this.outerRing[t].visible && s++;
        if (s < 3) return !1;
        var r = null;
        for (let t = 0; t < i; t++) if (1 == this.outerRing[t].visible) {
            r = t;
            break;
        }
        var a = r;
        for (let s = a + 1; s < i; s++) {
            if (0 == this.outerRing[s].visible) continue;
            let i = a;
            var o = this.outerRing[s].canvasX, l = this.outerRing[s].canvasY, h = this.outerRing[i].canvasX;
            if (l > e != (g = this.outerRing[i].canvasY) > e) t < (h - o) * (e - l) / (g - l) + o && (n = !n);
            a = s;
        }
        var g;
        o = this.outerRing[r].canvasX, l = this.outerRing[r].canvasY, h = this.outerRing[a].canvasX;
        l > e != (g = this.outerRing[a].canvasY) > e && (t < (h - o) * (e - l) / (g - l) + o && (n = !n));
        return n;
    }
}