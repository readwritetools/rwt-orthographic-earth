/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BaseFeature from './base-feature.class.js';

import ProjectedPoint from '../projection/projected-point.class.js';

import expect from 'softlib/expect.js';

const degreesToRadians = Math.PI / 180;

export default class PointFeature extends BaseFeature {
    constructor() {
        super(), this.discretePoint = new ProjectedPoint(0, 0), this.mouseEpsilon = 3;
    }
    get featureType() {
        return 'place';
    }
    computeFeatureStyle(e, t, s, a, r) {
        expect(e, 'vssStyleSheet'), expect(t, 'String'), expect(s, 'String'), expect(a, 'Number'), 
        expect(r, 'Number');
        let i = e.computeStyle('point', t, s, this.featureName, this.kvPairs, a);
        expect(i, 'vssCanvasParameters'), this.canvasParams.set(r, i);
        let o = 'circle' == i['symbol-type'] ? 1 : 2, n = Number(i.size);
        isNaN(n) || (o += n);
        let c = Number(i['stroke-width']);
        isNaN(c) || (o += c), this.mouseEpsilon = Math.max(this.mouseEpsilon, o);
    }
    runCourtesyValidator(e, t, s, a, r) {
        e.runCourtesyValidator('point', t, s, this.featureName, this.kvPairs, a);
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
        var s = this.discretePoint;
        if (1 != s.visible) return;
        let a = this.canvasParams.get(t);
        if (expect(a, 'vssCanvasParameters'), 'hidden' != a.visibility) {
            var r = e.canvas.getContext('2d');
            r.fillStyle = a['fill-color'], r.strokeStyle = a['stroke-color'];
            var i, o = Number(a.scale);
            isNaN(o) && (o = 1), null == a['stroke-width'] || 'none' == a['stroke-width'] ? (r.lineWidth = 0, 
            i = !1) : (r.lineWidth = Number(a['stroke-width']) * o, i = !0);
            var n = a['symbol-type'];
            null == n && (n = 'circle');
            var c = 'circle' == n, l = [ 'polygon', 'triangle', 'rhombus', 'pentagon', 'hexagon' ].includes(n), d = [ 'star', 'diamond', 'trigram', 'shuriken', 'pentagram', 'hexagram' ].includes(n);
            if (c) {
                let e = Number(a.size);
                isNaN(e) && (e = 1);
                let t = e + 1;
                this.drawCircle(r, s.canvasX, s.canvasY, t, o, i);
            } else {
                if (l) {
                    let e = parseInt(a['node-count']);
                    isNaN(e) && (e = 3);
                    let t = Number(a.size);
                    isNaN(t) && (t = 1);
                    let c = t + 2;
                    switch (n) {
                      case 'triangle':
                        return void this.drawPolygon(r, s.canvasX, s.canvasY, 3, c, o, i);

                      case 'rhombus':
                        return void this.drawPolygon(r, s.canvasX, s.canvasY, 4, c, o, i);

                      case 'pentagon':
                        return void this.drawPolygon(r, s.canvasX, s.canvasY, 5, c, o, i);

                      case 'hexagon':
                        return void this.drawPolygon(r, s.canvasX, s.canvasY, 6, c, o, i);

                      case 'polygon':
                      default:
                        return void this.drawPolygon(r, s.canvasX, s.canvasY, e, c, o, i);
                    }
                }
                if (d) {
                    let e = parseInt(a['node-count']);
                    isNaN(e) && (e = 3);
                    let t = Number(a.size);
                    isNaN(t) && (t = 1);
                    let c = t + 2, l = Number(a['inner-size']);
                    switch (isNaN(l) && (l = c - 3), n) {
                      case 'diamond':
                        return void this.drawStar(r, s.canvasX, s.canvasY, 2, c, .5 * c, o, i);

                      case 'trigram':
                        return void this.drawStar(r, s.canvasX, s.canvasY, 3, c, .4 * c, o, i);

                      case 'shuriken':
                        return void this.drawStar(r, s.canvasX, s.canvasY, 4, c, .65 * c, o, i);

                      case 'pentagram':
                        return void this.drawStar(r, s.canvasX, s.canvasY, 5, c, .75 * c, o, i);

                      case 'hexagram':
                        return void this.drawStar(r, s.canvasX, s.canvasY, 6, c, .75 * c, o, i);

                      case 'star':
                      default:
                        return void this.drawStar(r, s.canvasX, s.canvasY, e, c, l, o, i);
                    }
                }
            }
        }
    }
    drawCircle(e, t, s, a, r, i) {
        e.beginPath(), e.arc(t, s, a * r, 0, 2 * Math.PI, !1), e.closePath(), i && e.stroke(), 
        e.fill();
    }
    drawPolygon(e, t, s, a, r, i, o) {
        if (!(a < 3)) {
            var n = [], c = 360 / a, l = 270;
            for (let e = 0; e < a; e++) {
                var d = l * degreesToRadians;
                n.push({
                    x: Math.cos(d) * r * i,
                    y: Math.sin(d) * r * i
                }), l += c;
            }
            e.beginPath(), e.moveTo(t + n[0].x, s + n[0].y);
            for (let r = 1; r < a; r++) e.lineTo(t + n[r].x, s + n[r].y);
            e.closePath(), o && e.stroke(), e.fill();
        }
    }
    drawStar(e, t, s, a, r, i, o, n) {
        if (!(a < 2)) {
            var c = 2 * a, l = [], d = 360 / c, h = 270;
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
            e.beginPath(), e.moveTo(t + l[0].x, s + l[0].y);
            for (let a = 1; a < c; a++) e.lineTo(t + l[a].x, s + l[a].y);
            e.closePath(), n && e.stroke(), e.fill();
        }
    }
    isPointerAtPoint(e, t) {
        if (0 == this.discretePoint.visible) return !1;
        var s = this.discretePoint.canvasX, a = this.discretePoint.canvasY;
        return e - this.mouseEpsilon < s && s < e + this.mouseEpsilon && t - this.mouseEpsilon < a && a < t + this.mouseEpsilon;
    }
}