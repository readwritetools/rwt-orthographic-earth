/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BasePackage from './base-package.class.js';

import LineFeature from '../features/line-feature.class.js';

import ProjectedPoint from '../projection/projected-point.class.js';

import expect from '../dev/expect.js';

export default class NamedParallels extends BasePackage {
    constructor(e, t, r) {
        for (var a in super(e), this.parallels = [], this.frequency = void 0 !== r ? r : 1, 
        this.frequency <= 0 && (this.frequency = 1), this.frequency > 15 && (this.frequency = 15), 
        t) if (t.hasOwnProperty(a)) {
            var s = new LineFeature;
            s.featureName = a;
            var l = t[a];
            if (l < -90 || l > 90) continue;
            for (var o = -180; o <= 180; o += this.frequency) s.addPoint(new ProjectedPoint(l, o));
            this.parallels.push(s);
        }
        this.packagePointsNeedGeoCoords = !0, this.packagePointsNeedProjection = !0, this.packagePointsNeedTransformation = !0, 
        this.packagePointsNeedPlacement = !0, this.rwtOrthographicEarth.broadcastMessage('package/namedParallels', null), 
        Object.seal(this);
    }
    recomputeStyles(e, t, r, a) {
        expect(e, 'RenderClock'), expect(t, 'vssStyleSheet'), expect(r, 'Layer'), expect(a, 'Number'), 
        super.recomputeStyles(e, t, r, (() => {
            for (var s = 0; s < this.parallels.length; s++) this.parallels[s].computeFeatureStyle(e, t, r.vssClassname, r.vssIdentifier, s, a);
        }));
    }
    runCourtesyValidator(e, t, r) {
        expect(e, 'vssStyleSheet'), expect(t, 'Layer'), expect(r, 'Number'), super.runCourtesyValidator((() => {
            for (var a = 0; a < this.parallels.length; a++) this.parallels[a].runCourtesyValidator(e, t.vssClassname, t.vssIdentifier, a, r);
        }));
    }
    rotation(e, t) {
        expect(e, 'RenderClock'), expect(t, 'GeocentricCoordinates'), super.rotation(e, t, (() => {
            for (var r = 0; r < this.parallels.length; r++) this.parallels[r].toGeoCoords(e, t);
        }));
    }
    projection(e, t) {
        expect(e, 'RenderClock'), expect(t, 'OrthographicProjection'), super.projection(e, t, (() => {
            for (var r = 0; r < this.parallels.length; r++) this.parallels[r].toPlane(e, t);
        }));
    }
    transformation(e, t) {
        expect(e, 'RenderClock'), expect(t, 'CartesianTransformation'), super.transformation(e, t, (() => {
            for (var r = 0; r < this.parallels.length; r++) this.parallels[r].toPixels(e, t);
        }));
    }
    placement(e, t) {
        expect(e, 'RenderClock'), expect(t, 'Viewport'), super.placement(e, t, (() => {
            for (var r = 0; r < this.parallels.length; r++) this.parallels[r].toViewportCanvas(e, t);
        }));
    }
    drawLayer(e, t, r) {
        expect(e, 'RenderClock'), expect(t, 'Earth'), expect(r, 'Number'), super.drawLayer(e, (() => {
            for (var a = 0; a < this.parallels.length; a++) this.parallels[a].drawFeature(e, t, r);
        }));
    }
}