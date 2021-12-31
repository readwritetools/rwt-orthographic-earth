/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BaseFeature from './base-feature.class.js';

import expect from '../joezone/expect.js';

export default class PolygonFeature extends BaseFeature {
    constructor() {
        super(), this.outerRing = [], this.innerRings = [];
    }
    get featureType() {
        return 'region';
    }
    addPoint(e) {
        this.outerRing.push(e);
    }
    computeFeatureStyle(e, t, i, s, r) {
        expect(e, 'vssStyleSheet'), expect(t, 'String'), expect(i, 'String'), expect(s, 'Number'), 
        expect(r, 'Number');
        let n = e.computeStyle('polygon', t, i, this.featureName, this.kvPairs, s);
        expect(n, 'vssCanvasParameters'), this.canvasParams.set(r, n);
    }
    toGeoCoords(e) {
        for (var t = 0; t < this.outerRing.length; t++) e.toGeoCoords(this.outerRing[t]);
        for (t = 0; t < this.innerRings.length; t++) this.innerRings[t].toGeoCoords(e);
    }
    toPlane(e) {
        for (var t = 0; t < this.outerRing.length; t++) e.toPlane(this.outerRing[t]);
        for (t = 0; t < this.innerRings.length; t++) this.innerRings[t].toPlane(e);
    }
    toPixels(e) {
        for (var t = 0; t < this.outerRing.length; t++) e.toPixels(this.outerRing[t], !0, !0, !0);
        for (t = 0; t < this.innerRings.length; t++) this.innerRings[t].toPixels(e);
    }
    toCanvas(e) {
        for (var t = 0; t < this.outerRing.length; t++) e.toCanvas(this.outerRing[t]);
        for (t = 0; t < this.innerRings.length; t++) this.innerRings[t].toCanvas(e);
    }
    renderFeature(e, t) {
        expect(e, 'Earth'), expect(t, 'Number');
        let i = this.canvasParams.get(t);
        if (expect(i, 'vssCanvasParameters'), 'hidden' != i.visibility && ('none' != i['fill-color'] || 'none' != i['stroke-width'])) {
            var s = e.canvas.getContext('2d');
            s.beginPath(), this.render_ring(e, s, !1);
            for (var r = 0; r < this.innerRings.length; r++) {
                this.innerRings[r].render_ring(e, s, !0);
            }
            switch (s.closePath(), s.fillStyle = i.computeFillPlusTransparency(), s.strokeStyle = i['stroke-color'], 
            s.lineWidth = i['stroke-width'], i['stroke-type']) {
              case 'solid':
                s.setLineDash([]);
                break;

              case 'dotted':
                s.setLineDash([ 3, 3 ]);
                break;

              case 'short-dash':
                s.setLineDash([ 10, 10 ]);
                break;

              case 'long-dash':
                s.setLineDash([ 20, 5 ]);
                break;

              case 'dot-dash':
                s.setLineDash([ 15, 3, 3, 3 ]);
                break;

              case 'dot-dot-dash':
                s.setLineDash([ 15, 3, 3, 3, 3, 3 ]);
                break;

              case 'dot-dot-dot-dash':
                s.setLineDash([ 15, 3, 3, 3, 3, 3, 3, 3 ]);
                break;

              case 'dot-dash-dot':
                s.setLineDash([ 3, 3, 12, 3, 3, 12 ]);
                break;

              default:
                s.setLineDash([]);
            }
            'none' != i['stroke-width'] && s.stroke(), s.globalCompositeOperation = i['fill-type'], 
            'none' != i['fill-color'] && s.fill(), s.globalCompositeOperation = 'source-over';
        }
    }
    render_ring(e, t, i) {
        for (var s = e.carte.translate.a * e.carte.multiplier, r = e.carte.translate.b * e.carte.multiplier, n = e.viewport.centerPoint.x + s, a = e.viewport.centerPoint.y + r, o = e.getVisualizedRadius(), l = !1, h = !1, c = !0, g = null, u = null, v = null, d = 0; d < this.outerRing.length; d++) {
            var f = this.outerRing[d], R = this.outerRing[d - 1];
            if (h = f.visible, 1 == c) 1 == h && (t.moveTo(f.canvasX, f.canvasY), d > 0 && (g = f.projectedTheta), 
            c = !1); else if (1 == h && 1 == l) t.lineTo(f.canvasX, f.canvasY); else if (0 == h && 1 == l) {
                u = R.projectedTheta;
                let e = n + o * Math.cos(u), i = a + o * Math.sin(u);
                t.lineTo(e, i);
            } else if (1 == h && 0 == l) {
                if (u != (v = f.projectedTheta)) {
                    var p = u, b = v;
                    'night' == this.featureName ? t.arc(n, a, o, p, b, !0) : this.drawArc(t, n, a, o, p, b, i);
                    let e = n + o * Math.cos(v), s = a + o * Math.sin(v);
                    t.lineTo(e, s);
                }
                u = null, v = null;
            }
            l = f.visible;
        }
        if (null != u && null != g) {
            if (u != g) {
                p = u, b = g;
                'night' == this.featureName ? t.arc(n, a, o, p, b, !0) : this.drawArc(t, n, a, o, p, b, i);
                let e = n + o * Math.cos(g), s = a + o * Math.sin(g);
                t.lineTo(e, s);
            }
            u = null, g = null;
        }
    }
    drawArc(e, t, i, s, r, n, a) {
        1 != a && (Math.abs(n - r) > Math.PI ? r > n ? e.arc(t, i, s, r, n, !1) : e.arc(t, i, s, r, n, !0) : r < n ? e.arc(t, i, s, r, n, !1) : e.arc(t, i, s, r, n, !0));
    }
    isPointerInsidePolygon(e, t) {
        var i = this.outerRing.length, s = !1, r = 0;
        for (let e = 0; e < i && r < 3; e++) 1 == this.outerRing[e].visible && r++;
        if (r < 3) return !1;
        var n = null;
        for (let e = 0; e < i; e++) if (1 == this.outerRing[e].visible) {
            n = e;
            break;
        }
        var a = n;
        for (let r = a + 1; r < i; r++) {
            if (0 == this.outerRing[r].visible) continue;
            let i = a;
            var o = this.outerRing[r].canvasX, l = this.outerRing[r].canvasY, h = this.outerRing[i].canvasX;
            if (l > t != (c = this.outerRing[i].canvasY) > t) e < (h - o) * (t - l) / (c - l) + o && (s = !s);
            a = r;
        }
        var c;
        o = this.outerRing[n].canvasX, l = this.outerRing[n].canvasY, h = this.outerRing[a].canvasX;
        l > t != (c = this.outerRing[a].canvasY) > t && (e < (h - o) * (t - l) / (c - l) + o && (s = !s));
        return s;
    }
}