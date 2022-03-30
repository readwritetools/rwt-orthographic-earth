/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BaseFeature from './base-feature.class.js';

import ProjectedPoint from '../projection/projected-point.class.js';

import RS from '../enum/rendering-state.enum.js';

import expect from '../dev/expect.js';

const degreesToRadians = Math.PI / 180;

export default class PointFeature extends BaseFeature {
    constructor() {
        super(), this.discretePoint = new ProjectedPoint(0, 0), this.mouseEpsilon = 3;
    }
    get featureType() {
        return 'place';
    }
    setPoint(e) {
        expect(e, 'ProjectedPoint'), this.discretePoint = e;
    }
    computeFeatureStyle(e, t, a, s, r, i) {
        if (expect(e, 'RenderClock'), expect(t, 'vssStyleSheet'), expect(a, 'String'), expect(s, 'String'), 
        expect(r, 'Number'), expect(i, 'Number'), 0 == this.featureIsOnNearSide(e.renderingState)) return;
        if (0 == this.featureIsOnCanvas(e.renderingState)) return;
        let n = t.computeStyle('point', a, s, this.featureName, this.kvPairs, r);
        expect(n, 'vssCanvasParameters'), this.canvasParams.set(i, n);
        let o = 'circle' == n['symbol-type'] ? 1 : 2, c = Number(n.size);
        isNaN(c) || (o += c);
        let l = Number(n['stroke-width']);
        isNaN(l) || (o += l), this.mouseEpsilon = Math.max(this.mouseEpsilon, o);
    }
    runCourtesyValidator(e, t, a, s, r) {
        e.runCourtesyValidator('point', t, a, this.featureName, this.kvPairs, s);
    }
    static courtesyValidator(e) {
        switch (e) {
          case 'visibility':
          case 'scale':
          case 'symbol-type':
          case 'stroke-width':
          case 'stroke-color':
          case 'fill-color':
          case 'size':
          case 'inner-size':
          case 'node-count':
          case 'code-point':
            return !0;

          default:
            return !1;
        }
    }
    toGeoCoords(e, t) {
        t.toPhiLambda(this.discretePoint);
    }
    toPlane(e, t) {
        expect(e, 'RenderClock'), expect(t, 'OrthographicProjection'), this.pointsOnNearSide = 0, 
        this.pointsOnFarSide = 0;
        let a = this.discretePoint;
        if (t.toEastingNorthing(a), a.isOnNearSide) this.pointsOnNearSide++; else if (this.pointsOnFarSide++, 
        e.renderingState == RS.SKETCHING) return;
    }
    toPixels(e, t) {
        expect(e, 'RenderClock'), expect(t, 'CartesianTransformation'), 0 != this.featureIsOnNearSide(e.renderingState) && t.toEarthXY(this.discretePoint, !0, !0, !0);
    }
    toViewportCanvas(e, t) {
        if (expect(e, 'RenderClock'), expect(t, 'Viewport'), 0 == this.featureIsOnNearSide(e.renderingState)) return;
        this.pointsOnCanvas = 0, this.pointsOffCanvas = 0;
        let a = this.discretePoint;
        t.toCanvasXY(a), a.isOnNearSide && (a.isOnCanvas ? this.pointsOnCanvas++ : this.pointsOffCanvas++);
    }
    drawFeature(e, t, a) {
        if (expect(e, 'RenderClock'), expect(t, 'Earth'), expect(a, 'Number'), 0 == this.featureIsOnNearSide(e.renderingState)) return;
        if (0 == this.featureIsOnCanvas(e.renderingState)) return;
        let s = this.canvasParams.get(a);
        if (0 != this.hasSomethingToDraw(s)) {
            var r = t.canvas.getContext('2d'), i = this.discretePoint, n = Number(s.scale);
            isNaN(n) && (n = 1);
            var o = !1;
            null != s['stroke-width'] && 'none' != s['stroke-width'] && 0 != s['stroke-width'] && (r.lineWidth = Number(s['stroke-width']) * n, 
            r.strokeStyle = s['stroke-color'], o = !0);
            var c = !1;
            null != s['fill-color'] && 'none' != s['fill-color'] && (r.fillStyle = s['fill-color'], 
            c = !0);
            var l = s['symbol-type'];
            null == l && (l = 'circle');
            var d = 'circle' == l, h = [ 'polygon', 'triangle', 'rhombus', 'pentagon', 'hexagon' ].includes(l), u = [ 'star', 'diamond', 'trigram', 'shuriken', 'pentagram', 'hexagram' ].includes(l), v = [ 'crosshair', 'x-mark' ].includes(l), p = 'unicode' == l;
            if (d) {
                let e = Number(s.size);
                isNaN(e) && (e = 1);
                let t = e + 1;
                this.drawCircle(r, i.canvasX, i.canvasY, t, n, o, c);
            } else {
                if (h) {
                    let e = parseInt(s['node-count']);
                    isNaN(e) && (e = 3);
                    let t = Number(s.size);
                    isNaN(t) && (t = 1);
                    let a = t + 2;
                    switch (l) {
                      case 'triangle':
                        return void this.drawPolygon(r, i.canvasX, i.canvasY, 3, a, n, o, c);

                      case 'rhombus':
                        return void this.drawPolygon(r, i.canvasX, i.canvasY, 4, a, n, o, c);

                      case 'pentagon':
                        return void this.drawPolygon(r, i.canvasX, i.canvasY, 5, a, n, o, c);

                      case 'hexagon':
                        return void this.drawPolygon(r, i.canvasX, i.canvasY, 6, a, n, o, c);

                      case 'polygon':
                      default:
                        return void this.drawPolygon(r, i.canvasX, i.canvasY, e, a, n, o, c);
                    }
                }
                if (u) {
                    let e = parseInt(s['node-count']);
                    isNaN(e) && (e = 5);
                    let t = Number(s.size);
                    isNaN(t) && (t = 1);
                    let a = t + 2, d = Number(s['inner-size']);
                    switch (isNaN(d) && (d = a - 3), l) {
                      case 'diamond':
                        return void this.drawStar(r, i.canvasX, i.canvasY, 2, a, .5 * a, n, o, c);

                      case 'trigram':
                        return void this.drawStar(r, i.canvasX, i.canvasY, 3, a, .25 * a, n, o, c);

                      case 'shuriken':
                        return void this.drawStar(r, i.canvasX, i.canvasY, 4, a, .5 * a, n, o, c);

                      case 'pentagram':
                        return void this.drawStar(r, i.canvasX, i.canvasY, 5, a, .5 * a, n, o, c);

                      case 'hexagram':
                        return void this.drawStar(r, i.canvasX, i.canvasY, 6, a, .5 * a, n, o, c);

                      case 'star':
                      default:
                        return void this.drawStar(r, i.canvasX, i.canvasY, e, a, d, n, o, c);
                    }
                }
                if (v) {
                    let e = Number(s.size);
                    isNaN(e) && (e = 1);
                    let t = e + 2;
                    switch (l) {
                      case 'crosshair':
                        return this.drawOneLine(r, i.canvasX, i.canvasY, t, n, 0), void this.drawOneLine(r, i.canvasX, i.canvasY, t, n, 90);

                      case 'x-mark':
                        return this.drawOneLine(r, i.canvasX, i.canvasY, t, n, 45), void this.drawOneLine(r, i.canvasX, i.canvasY, t, n, 135);

                      default:
                        return;
                    }
                }
                if (p) {
                    let e = Number(s.size);
                    isNaN(e) && (e = 1);
                    var m = null == s['code-point'] ? 'A' : s['code-point'];
                    this.drawText(r, i.canvasX, i.canvasY, e, n, m, o, c);
                } else ;
            }
        }
    }
    drawCircle(e, t, a, s, r, i, n) {
        e.beginPath(), e.arc(t, a, s * r, 0, 2 * Math.PI, !1), e.closePath(), i && e.stroke(), 
        n && e.fill();
    }
    drawPolygon(e, t, a, s, r, i, n, o) {
        if (!(s < 3)) {
            var c = [], l = 360 / s, d = 270;
            for (let e = 0; e < s; e++) {
                var h = d * degreesToRadians;
                c.push({
                    x: Math.cos(h) * r * i,
                    y: Math.sin(h) * r * i
                }), d += l;
            }
            e.beginPath(), e.moveTo(t + c[0].x, a + c[0].y);
            for (let r = 1; r < s; r++) e.lineTo(t + c[r].x, a + c[r].y);
            e.closePath(), n && e.stroke(), o && e.fill();
        }
    }
    drawStar(e, t, a, s, r, i, n, o, c) {
        if (!(s < 2)) {
            var l = 2 * s, d = [], h = 360 / l, u = 270;
            for (let e = 0; e < l; e++) {
                var v = u * degreesToRadians;
                e % 2 == 0 ? d.push({
                    x: Math.cos(v) * r * n,
                    y: Math.sin(v) * r * n
                }) : d.push({
                    x: Math.cos(v) * i * n,
                    y: Math.sin(v) * i * n
                }), u += h;
            }
            e.beginPath(), e.moveTo(t + d[0].x, a + d[0].y);
            for (let s = 1; s < l; s++) e.lineTo(t + d[s].x, a + d[s].y);
            e.closePath(), o && e.stroke(), c && e.fill();
        }
    }
    drawOneLine(e, t, a, s, r, i) {
        var n = i * degreesToRadians, o = Math.cos(n) * s * r, c = Math.sin(n) * s * r, l = (i + 180) * degreesToRadians, d = Math.cos(l) * s * r, h = Math.sin(l) * s * r;
        e.beginPath(), e.moveTo(t + o, a + c), e.lineTo(t + d, a + h), e.stroke();
    }
    drawText(e, t, a, s, r, i, n, o) {
        let c = Math.round(5 + s * r * 2);
        e.font = `${c}px sans-serif`, e.textAlign = 'center', e.textBaseline = 'middle', 
        n && e.strokeText(i, t, a), o && e.fillText(i, t, a);
    }
    isPointerAtPoint(e, t) {
        if (0 == this.discretePoint.isOnNearSide) return !1;
        var a = this.discretePoint.canvasX, s = this.discretePoint.canvasY;
        return e - this.mouseEpsilon < a && a < e + this.mouseEpsilon && t - this.mouseEpsilon < s && s < t + this.mouseEpsilon;
    }
}