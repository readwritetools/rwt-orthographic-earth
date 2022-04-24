/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BasePackage from './base-package.class.js';

import LineFeature from '../features/line-feature.class.js';

import ProjectedPoint from '../projection/projected-point.class.js';

import expect from '../dev/expect.js';

export default class NamedMeridians extends BasePackage {
    constructor(e, t, r) {
        for (var s in super(e), this.meridians = [], this.frequency = void 0 !== r ? r : 1, 
        this.frequency <= 0 && (this.frequency = 1), this.frequency > 30 && (this.frequency = 30), 
        t) if (t.hasOwnProperty(s)) {
            var i = new LineFeature;
            i.featureName = s;
            var a = t[s];
            if (a < -180 || a > 180) continue;
            for (var o = -90; o <= 90; o += this.frequency) i.addPoint(new ProjectedPoint(o, a));
            this.meridians.push(i);
        }
        this.packagePointsNeedGeoCoords = !0, this.packagePointsNeedProjection = !0, this.packagePointsNeedTransformation = !0, 
        this.packagePointsNeedPlacement = !0, this.rwtOrthographicEarth.broadcastMessage('package/named-meridians', null), 
        Object.seal(this);
    }
    recomputeStyles(e, t, r, s) {
        expect(e, 'RenderClock'), expect(t, 'vssStyleSheet'), expect(r, 'Layer'), expect(s, 'Number'), 
        super.recomputeStyles(e, t, r, (() => {
            for (var i = 0; i < this.meridians.length; i++) this.meridians[i].computeFeatureStyle(e, t, r.vssClassname, r.vssIdentifier, i, s);
        }));
    }
    runCourtesyValidator(e, t, r) {
        expect(e, 'vssStyleSheet'), expect(t, 'Layer'), expect(r, 'Number'), super.runCourtesyValidator((() => {
            for (var s = 0; s < this.meridians.length; s++) this.meridians[s].runCourtesyValidator(e, t.vssClassname, t.vssIdentifier, s, r);
        }));
    }
    rotation(e, t) {
        expect(e, 'RenderClock'), expect(t, 'GeocentricCoordinates'), super.rotation(e, t, (() => {
            for (var r = 0; r < this.meridians.length; r++) this.meridians[r].toGeoCoords(e, t);
        }));
    }
    projection(e, t) {
        expect(e, 'RenderClock'), expect(t, 'OrthographicProjection'), super.projection(e, t, (() => {
            for (var r = 0; r < this.meridians.length; r++) this.meridians[r].toPlane(e, t);
        }));
    }
    transformation(e, t) {
        expect(e, 'RenderClock'), expect(t, 'CartesianTransformation'), super.transformation(e, t, (() => {
            for (var r = 0; r < this.meridians.length; r++) this.meridians[r].toPixels(e, t);
        }));
    }
    placement(e, t) {
        expect(e, 'RenderClock'), expect(t, 'Viewport'), super.placement(e, t, (() => {
            for (var r = 0; r < this.meridians.length; r++) this.meridians[r].toViewportCanvas(e, t);
        }));
    }
    drawLayer(e, t, r) {
        expect(e, 'RenderClock'), expect(t, 'Earth'), expect(r, 'Number'), super.drawLayer(e, (() => {
            for (var s = 0; s < this.meridians.length; s++) this.meridians[s].drawFeature(e, t, r);
        }));
    }
}