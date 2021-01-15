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
        for (var n = t.carte.translate.a * t.carte.multiplier, s = t.carte.translate.b * t.carte.multiplier, a = t.viewport.centerPoint.x + n, r = t.viewport.centerPoint.y + s, o = t.getVisualizedRadius(), l = !1, h = !1, g = !0, u = null, c = null, v = null, f = 0; f < this.outerRing.length; f++) {
            var R = this.outerRing[f], P = this.outerRing[f - 1];
            if (h = R.visible, 1 == g) 1 == h && (e.moveTo(R.canvasX, R.canvasY), f > 0 && (u = R.projectedTheta), 
            g = !1); else if (1 == h && 1 == l) e.lineTo(R.canvasX, R.canvasY); else if (0 == h && 1 == l) {
                c = P.projectedTheta;
                let t = a + o * Math.cos(c), i = r + o * Math.sin(c);
                e.lineTo(t, i);
            } else if (1 == h && 0 == l) {
                if (c != (v = R.projectedTheta)) {
                    var d = c, m = v, p = Math.abs(m - d) > Math.PI;
                    'night' == this.featureName ? e.arc(a, r, o, d, m, !0) : p ? d > m ? e.arc(a, r, o, d, m, !1) : e.arc(a, r, o, d, m, !0) : d < m ? e.arc(a, r, o, d, m, !1) : e.arc(a, r, o, d, m, !0);
                    let t = a + o * Math.cos(v), i = r + o * Math.sin(v);
                    e.lineTo(t, i);
                }
                c = null, v = null;
            }
            l = R.visible;
        }
        if (null != c && null != u) {
            if (c != u) {
                d = c, m = u, p = Math.abs(m - d) > Math.PI;
                'night' == this.featureName ? e.arc(a, r, o, d, m, !0) : p ? d > m ? e.arc(a, r, o, d, m, !1) : e.arc(a, r, o, d, m, !0) : d < m ? e.arc(a, r, o, d, m, !1) : e.arc(a, r, o, d, m, !0);
                let t = a + o * Math.cos(u), i = r + o * Math.sin(u);
                e.lineTo(t, i);
            }
            c = null, u = null;
        }
    }
    isPointerInsidePolygon(t, e) {
        var i = this.outerRing.length, n = 0, s = 0, a = !1;
        for (n = 0, s = i - 1; n < i; s = n++) {
            if (0 == this.outerRing[n].visible || 0 == this.outerRing[s].visible) return !1;
            var r = this.outerRing[n].canvasX, o = this.outerRing[n].canvasY, l = this.outerRing[s].canvasX, h = this.outerRing[s].canvasY;
            if (o > e != h > e) t < (l - r) * (e - o) / (h - o) + r && (a = !a);
        }
        return a;
    }
}