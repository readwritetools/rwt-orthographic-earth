/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BasePackage from './base-package.class.js';

import PointFeature from '../features/point-feature.class.js';

import ProjectedPoint from '../projection/projected-point.class.js';

import expect from '../dev/expect.js';

export default class Crosshairs extends BasePackage {
    constructor(e, t, r) {
        super(e), this.parallelFrequency = Number(t), this.meridianFrequency = Number(r), 
        this.ticks = [], (Number.isNaN(this.parallelFrequency) || this.parallelFrequency <= 0 || this.parallelFrequency > 30) && (this.parallelFrequency = 10), 
        (Number.isNaN(this.meridianFrequency) || this.meridianFrequency <= 0 || this.meridianFrequency > 30) && (this.meridianFrequency = 10);
        for (let e = -90; e <= 90; e += this.parallelFrequency) for (let t = -180; t < 180; t += this.meridianFrequency) {
            var s = new PointFeature;
            s.setPoint(new ProjectedPoint(e, t)), s.kvPairs.latitude = e, s.kvPairs.longitude = t, 
            this.ticks.push(s);
        }
        this.packagePointsNeedGeoCoords = !0, this.packagePointsNeedProjection = !0, this.packagePointsNeedTransformation = !0, 
        this.packagePointsNeedPlacement = !0, this.rwtOrthographicEarth.broadcastMessage('package/crosshairs', null), 
        Object.seal(this);
    }
    recomputeStyles(e, t, r, s) {
        expect(e, 'RenderClock'), expect(t, 'vssStyleSheet'), expect(r, 'Layer'), expect(s, 'Number'), 
        super.recomputeStyles(e, t, r, (() => {
            for (var i = 0; i < this.ticks.length; i++) this.ticks[i].computeFeatureStyle(e, t, r.vssClassname, r.vssIdentifier, i, s);
        }));
    }
    runCourtesyValidator(e, t, r) {
        expect(e, 'vssStyleSheet'), expect(t, 'Layer'), expect(r, 'Number'), super.runCourtesyValidator((() => {
            for (var s = 0; s < this.ticks.length; s++) this.ticks[s].runCourtesyValidator(e, t.vssClassname, t.vssIdentifier, s, r);
        }));
    }
    rotation(e, t) {
        expect(e, 'RenderClock'), expect(t, 'GeocentricCoordinates'), super.rotation(e, t, (() => {
            for (var r = 0; r < this.ticks.length; r++) this.ticks[r].toGeoCoords(e, t);
        }));
    }
    projection(e, t) {
        expect(e, 'RenderClock'), expect(t, 'OrthographicProjection'), super.projection(e, t, (() => {
            for (var r = 0; r < this.ticks.length; r++) this.ticks[r].toPlane(e, t);
        }));
    }
    transformation(e, t) {
        expect(e, 'RenderClock'), expect(t, 'CartesianTransformation'), super.transformation(e, t, (() => {
            for (var r = 0; r < this.ticks.length; r++) this.ticks[r].toPixels(e, t);
        }));
    }
    placement(e, t) {
        expect(e, 'RenderClock'), expect(t, 'Viewport'), super.placement(e, t, (() => {
            for (var r = 0; r < this.ticks.length; r++) this.ticks[r].toViewportCanvas(e, t);
        }));
    }
    drawLayer(e, t, r) {
        expect(e, 'RenderClock'), expect(t, 'Earth'), expect(r, 'Number'), super.drawLayer(e, (() => {
            for (var s = 0; s < this.ticks.length; s++) this.ticks[s].drawFeature(e, t, r);
        }));
    }
}