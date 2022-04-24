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
    computeFeatureStyle(e, t, a, s, i, r) {
        if (expect(e, 'RenderClock'), expect(t, 'vssStyleSheet'), expect(a, 'String'), expect(s, 'String'), 
        expect(i, 'Number'), expect(r, 'Number'), 0 == this.featureIsOnNearSide(e.renderingState)) return;
        if (0 == this.featureIsOnCanvas(e.renderingState)) return;
        let n = t.computeStyle('point', a, s, this.isSelected, this.featureName, this.kvPairs, i);
        expect(n, 'vssCanvasParameters'), this.canvasParams.set(r, n);
        let o = 'circle' == n['symbol-type'] ? 1 : 2, c = Number(n.size);
        isNaN(c) || (o += c);
        let d = Number(n['stroke-width']);
        isNaN(d) || (o += d), this.mouseEpsilon = Math.max(this.mouseEpsilon, o);
    }
    runCourtesyValidator(e, t, a, s, i) {
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
            var i = t.canvas.getContext('2d'), r = this.discretePoint, n = Number(s.scale);
            isNaN(n) && (n = 1);
            var o = !1;
            null != s['stroke-width'] && 'none' != s['stroke-width'] && 0 != s['stroke-width'] && (i.lineWidth = Number(s['stroke-width']) * n, 
            i.strokeStyle = s['stroke-color'], o = !0);
            var c = !1;
            null != s['fill-color'] && 'none' != s['fill-color'] && (i.fillStyle = s['fill-color'], 
            c = !0);
            var d = s['symbol-type'];
            null == d && (d = 'circle');
            var l = 'circle' == d, h = [ 'polygon', 'triangle', 'rhombus', 'pentagon', 'hexagon' ].includes(d), u = [ 'star', 'diamond', 'trigram', 'shuriken', 'pentagram', 'hexagram' ].includes(d), v = [ 'crosshair', 'x-mark' ].includes(d), p = 'unicode' == d;
            if (l) {
                let e = Number(s.size);
                isNaN(e) && (e = 1);
                let t = e + 1;
                this.drawCircle(i, r.canvasX, r.canvasY, t, n, o, c);
            } else {
                if (h) {
                    let e = parseInt(s['node-count']);
                    isNaN(e) && (e = 3);
                    let t = Number(s.size);
                    isNaN(t) && (t = 1);
                    let a = t + 2;
                    switch (d) {
                      case 'triangle':
                        return void this.drawPolygon(i, r.canvasX, r.canvasY, 3, a, n, o, c);

                      case 'rhombus':
                        return void this.drawPolygon(i, r.canvasX, r.canvasY, 4, a, n, o, c);

                      case 'pentagon':
                        return void this.drawPolygon(i, r.canvasX, r.canvasY, 5, a, n, o, c);

                      case 'hexagon':
                        return void this.drawPolygon(i, r.canvasX, r.canvasY, 6, a, n, o, c);

                      case 'polygon':
                      default:
                        return void this.drawPolygon(i, r.canvasX, r.canvasY, e, a, n, o, c);
                    }
                }
                if (u) {
                    let e = parseInt(s['node-count']);
                    isNaN(e) && (e = 5);
                    let t = Number(s.size);
                    isNaN(t) && (t = 1);
                    let a = t + 2, l = Number(s['inner-size']);
                    switch (isNaN(l) && (l = a - 3), d) {
                      case 'diamond':
                        return void this.drawStar(i, r.canvasX, r.canvasY, 2, a, .5 * a, n, o, c);

                      case 'trigram':
                        return void this.drawStar(i, r.canvasX, r.canvasY, 3, a, .25 * a, n, o, c);

                      case 'shuriken':
                        return void this.drawStar(i, r.canvasX, r.canvasY, 4, a, .5 * a, n, o, c);

                      case 'pentagram':
                        return void this.drawStar(i, r.canvasX, r.canvasY, 5, a, .5 * a, n, o, c);

                      case 'hexagram':
                        return void this.drawStar(i, r.canvasX, r.canvasY, 6, a, .5 * a, n, o, c);

                      case 'star':
                      default:
                        return void this.drawStar(i, r.canvasX, r.canvasY, e, a, l, n, o, c);
                    }
                }
                if (v) {
                    let e = Number(s.size);
                    isNaN(e) && (e = 1);
                    let t = e + 2;
                    switch (d) {
                      case 'crosshair':
                        return this.drawOneLine(i, r.canvasX, r.canvasY, t, n, 0), void this.drawOneLine(i, r.canvasX, r.canvasY, t, n, 90);

                      case 'x-mark':
                        return this.drawOneLine(i, r.canvasX, r.canvasY, t, n, 45), void this.drawOneLine(i, r.canvasX, r.canvasY, t, n, 135);

                      default:
                        return;
                    }
                }
                if (p) {
                    let e = Number(s.size);
                    isNaN(e) && (e = 1);
                    var m = null == s['code-point'] ? 'A' : s['code-point'];
                    this.drawText(i, r.canvasX, r.canvasY, e, n, m, o, c);
                } else ;
            }
        }
    }
    drawCircle(e, t, a, s, i, r, n) {
        e.beginPath(), e.arc(t, a, s * i, 0, 2 * Math.PI, !1), e.closePath(), r && e.stroke(), 
        n && e.fill();
    }
    drawPolygon(e, t, a, s, i, r, n, o) {
        if (!(s < 3)) {
            var c = [], d = 360 / s, l = 270;
            for (let e = 0; e < s; e++) {
                var h = l * degreesToRadians;
                c.push({
                    x: Math.cos(h) * i * r,
                    y: Math.sin(h) * i * r
                }), l += d;
            }
            e.beginPath(), e.moveTo(t + c[0].x, a + c[0].y);
            for (let i = 1; i < s; i++) e.lineTo(t + c[i].x, a + c[i].y);
            e.closePath(), n && e.stroke(), o && e.fill();
        }
    }
    drawStar(e, t, a, s, i, r, n, o, c) {
        if (!(s < 2)) {
            var d = 2 * s, l = [], h = 360 / d, u = 270;
            for (let e = 0; e < d; e++) {
                var v = u * degreesToRadians;
                e % 2 == 0 ? l.push({
                    x: Math.cos(v) * i * n,
                    y: Math.sin(v) * i * n
                }) : l.push({
                    x: Math.cos(v) * r * n,
                    y: Math.sin(v) * r * n
                }), u += h;
            }
            e.beginPath(), e.moveTo(t + l[0].x, a + l[0].y);
            for (let s = 1; s < d; s++) e.lineTo(t + l[s].x, a + l[s].y);
            e.closePath(), o && e.stroke(), c && e.fill();
        }
    }
    drawOneLine(e, t, a, s, i, r) {
        var n = r * degreesToRadians, o = Math.cos(n) * s * i, c = Math.sin(n) * s * i, d = (r + 180) * degreesToRadians, l = Math.cos(d) * s * i, h = Math.sin(d) * s * i;
        e.beginPath(), e.moveTo(t + o, a + c), e.lineTo(t + l, a + h), e.stroke();
    }
    drawText(e, t, a, s, i, r, n, o) {
        let c = Math.round(5 + s * i * 2);
        e.font = `${c}px sans-serif`, e.textAlign = 'center', e.textBaseline = 'middle', 
        n && e.strokeText(r, t, a), o && e.fillText(r, t, a);
    }
    isPointerAtPoint(e, t) {
        if (0 == this.discretePoint.isOnNearSide) return !1;
        var a = this.discretePoint.canvasX, s = this.discretePoint.canvasY;
        return e - this.mouseEpsilon < a && a < e + this.mouseEpsilon && t - this.mouseEpsilon < s && s < t + this.mouseEpsilon;
    }
    roughAndReadyPoint() {
        return {
            latitude: this.discretePoint.latitude,
            longitude: this.discretePoint.longitude
        };
    }
}