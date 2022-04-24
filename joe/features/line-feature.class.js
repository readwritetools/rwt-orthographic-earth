/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BaseFeature from './base-feature.class.js';

import * as st from '../spherical-earth/spherical-trigonometry.js';

import RS from '../enum/rendering-state.enum.js';

import expect from '../dev/expect.js';

export default class LineFeature extends BaseFeature {
    constructor() {
        super(), this.lineSegment = [], this.mouseEpsilon = 1;
    }
    get featureType() {
        return 'boundary';
    }
    addPoint(e) {
        expect(e, 'ProjectedPoint'), this.lineSegment.push(e);
    }
    computeFeatureStyle(e, t, s, a, i, n) {
        if (expect(e, 'RenderClock'), expect(t, 'vssStyleSheet'), expect(s, 'String'), expect(a, 'String'), 
        expect(i, 'Number'), expect(n, 'Number'), 0 == this.featureIsOnNearSide(e.renderingState)) return;
        if (0 == this.featureIsOnCanvas(e.renderingState)) return;
        let r = t.computeStyle('line', s, a, this.isSelected, this.featureName, this.kvPairs, i);
        expect(r, 'vssCanvasParameters'), this.canvasParams.set(n, r);
        let o = Number(r['stroke-width']);
        isNaN(o) || (this.mouseEpsilon = Math.max(this.mouseEpsilon, o));
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
    toGeoCoords(e, t) {
        for (var s = 0; s < this.lineSegment.length; s++) t.toPhiLambda(this.lineSegment[s]);
    }
    toPlane(e, t) {
        expect(e, 'RenderClock'), expect(t, 'OrthographicProjection'), this.pointsOnNearSide = 0, 
        this.pointsOnFarSide = 0;
        for (var s = 0; s < this.lineSegment.length; s++) {
            let a = this.lineSegment[s];
            if (t.toEastingNorthing(a), a.isOnNearSide) this.pointsOnNearSide++; else if (this.pointsOnFarSide++, 
            e.renderingState == RS.SKETCHING) return;
        }
    }
    toPixels(e, t) {
        if (expect(e, 'RenderClock'), expect(t, 'CartesianTransformation'), 0 != this.featureIsOnNearSide(e.renderingState)) for (var s = 0; s < this.lineSegment.length; s++) t.toEarthXY(this.lineSegment[s], !0, !0, !0);
    }
    toViewportCanvas(e, t) {
        if (expect(e, 'RenderClock'), expect(t, 'Viewport'), 0 != this.featureIsOnNearSide(e.renderingState)) {
            this.pointsOnCanvas = 0, this.pointsOffCanvas = 0;
            for (var s = 0; s < this.lineSegment.length; s++) {
                let e = this.lineSegment[s];
                t.toCanvasXY(e), e.isOnNearSide && (e.isOnCanvas ? this.pointsOnCanvas++ : this.pointsOffCanvas++);
            }
        }
    }
    drawFeature(e, t, s) {
        if (expect(e, 'RenderClock'), expect(t, 'Earth'), expect(s, 'Number'), 0 == this.featureIsOnNearSide(e.renderingState)) return;
        if (0 == this.featureIsOnCanvas(e.renderingState)) return;
        let a = this.canvasParams.get(s);
        if (0 != this.hasSomethingToDraw(a) && null != a['stroke-width'] && 'none' != a['stroke-width'] && 0 != a['stroke-width']) {
            var i = Number(a.scale);
            isNaN(i) && (i = 1);
            var n = t.canvas.getContext('2d');
            switch (n.lineWidth = Number(a['stroke-width']) * i, n.strokeStyle = a['stroke-color'], 
            a['stroke-type']) {
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
            this.drawArc(n), n.setLineDash([]);
        }
    }
    drawArc(e) {
        var t = !1, s = !1;
        e.beginPath();
        for (var a = 0; a < this.lineSegment.length; a++) {
            var i = this.lineSegment[a];
            1 == (s = i.isOnNearSide) && 0 == t ? e.moveTo(i.canvasX, i.canvasY) : 1 == s && 1 == t && e.lineTo(i.canvasX, i.canvasY), 
            t = i.isOnNearSide;
        }
        e.stroke();
    }
    isPointerOnLine(e, t) {
        if (this.lineSegment.length <= 1) return !1;
        let s = this.lineSegment[0];
        for (let a = 1; a < this.lineSegment.length; a++) {
            let i = this.lineSegment[a];
            if (s.isOnNearSide && i.isOnNearSide) {
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
    roughAndReadyPoint() {
        var e = this.lineSegment[0], t = Math.round(this.lineSegment.length / 2), s = this.lineSegment[t];
        return st.sphericalMidpoint(e.latitude, e.longitude, s.latitude, s.longitude);
    }
}