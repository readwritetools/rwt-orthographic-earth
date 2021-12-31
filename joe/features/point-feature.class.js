/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BaseFeature from './base-feature.class.js';

import ProjectedPoint from '../projection/projected-point.class.js';

import expect from '../joezone/expect.js';

export default class PointFeature extends BaseFeature {
    constructor() {
        super(), this.discretePoint = new ProjectedPoint(0, 0), this.mouseEpsilon = 2;
    }
    get featureType() {
        return 'place';
    }
    computeFeatureStyle(e, t, s, i, o) {
        expect(e, 'vssStyleSheet'), expect(t, 'String'), expect(s, 'String'), expect(i, 'Number'), 
        expect(o, 'Number');
        let r = e.computeStyle('point', t, s, this.featureName, this.kvPairs, i);
        expect(r, 'vssCanvasParameters'), this.canvasParams.set(o, r);
        let a = 0, n = Number(r['dot-radius']);
        isNaN(n) || (a += n);
        let c = Number(r['stroke-width']);
        isNaN(c) || (a += c), this.mouseEpsilon = Math.max(this.mouseEpsilon, a);
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
        let s = this.canvasParams.get(t);
        if (expect(s, 'vssCanvasParameters'), 'hidden' != s.visibility) {
            var i = e.canvas.getContext('2d');
            i.fillStyle = s['fill-color'], i.strokeStyle = s['stroke-color'];
            var o = s['dot-radius'];
            'none' == s['stroke-width'] ? i.lineWidth = 0 : i.lineWidth = s['stroke-width'];
            var r = this.discretePoint;
            1 == r.visible && this.drawDot(i, r.canvasX, r.canvasY, o, s['stroke-width']);
        }
    }
    drawDot(e, t, s, i, o) {
        e.beginPath(), e.arc(t, s, i, 0, 2 * Math.PI, !1), e.closePath(), 'none' != o && o > 0 && e.stroke(), 
        e.fill();
    }
    isPointerAtPoint(e, t) {
        if (0 == this.discretePoint.visible) return !1;
        var s = this.discretePoint.canvasX, i = this.discretePoint.canvasY;
        return e - this.mouseEpsilon < s && s < e + this.mouseEpsilon && t - this.mouseEpsilon < i && i < t + this.mouseEpsilon;
    }
}