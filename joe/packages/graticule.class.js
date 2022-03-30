/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BasePackage from './base-package.class.js';

import LineFeature from '../features/line-feature.class.js';

import ProjectedPoint from '../projection/projected-point.class.js';

import expect from '../dev/expect.js';

export default class Graticule extends BasePackage {
    constructor(e, r, t, a) {
        if (super(e), r = Number(r), t = Number(t), this.parallelFrequency = Number.isNaN(r) ? 'none' : r, 
        this.meridianFrequency = Number.isNaN(t) ? 'none' : t, this.drawToPoles = void 0 !== a && a, 
        this.parallels = [], this.meridians = [], 'none' != this.parallelFrequency && (this.parallelFrequency <= 0 || this.parallelFrequency > 30) && (this.parallelFrequency = 10), 
        'none' != this.meridianFrequency && (this.meridianFrequency <= 0 || this.meridianFrequency > 30) && (this.meridianFrequency = 10), 
        'none' != this.parallelFrequency) for (var s = -90 + this.parallelFrequency; s < 90; s += this.parallelFrequency) {
            (n = new LineFeature).featureName = 'Parallel ' + s;
            for (var i = -180; i <= 180; i++) n.addPoint(new ProjectedPoint(s, i));
            this.parallels.push(n);
        }
        if ('none' != this.meridianFrequency) for (i = -180; i < 180; i += this.meridianFrequency) {
            var n;
            if ((n = new LineFeature).featureName = 'Meridian ' + i, 1 == this.drawToPoles) for (s = -90; s <= 90; s++) n.addPoint(new ProjectedPoint(s, i)); else for (s = -90 + t; s < 90; s++) n.addPoint(new ProjectedPoint(s, i));
            this.meridians.push(n);
        }
        this.packagePointsNeedGeoCoords = !0, this.packagePointsNeedProjection = !0, this.packagePointsNeedTransformation = !0, 
        this.packagePointsNeedPlacement = !0, this.rwtOrthographicEarth.broadcastMessage('package/graticule', null), 
        Object.seal(this);
    }
    recomputeStyles(e, r, t, a) {
        expect(e, 'RenderClock'), expect(r, 'vssStyleSheet'), expect(t, 'Layer'), expect(a, 'Number'), 
        super.recomputeStyles(e, r, t, (() => {
            for (var s = 0; s < this.parallels.length; s++) this.parallels[s].computeFeatureStyle(e, r, t.vssClassname, t.vssIdentifier, s, a);
            for (s = 0; s < this.meridians.length; s++) this.meridians[s].computeFeatureStyle(e, r, t.vssClassname, t.vssIdentifier, s, a);
        }));
    }
    runCourtesyValidator(e, r, t) {
        expect(e, 'vssStyleSheet'), expect(r, 'Layer'), expect(t, 'Number'), super.runCourtesyValidator((() => {
            for (var a = 0; a < this.parallels.length; a++) this.parallels[a].runCourtesyValidator(e, r.vssClassname, r.vssIdentifier, a, t);
            for (a = 0; a < this.meridians.length; a++) this.meridians[a].runCourtesyValidator(e, r.vssClassname, r.vssIdentifier, a, t);
        }));
    }
    rotation(e, r) {
        expect(e, 'RenderClock'), expect(r, 'GeocentricCoordinates'), super.rotation(e, r, (() => {
            for (var t = 0; t < this.parallels.length; t++) this.parallels[t].toGeoCoords(e, r);
            for (t = 0; t < this.meridians.length; t++) this.meridians[t].toGeoCoords(e, r);
        }));
    }
    projection(e, r) {
        expect(e, 'RenderClock'), expect(r, 'OrthographicProjection'), super.projection(e, r, (() => {
            for (var t = 0; t < this.parallels.length; t++) this.parallels[t].toPlane(e, r);
            for (t = 0; t < this.meridians.length; t++) this.meridians[t].toPlane(e, r);
        }));
    }
    transformation(e, r) {
        expect(e, 'RenderClock'), expect(r, 'CartesianTransformation'), super.transformation(e, r, (() => {
            for (var t = 0; t < this.parallels.length; t++) this.parallels[t].toPixels(e, r);
            for (t = 0; t < this.meridians.length; t++) this.meridians[t].toPixels(e, r);
        }));
    }
    placement(e, r) {
        expect(e, 'RenderClock'), expect(r, 'Viewport'), super.placement(e, r, (() => {
            for (var t = 0; t < this.parallels.length; t++) this.parallels[t].toViewportCanvas(e, r);
            for (t = 0; t < this.meridians.length; t++) this.meridians[t].toViewportCanvas(e, r);
        }));
    }
    drawLayer(e, r, t) {
        expect(e, 'RenderClock'), expect(r, 'Earth'), expect(t, 'Number'), super.drawLayer(e, (() => {
            for (var a = 0; a < this.parallels.length; a++) this.parallels[a].drawFeature(e, r, t);
            for (a = 0; a < this.meridians.length; a++) this.meridians[a].drawFeature(e, r, t);
        }));
    }
}