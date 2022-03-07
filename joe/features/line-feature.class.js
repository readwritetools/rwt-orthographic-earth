/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BaseFeature from './base-feature.class.js';

import expect from 'softlib/expect.js';

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
    computeFeatureStyle(e, t, s, a, i) {
        expect(e, 'vssStyleSheet'), expect(t, 'String'), expect(s, 'String'), expect(a, 'Number'), 
        expect(i, 'Number');
        let n = e.computeStyle('line', t, s, this.featureName, this.kvPairs, a);
        expect(n, 'vssCanvasParameters'), this.canvasParams.set(i, n);
        let r = Number(n['stroke-width']);
        isNaN(r) || (this.mouseEpsilon = Math.max(this.mouseEpsilon, r));
    }
    runCourtesyValidator(e, t, s, a, i) {
        e.runCourtesyValidator('line', t, s, this.featureName, this.kvPairs, a);
    }
    static courtesyValidator(e) {
        switch (e) {
          case 'visibility':
          case 'scale':
          case 'stroke-width':
          case 'stroke-color':
          case 'stroke-type':
            return !0;

          default:
            return !1;
        }
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
        if (expect(s, 'vssCanvasParameters'), 'hidden' != s.visibility && null != s['stroke-width'] && 'none' != s['stroke-width']) {
            var a = Number(s.scale);
            isNaN(a) && (a = 1);
            var i = e.canvas.getContext('2d');
            switch (i.lineWidth = Number(s['stroke-width']) * a, i.strokeStyle = s['stroke-color'], 
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
            this.renderArc(i), i.setLineDash([]);
        }
    }
    renderArc(e) {
        var t = !1, s = !1;
        e.beginPath();
        for (var a = 0; a < this.lineSegment.length; a++) {
            var i = this.lineSegment[a];
            1 == (s = i.visible) && 0 == t ? e.moveTo(i.canvasX, i.canvasY) : 1 == s && 1 == t && e.lineTo(i.canvasX, i.canvasY), 
            t = i.visible;
        }
        e.stroke();
    }
    isPointerOnLine(e, t) {
        if (this.lineSegment.length <= 1) return !1;
        let s = this.lineSegment[0];
        for (let a = 1; a < this.lineSegment.length; a++) {
            let i = this.lineSegment[a];
            if (s.visible && i.visible) {
                let a = this.distance(s.canvasX, s.canvasY, i.canvasX, i.canvasY), n = this.distance(s.canvasX, s.canvasY, e, t), r = this.distance(i.canvasX, i.canvasY, e, t);
                if (Math.abs(a - (n + r)) < this.mouseEpsilon) return !0;
            }
            s = i;
        }
        return !1;
    }
    distance(e, t, s, a) {
        return Math.sqrt(Math.pow(e - s, 2) + Math.pow(t - a, 2));
    }
}