/* Copyright (c) 2021 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BaseFeature from './base-feature.class.js';

import ProjectedPoint from '../projection/projected-point.class.js';

export default class PointFeature extends BaseFeature {
    constructor() {
        super(), this.discretePoint = new ProjectedPoint(0, 0);
    }
    get featureType() {
        return 'place';
    }
    computeStyle(t, s, a, e) {
        this.canvasParams = t.computeStyle('point', s, a, this.featureName, this.kvPairs, e);
    }
    toGeoCoords(t) {
        t.toGeoCoords(this.discretePoint);
    }
    toPlane(t) {
        t.toPlane(this.discretePoint);
    }
    toPixels(t) {
        t.toPixels(this.discretePoint, !0, !0, !0);
    }
    toCanvas(t) {
        t.toCanvas(this.discretePoint);
    }
    render(t) {
        if (void 0 != this.canvasParams && 'hidden' != this.canvasParams.visibility) {
            var s = t.canvas.getContext('2d');
            s.fillStyle = this.canvasParams['fill-color'], s.strokeStyle = this.canvasParams['stroke-color'];
            var a = this.canvasParams['dot-radius'];
            'none' == this.canvasParams['stroke-width'] ? s.lineWidth = 0 : s.lineWidth = this.canvasParams['stroke-width'];
            var e = this.discretePoint;
            1 == e.visible && this.drawDot(s, e.canvasX, e.canvasY, a, this.canvasParams['stroke-width']);
        }
    }
    drawDot(t, s, a, e, i) {
        t.beginPath(), t.arc(s, a, e, 0, 2 * Math.PI, !1), t.closePath(), 'none' != i && i > 0 && t.stroke(), 
        t.fill();
    }
    isPointerAtPoint(t, s) {
        if (0 == this.discretePoint.visible) return !1;
        var a = void 0 != this.canvasParams && this.canvasParams.hasOwnProperty('dot-radius') ? this.canvasParams['dot-radius'] : 1, e = this.discretePoint.canvasX, i = this.discretePoint.canvasY;
        return t - a < e && e < t + a && s - a < i && i < s + a;
    }
};