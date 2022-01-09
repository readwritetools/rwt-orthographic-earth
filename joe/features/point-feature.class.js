/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BaseFeature from './base-feature.class.js';

import ProjectedPoint from '../projection/projected-point.class.js';

import expect from '../joezone/expect.js';

const degreesToRadians = Math.PI / 180;

export default class PointFeature extends BaseFeature {
    constructor() {
        super(), this.discretePoint = new ProjectedPoint(0, 0), this.mouseEpsilon = 3;
    }
    get featureType() {
        return 'place';
    }
    computeFeatureStyle(e, t, a, s, r) {
        expect(e, 'vssStyleSheet'), expect(t, 'String'), expect(a, 'String'), expect(s, 'Number'), 
        expect(r, 'Number');
        let i = e.computeStyle('point', t, a, this.featureName, this.kvPairs, s);
        expect(i, 'vssCanvasParameters'), this.canvasParams.set(r, i);
        let o = 'circle' == i['symbol-type'] ? 1 : 2, n = Number(i.size);
        isNaN(n) || (o += n);
        let c = Number(i['stroke-width']);
        isNaN(c) || (o += c), this.mouseEpsilon = Math.max(this.mouseEpsilon, o);
    }
    runCourtesyValidator(e, t, a, s, r) {
        e.runCourtesyValidator('point', t, a, this.featureName, this.kvPairs, s);
    }
    static courtesyValidator(e) {
        switch (e) {
          case 'visibility':
          case 'symbol-type':
          case 'size':
          case 'scale':
          case 'stroke-width':
          case 'stroke-color':
          case 'fill-color':
          case 'inner-size':
          case 'node-count':
            return !0;

          default:
            return !1;
        }
    }
    toGeoCoords(e) {
        e.toGeoCoords(this.discretePoint);
    }
    toPlane(e) {
        e.toPlane(this.discretePoint);
    }
    toPixels(e) {
        e.toPixels(this.discretePoint, !0, !0, !0);
    }
    toCanvas(e) {
        e.toCanvas(this.discretePoint);
    }
    renderFeature(e, t) {
        expect(e, 'Earth'), expect(t, 'Number');
        var a = this.discretePoint;
        if (1 != a.visible) return;
        let s = this.canvasParams.get(t);
        if (expect(s, 'vssCanvasParameters'), 'hidden' != s.visibility) {
            var r = e.canvas.getContext('2d');
            r.fillStyle = s['fill-color'], r.strokeStyle = s['stroke-color'];
            var i, o = Number(s.scale);
            isNaN(o) && (o = 1), null == s['stroke-width'] || 'none' == s['stroke-width'] ? (r.lineWidth = 0, 
            i = !1) : (r.lineWidth = Number(s['stroke-width']) * o, i = !0);
            var n = s['symbol-type'];
            null == n && (n = 'circle');
            var c = 'circle' == n, l = [ 'polygon', 'triangle', 'rhombus', 'pentagon', 'hexagon' ].includes(n), d = [ 'star', 'diamond', 'trigram', 'shuriken', 'pentagram', 'hexagram' ].includes(n);
            if (c) {
                let e = Number(s.size);
                isNaN(e) && (e = 1);
                let t = e + 1;
                this.drawCircle(r, a.canvasX, a.canvasY, t, o, i);
            } else {
                if (l) {
                    let e = parseInt(s['node-count']);
                    isNaN(e) && (e = 3);
                    let t = Number(s.size);
                    isNaN(t) && (t = 1);
                    let c = t + 2;
                    switch (n) {
                      case 'triangle':
                        return void this.drawPolygon(r, a.canvasX, a.canvasY, 3, c, o, i);

                      case 'rhombus':
                        return void this.drawPolygon(r, a.canvasX, a.canvasY, 4, c, o, i);

                      case 'pentagon':
                        return void this.drawPolygon(r, a.canvasX, a.canvasY, 5, c, o, i);

                      case 'hexagon':
                        return void this.drawPolygon(r, a.canvasX, a.canvasY, 6, c, o, i);

                      case 'polygon':
                      default:
                        return void this.drawPolygon(r, a.canvasX, a.canvasY, e, c, o, i);
                    }
                }
                if (d) {
                    let e = parseInt(s['node-count']);
                    isNaN(e) && (e = 3);
                    let t = Number(s.size);
                    isNaN(t) && (t = 1);
                    let c = t + 2, l = Number(s['inner-size']);
                    switch (isNaN(l) && (l = c - 3), n) {
                      case 'diamond':
                        return void this.drawStar(r, a.canvasX, a.canvasY, 2, c, .5 * c, o, i);

                      case 'trigram':
                        return void this.drawStar(r, a.canvasX, a.canvasY, 3, c, .4 * c, o, i);

                      case 'shuriken':
                        return void this.drawStar(r, a.canvasX, a.canvasY, 4, c, .65 * c, o, i);

                      case 'pentagram':
                        return void this.drawStar(r, a.canvasX, a.canvasY, 5, c, .75 * c, o, i);

                      case 'hexagram':
                        return void this.drawStar(r, a.canvasX, a.canvasY, 6, c, .75 * c, o, i);

                      case 'star':
                      default:
                        return void this.drawStar(r, a.canvasX, a.canvasY, e, c, l, o, i);
                    }
                }
            }
        }
    }
    drawCircle(e, t, a, s, r, i) {
        e.beginPath(), e.arc(t, a, s * r, 0, 2 * Math.PI, !1), e.closePath(), i && e.stroke(), 
        e.fill();
    }
    drawPolygon(e, t, a, s, r, i, o) {
        if (!(s < 3)) {
            var n = [], c = 360 / s, l = 270;
            for (let e = 0; e < s; e++) {
                var d = l * degreesToRadians;
                n.push({
                    x: Math.cos(d) * r * i,
                    y: Math.sin(d) * r * i
                }), l += c;
            }
            e.beginPath(), e.moveTo(t + n[0].x, a + n[0].y);
            for (let r = 1; r < s; r++) e.lineTo(t + n[r].x, a + n[r].y);
            e.closePath(), o && e.stroke(), e.fill();
        }
    }
    drawStar(e, t, a, s, r, i, o, n) {
        if (!(s < 2)) {
            var c = 2 * s, l = [], d = 360 / c, h = 270;
            for (let e = 0; e < c; e++) {
                var u = h * degreesToRadians;
                e % 2 == 0 ? l.push({
                    x: Math.cos(u) * r * o,
                    y: Math.sin(u) * r * o
                }) : l.push({
                    x: Math.cos(u) * i * o,
                    y: Math.sin(u) * i * o
                }), h += d;
            }
            e.beginPath(), e.moveTo(t + l[0].x, a + l[0].y);
            for (let s = 1; s < c; s++) e.lineTo(t + l[s].x, a + l[s].y);
            e.closePath(), n && e.stroke(), e.fill();
        }
    }
    isPointerAtPoint(e, t) {
        if (0 == this.discretePoint.visible) return !1;
        var a = this.discretePoint.canvasX, s = this.discretePoint.canvasY;
        return e - this.mouseEpsilon < a && a < e + this.mouseEpsilon && t - this.mouseEpsilon < s && s < t + this.mouseEpsilon;
    }
}