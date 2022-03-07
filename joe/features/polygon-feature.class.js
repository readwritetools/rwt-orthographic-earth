/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BaseFeature from './base-feature.class.js';

import expect from 'softlib/expect.js';

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
    computeFeatureStyle(e, t, s, i, r) {
        expect(e, 'vssStyleSheet'), expect(t, 'String'), expect(s, 'String'), expect(i, 'Number'), 
        expect(r, 'Number');
        let a = e.computeStyle('polygon', t, s, this.featureName, this.kvPairs, i);
        expect(a, 'vssCanvasParameters'), this.canvasParams.set(r, a);
    }
    runCourtesyValidator(e, t, s, i, r) {
        e.runCourtesyValidator('polygon', t, s, this.featureName, this.kvPairs, i);
    }
    static courtesyValidator(e) {
        switch (e) {
          case 'visibility':
          case 'transparency':
          case 'scale':
          case 'stroke-width':
          case 'stroke-color':
          case 'stroke-type':
          case 'fill-color':
          case 'fill-type':
            return !0;

          default:
            return !1;
        }
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
        let s = this.canvasParams.get(t);
        if (expect(s, 'vssCanvasParameters'), 'hidden' != s.visibility && ('none' != s['fill-color'] || 'none' != s['stroke-width'])) {
            var i = e.canvas.getContext('2d');
            i.beginPath(), this.render_ring(e, i, !1);
            for (var r = 0; r < this.innerRings.length; r++) {
                this.innerRings[r].render_ring(e, i, !0);
            }
            switch (i.closePath(), i.fillStyle = s.computeFillPlusTransparency(), i.strokeStyle = s['stroke-color'], 
            s['stroke-type']) {
              case 'solid':
                i.setLineDash([]);
                break;

              case 'dotted':
                i.setLineDash([ 3, 3 ]);
                break;

              case 'short-dash':
                i.setLineDash([ 10, 10 ]);
                break;

              case 'long-dash':
                i.setLineDash([ 20, 5 ]);
                break;

              case 'dot-dash':
                i.setLineDash([ 15, 3, 3, 3 ]);
                break;

              case 'dot-dot-dash':
                i.setLineDash([ 15, 3, 3, 3, 3, 3 ]);
                break;

              case 'dot-dot-dot-dash':
                i.setLineDash([ 15, 3, 3, 3, 3, 3, 3, 3 ]);
                break;

              case 'dot-dash-dot':
                i.setLineDash([ 3, 3, 12, 3, 3, 12 ]);
                break;

              default:
                i.setLineDash([]);
            }
            if (null != s['stroke-width'] && 'none' != s['stroke-width']) {
                var a = Number(s.scale);
                isNaN(a) && (a = 1);
                var n = Number(s['stroke-width']);
                i.lineWidth = n * a, i.stroke();
            }
            i.setLineDash([]), i.globalCompositeOperation = s['fill-type'], 'none' != s['fill-color'] && i.fill(), 
            i.globalCompositeOperation = 'source-over';
        }
    }
    render_ring(e, t, s) {
        for (var i = e.carte.translate.a * e.carte.multiplier, r = e.carte.translate.b * e.carte.multiplier, a = e.viewport.centerPoint.x + i, n = e.viewport.centerPoint.y + r, o = e.getVisualizedRadius(), l = !1, h = !1, c = !0, u = null, g = null, v = null, d = 0; d < this.outerRing.length; d++) {
            var f = this.outerRing[d], p = this.outerRing[d - 1];
            if (h = f.visible, 1 == c) 1 == h && (t.moveTo(f.canvasX, f.canvasY), d > 0 && (u = f.projectedTheta), 
            c = !1); else if (1 == h && 1 == l) t.lineTo(f.canvasX, f.canvasY); else if (0 == h && 1 == l) {
                g = p.projectedTheta;
                let e = a + o * Math.cos(g), s = n + o * Math.sin(g);
                t.lineTo(e, s);
            } else if (1 == h && 0 == l) {
                if (g != (v = f.projectedTheta)) {
                    var R = g, b = v;
                    'night' == this.featureName ? t.arc(a, n, o, R, b, !0) : this.drawArc(t, a, n, o, R, b, s);
                    let e = a + o * Math.cos(v), i = n + o * Math.sin(v);
                    t.lineTo(e, i);
                }
                g = null, v = null;
            }
            l = f.visible;
        }
        if (null != g && null != u) {
            if (g != u) {
                R = g, b = u;
                'night' == this.featureName ? t.arc(a, n, o, R, b, !0) : this.drawArc(t, a, n, o, R, b, s);
                let e = a + o * Math.cos(u), i = n + o * Math.sin(u);
                t.lineTo(e, i);
            }
            g = null, u = null;
        }
    }
    drawArc(e, t, s, i, r, a, n) {
        1 != n && (Math.abs(a - r) > Math.PI ? r > a ? e.arc(t, s, i, r, a, !1) : e.arc(t, s, i, r, a, !0) : r < a ? e.arc(t, s, i, r, a, !1) : e.arc(t, s, i, r, a, !0));
    }
    isPointerInsidePolygon(e, t) {
        var s = this.outerRing.length, i = !1, r = 0;
        for (let e = 0; e < s && r < 3; e++) 1 == this.outerRing[e].visible && r++;
        if (r < 3) return !1;
        var a = null;
        for (let e = 0; e < s; e++) if (1 == this.outerRing[e].visible) {
            a = e;
            break;
        }
        var n = a;
        for (let r = n + 1; r < s; r++) {
            if (0 == this.outerRing[r].visible) continue;
            let s = n;
            var o = this.outerRing[r].canvasX, l = this.outerRing[r].canvasY, h = this.outerRing[s].canvasX;
            if (l > t != (c = this.outerRing[s].canvasY) > t) e < (h - o) * (t - l) / (c - l) + o && (i = !i);
            n = r;
        }
        var c;
        o = this.outerRing[a].canvasX, l = this.outerRing[a].canvasY, h = this.outerRing[n].canvasX;
        l > t != (c = this.outerRing[n].canvasY) > t && (e < (h - o) * (t - l) / (c - l) + o && (i = !i));
        return i;
    }
}