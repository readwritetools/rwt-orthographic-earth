/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BasePackage from './base-package.class.js';

import LineFeature from '../features/line-feature.class.js';

import ProjectedPoint from '../projection/projected-point.class.js';

import expect from 'softlib/expect.js';

export default class Graticule extends BasePackage {
    constructor(e, a, t, s) {
        if (super(e), a = Number(a), t = Number(t), this.parallelFrequency = Number.isNaN(a) ? 'none' : a, 
        this.meridianFrequency = Number.isNaN(t) ? 'none' : t, this.drawToPoles = void 0 !== s && s, 
        this.parallels = [], this.meridians = [], 'none' != this.parallelFrequency && (this.parallelFrequency <= 0 || this.parallelFrequency > 30) && (this.parallelFrequency = 10), 
        'none' != this.meridianFrequency && (this.meridianFrequency <= 0 || this.meridianFrequency > 30) && (this.meridianFrequency = 10), 
        'none' != this.parallelFrequency) for (var r = -90 + this.parallelFrequency; r < 90; r += this.parallelFrequency) {
            (n = new LineFeature).featureName = 'Parallel ' + r;
            for (var i = -180; i <= 180; i++) n.addPoint(new ProjectedPoint(r, i));
            this.parallels.push(n);
        }
        if ('none' != this.meridianFrequency) for (i = -180; i <= 180; i += this.meridianFrequency) {
            var n;
            if ((n = new LineFeature).featureName = 'Meridian ' + i, 1 == this.drawToPoles) for (r = -90; r <= 90; r++) n.addPoint(new ProjectedPoint(r, i)); else for (r = -90 + t; r < 90; r++) n.addPoint(new ProjectedPoint(r, i));
            this.meridians.push(n);
        }
        this.packagePointsNeedGeoCoords = !0, this.packagePointsNeedProjection = !0, this.packagePointsNeedTransformation = !0, 
        this.packagePointsNeedPlacement = !0, this.rwtOrthographicEarth.broadcastMessage('package/graticule', null), 
        Object.seal(this);
    }
    recomputeStyles(e, a, t) {
        expect(e, 'vssStyleSheet'), expect(a, 'Layer'), expect(t, 'Number');
        for (var s = 0; s < this.parallels.length; s++) this.parallels[s].computeFeatureStyle(e, a.vssClassname, a.vssIdentifier, s, t);
        for (s = 0; s < this.meridians.length; s++) this.meridians[s].computeFeatureStyle(e, a.vssClassname, a.vssIdentifier, s, t);
        a.layerNeedsRestyling = !1;
    }
    runCourtesyValidator(e, a, t) {
        expect(e, 'vssStyleSheet'), expect(a, 'Layer'), expect(t, 'Number');
        for (var s = 0; s < this.parallels.length; s++) this.parallels[s].runCourtesyValidator(e, a.vssClassname, a.vssIdentifier, s, t);
        for (s = 0; s < this.meridians.length; s++) this.meridians[s].runCourtesyValidator(e, a.vssClassname, a.vssIdentifier, s, t);
    }
    rotation(e) {
        for (var a = 0; a < this.parallels.length; a++) this.parallels[a].toGeoCoords(e);
        for (a = 0; a < this.meridians.length; a++) this.meridians[a].toGeoCoords(e);
        this.packagePointsNeedGeoCoords = !1, this.packagePointsNeedProjection = !0;
    }
    projection(e) {
        for (var a = 0; a < this.parallels.length; a++) this.parallels[a].toPlane(e);
        for (a = 0; a < this.meridians.length; a++) this.meridians[a].toPlane(e);
        this.packagePointsNeedProjection = !1, this.packagePointsNeedTransformation = !0;
    }
    transformation(e) {
        for (var a = 0; a < this.parallels.length; a++) this.parallels[a].toPixels(e);
        for (a = 0; a < this.meridians.length; a++) this.meridians[a].toPixels(e);
        this.packagePointsNeedTransformation = !1, this.packagePointsNeedPlacement = !0;
    }
    placement(e) {
        for (var a = 0; a < this.parallels.length; a++) this.parallels[a].toCanvas(e);
        for (a = 0; a < this.meridians.length; a++) this.meridians[a].toCanvas(e);
        this.packagePointsNeedPlacement = !1;
    }
    renderLayer(e, a) {
        expect(e, 'Earth'), expect(a, 'Number');
        for (var t = 0; t < this.parallels.length; t++) this.parallels[t].renderFeature(e, a);
        for (t = 0; t < this.meridians.length; t++) this.meridians[t].renderFeature(e, a);
    }
}