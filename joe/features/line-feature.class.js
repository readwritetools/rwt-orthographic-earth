/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
/* Copyright (c) 2021 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BaseFeature from './base-feature.class.js';

export default class LineFeature extends BaseFeature {
    constructor() {
        super(), this.lineSegment = [];
    }
    get featureType() {
        return 'boundary';
    }
    addPoint(e) {
        this.lineSegment.push(e);
    }
    computeStyle(e, t, a, s) {
        this.canvasParams = e.computeStyle('line', t, a, this.featureName, this.kvPairs, s);
    }
    toGeoCoords(e) {
        for (var t = 0; t < this.lineSegment.length; t++) e.toGeoCoords(this.lineSegment[t]);
    }
    toPlane(e) {
        for (var t = 0; t < this.lineSegment.length; t++) e.toPlane(this.lineSegment[t]);
    }
    toPixels(e) {
        for (var t = 0; t < this.lineSegment.length; t++) e.toPixels(this.lineSegment[t], !0, !0, !0);
    }
    toCanvas(e) {
        for (var t = 0; t < this.lineSegment.length; t++) e.toCanvas(this.lineSegment[t]);
    }
    render(e) {
        if (void 0 != this.canvasParams && 'hidden' != this.canvasParams.visibility) {
            var t = e.canvas.getContext('2d');
            t.strokeStyle = this.canvasParams['stroke-color'], t.lineWidth = this.canvasParams['stroke-width'], 
            this.renderArc(t);
        }
    }
    renderArc(e) {
        var t = !1, a = !1;
        e.beginPath();
        for (var s = 0; s < this.lineSegment.length; s++) {
            var n = this.lineSegment[s];
            1 == (a = n.visible) && 0 == t ? e.moveTo(n.canvasX, n.canvasY) : 1 == a && 1 == t && e.lineTo(n.canvasX, n.canvasY), 
            t = n.visible;
        }
        e.stroke();
    }
    isPointerOnLine(e, t) {
        if (this.lineSegment.length <= 1) return !1;
        for (var a = void 0 != this.canvasParams && this.canvasParams.hasOwnProperty('stroke-width') ? this.canvasParams['stroke-width'] : 1, s = this.lineSegment[0], n = 1; n < this.lineSegment.length; n++) {
            var i = this.lineSegment[n];
            if (s.visible && i.visible && s.canvasX - a <= e && e <= i.canvasX + a && s.canvasY - a <= t && t <= i.canvasY + a) return !0;
            s = i;
        }
        return !1;
    }
};