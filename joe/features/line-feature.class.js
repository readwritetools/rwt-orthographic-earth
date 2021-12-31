/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BaseFeature from './base-feature.class.js';

import expect from '../joezone/expect.js';

export default class LineFeature extends BaseFeature {
    constructor() {
        super(), this.lineSegment = [], this.mouseEpsilon = 1;
    }
    get featureType() {
        return 'boundary';
    }
    addPoint(e) {
        this.lineSegment.push(e);
    }
    computeFeatureStyle(e, t, s, a, n) {
        expect(e, 'vssStyleSheet'), expect(t, 'String'), expect(s, 'String'), expect(a, 'Number'), 
        expect(n, 'Number');
        let i = e.computeStyle('line', t, s, this.featureName, this.kvPairs, a);
        expect(i, 'vssCanvasParameters'), this.canvasParams.set(n, i);
        let r = Number(i['stroke-width']);
        isNaN(r) || (this.mouseEpsilon = Math.max(this.mouseEpsilon, r));
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
    renderFeature(e, t) {
        expect(e, 'Earth'), expect(t, 'Number');
        let s = this.canvasParams.get(t);
        if (expect(s, 'vssCanvasParameters'), 'hidden' != s.visibility) {
            var a = e.canvas.getContext('2d');
            switch (a.strokeStyle = s['stroke-color'], a.lineWidth = s['stroke-width'], s['stroke-type']) {
              case 'solid':
                a.setLineDash([]);
                break;

              case 'dotted':
                a.setLineDash([ 3, 3 ]);
                break;

              case 'short-dash':
                a.setLineDash([ 10, 10 ]);
                break;

              case 'long-dash':
                a.setLineDash([ 20, 5 ]);
                break;

              case 'dot-dash':
                a.setLineDash([ 15, 3, 3, 3 ]);
                break;

              case 'dot-dot-dash':
                a.setLineDash([ 15, 3, 3, 3, 3, 3 ]);
                break;

              case 'dot-dot-dot-dash':
                a.setLineDash([ 15, 3, 3, 3, 3, 3, 3, 3 ]);
                break;

              case 'dot-dash-dot':
                a.setLineDash([ 3, 3, 12, 3, 3, 12 ]);
                break;

              default:
                a.setLineDash([]);
            }
            this.renderArc(a);
        }
    }
    renderArc(e) {
        var t = !1, s = !1;
        e.beginPath();
        for (var a = 0; a < this.lineSegment.length; a++) {
            var n = this.lineSegment[a];
            1 == (s = n.visible) && 0 == t ? e.moveTo(n.canvasX, n.canvasY) : 1 == s && 1 == t && e.lineTo(n.canvasX, n.canvasY), 
            t = n.visible;
        }
        e.stroke();
    }
    isPointerOnLine(e, t) {
        if (this.lineSegment.length <= 1) return !1;
        let s = this.lineSegment[0];
        for (let a = 1; a < this.lineSegment.length; a++) {
            let n = this.lineSegment[a];
            if (s.visible && n.visible) {
                let a = this.distance(s.canvasX, s.canvasY, n.canvasX, n.canvasY), i = this.distance(s.canvasX, s.canvasY, e, t), r = this.distance(n.canvasX, n.canvasY, e, t);
                if (Math.abs(a - (i + r)) < this.mouseEpsilon) return !0;
            }
            s = n;
        }
        return !1;
    }
    distance(e, t, s, a) {
        return Math.sqrt(Math.pow(e - s, 2) + Math.pow(t - a, 2));
    }
}