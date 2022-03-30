/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BaseFeature from './base-feature.class.js';

import RS from '../enum/rendering-state.enum.js';

import expect from '../dev/expect.js';

export default class PolygonFeature extends BaseFeature {
    constructor() {
        super(), this.outerRing = [], this.innerRings = [];
    }
    get featureType() {
        return 'region';
    }
    addPoint(e) {
        expect(e, 'ProjectedPoint'), this.outerRing.push(e);
    }
    computeFeatureStyle(e, t, i, r, n, s) {
        if (expect(e, 'RenderClock'), expect(t, 'vssStyleSheet'), expect(i, 'String'), expect(r, 'String'), 
        expect(n, 'Number'), expect(s, 'Number'), 0 == this.featureIsOnNearSide(e.renderingState)) return;
        if (0 == this.featureIsOnCanvas(e.renderingState)) return;
        let a = t.computeStyle('polygon', i, r, this.featureName, this.kvPairs, n);
        expect(a, 'vssCanvasParameters'), this.canvasParams.set(s, a);
    }
    runCourtesyValidator(e, t, i, r, n) {
        e.runCourtesyValidator('polygon', t, i, this.featureName, this.kvPairs, r);
    }
    static courtesyValidator(e) {
        switch (e) {
          case 'visibility':
          case 'scale':
          case 'transparency':
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
    toGeoCoords(e, t) {
        for (var i = 0; i < this.outerRing.length; i++) t.toPhiLambda(this.outerRing[i]);
        for (i = 0; i < this.innerRings.length; i++) for (var r = this.innerRings[i], n = 0; n < r.outerRing.length; n++) {
            let e = r.outerRing[n];
            t.toPhiLambda(e);
        }
    }
    toPlane(e, t) {
        expect(e, 'RenderClock'), expect(t, 'OrthographicProjection'), this.pointsOnNearSide = 0, 
        this.pointsOnFarSide = 0;
        for (var i = 0; i < this.outerRing.length; i++) {
            let r = this.outerRing[i];
            if (t.toEastingNorthing(r), r.isOnNearSide) this.pointsOnNearSide++; else if (this.pointsOnFarSide++, 
            e.renderingState == RS.SKETCHING) return;
        }
        for (i = 0; i < this.innerRings.length; i++) for (var r = this.innerRings[i], n = 0; n < r.outerRing.length; n++) {
            let i = r.outerRing[n];
            if (t.toEastingNorthing(i), i.isOnNearSide) this.pointsOnNearSide++; else if (this.pointsOnFarSide++, 
            e.renderingState == RS.SKETCHING) return;
        }
    }
    toPixels(e, t) {
        if (expect(e, 'RenderClock'), expect(t, 'CartesianTransformation'), 0 != this.featureIsOnNearSide(e.renderingState)) {
            for (var i = 0; i < this.outerRing.length; i++) t.toEarthXY(this.outerRing[i], !0, !0, !0);
            for (i = 0; i < this.innerRings.length; i++) this.innerRings[i].toPixels(e, t);
        }
    }
    toViewportCanvas(e, t) {
        if (expect(e, 'RenderClock'), expect(t, 'Viewport'), 0 != this.featureIsOnNearSide(e.renderingState)) {
            this.pointsOnCanvas = 0, this.pointsOffCanvas = 0;
            for (var i = 0; i < this.outerRing.length; i++) {
                let r = this.outerRing[i];
                if (t.toCanvasXY(r), r.isOnNearSide) if (r.isOnCanvas) this.pointsOnCanvas++; else if (this.pointsOffCanvas++, 
                e.renderingState == RS.SKETCHING) return;
            }
            for (i = 0; i < this.innerRings.length; i++) for (var r = this.innerRings[i], n = 0; n < r.outerRing.length; n++) {
                let i = r.outerRing[n];
                if (t.toCanvasXY(i), i.isOnNearSide) if (i.isOnCanvas) this.pointsOnCanvas++; else if (this.pointsOffCanvas++, 
                e.renderingState == RS.SKETCHING) return;
            }
        }
    }
    drawFeature(e, t, i) {
        if (expect(e, 'RenderClock'), expect(t, 'Earth'), expect(i, 'Number'), 0 == this.featureIsOnNearSide(e.renderingState)) return;
        if (0 == this.featureIsOnCanvas(e.renderingState)) return;
        let r = this.canvasParams.get(i);
        if (0 != this.hasSomethingToDraw(r) && ('none' != r['fill-color'] || 'none' != r['stroke-width'])) {
            var n = t.canvas.getContext('2d');
            n.beginPath(), this.drawRing(t, n, !1);
            for (var s = 0; s < this.innerRings.length; s++) {
                this.innerRings[s].drawRing(t, n, !0);
            }
            if (n.closePath(), n.fillStyle = r.computeFillPlusTransparency(), null != r['stroke-color'] && 'none' != r['stroke-color']) {
                switch (n.strokeStyle = r['stroke-color'], r['stroke-type']) {
                  case 'solid':
                    n.setLineDash([]);
                    break;

                  case 'dotted':
                    n.setLineDash([ 3, 3 ]);
                    break;

                  case 'short-dash':
                    n.setLineDash([ 10, 10 ]);
                    break;

                  case 'long-dash':
                    n.setLineDash([ 20, 5 ]);
                    break;

                  case 'dot-dash':
                    n.setLineDash([ 15, 3, 3, 3 ]);
                    break;

                  case 'dot-dot-dash':
                    n.setLineDash([ 15, 3, 3, 3, 3, 3 ]);
                    break;

                  case 'dot-dot-dot-dash':
                    n.setLineDash([ 15, 3, 3, 3, 3, 3, 3, 3 ]);
                    break;

                  case 'dot-dash-dot':
                    n.setLineDash([ 3, 3, 12, 3, 3, 12 ]);
                    break;

                  default:
                    n.setLineDash([]);
                }
                if (null != r['stroke-width'] && 'none' != r['stroke-width'] && 0 != r['stroke-width']) {
                    var a = Number(r.scale);
                    isNaN(a) && (a = 1);
                    var o = Number(r['stroke-width']);
                    n.lineWidth = o * a, n.stroke();
                }
                n.setLineDash([]);
            }
            n.globalCompositeOperation = r['fill-type'], 'none' != r['fill-color'] && n.fill(), 
            n.globalCompositeOperation = 'source-over';
        }
    }
    drawRing(e, t, i) {
        for (var r = e.carte.translate.a * e.carte.multiplier, n = e.carte.translate.b * e.carte.multiplier, s = e.viewport.centerPoint.x + r, a = e.viewport.centerPoint.y + n, o = e.getVisualizedRadius(), h = !1, l = !1, c = !0, u = null, g = null, d = null, f = 0; f < this.outerRing.length; f++) {
            var p = this.outerRing[f], v = this.outerRing[f - 1];
            if (l = p.isOnNearSide, 1 == c) 1 == l && (t.moveTo(p.canvasX, p.canvasY), f > 0 && (u = p.projectedTheta), 
            c = !1); else if (1 == l && 1 == h) t.lineTo(p.canvasX, p.canvasY); else if (0 == l && 1 == h) {
                g = v.projectedTheta;
                let e = s + o * Math.cos(g), i = a + o * Math.sin(g);
                t.lineTo(e, i);
            } else if (1 == l && 0 == h) {
                if (g != (d = p.projectedTheta)) {
                    var R = g, S = d;
                    'night' == this.featureName ? t.arc(s, a, o, R, S, !0) : this.drawArc(t, s, a, o, R, S, i);
                    let e = s + o * Math.cos(d), r = a + o * Math.sin(d);
                    t.lineTo(e, r);
                }
                g = null, d = null;
            }
            h = p.isOnNearSide;
        }
        if (null != g && null != u) {
            if (g != u) {
                R = g, S = u;
                'night' == this.featureName ? t.arc(s, a, o, R, S, !0) : this.drawArc(t, s, a, o, R, S, i);
                let e = s + o * Math.cos(u), r = a + o * Math.sin(u);
                t.lineTo(e, r);
            }
            g = null, u = null;
        }
    }
    drawArc(e, t, i, r, n, s, a) {
        1 != a && (Math.abs(s - n) > Math.PI ? n > s ? e.arc(t, i, r, n, s, !1) : e.arc(t, i, r, n, s, !0) : n < s ? e.arc(t, i, r, n, s, !1) : e.arc(t, i, r, n, s, !0));
    }
    isPointerInsidePolygon(e, t) {
        var i = this.outerRing.length, r = !1, n = 0;
        for (let e = 0; e < i && n < 3; e++) 1 == this.outerRing[e].isOnNearSide && n++;
        if (n < 3) return !1;
        var s = null;
        for (let e = 0; e < i; e++) if (1 == this.outerRing[e].isOnNearSide) {
            s = e;
            break;
        }
        var a = s;
        for (let n = a + 1; n < i; n++) {
            if (0 == this.outerRing[n].isOnNearSide) continue;
            let i = a;
            var o = this.outerRing[n].canvasX, h = this.outerRing[n].canvasY, l = this.outerRing[i].canvasX;
            if (h > t != (c = this.outerRing[i].canvasY) > t) e < (l - o) * (t - h) / (c - h) + o && (r = !r);
            a = n;
        }
        var c;
        o = this.outerRing[s].canvasX, h = this.outerRing[s].canvasY, l = this.outerRing[a].canvasX;
        h > t != (c = this.outerRing[a].canvasY) > t && (e < (l - o) * (t - h) / (c - h) + o && (r = !r));
        return r;
    }
}