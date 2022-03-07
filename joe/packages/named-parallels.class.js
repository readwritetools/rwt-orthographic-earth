/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BasePackage from './base-package.class.js';

import LineFeature from '../features/line-feature.class.js';

import ProjectedPoint from '../projection/projected-point.class.js';

import expect from 'softlib/expect.js';

export default class NamedParallels extends BasePackage {
    constructor(e, a, t) {
        for (var s in super(e), this.parallels = [], this.frequency = void 0 !== t ? t : 1, 
        this.frequency <= 0 && (this.frequency = 1), this.frequency > 15 && (this.frequency = 15), 
        a) if (a.hasOwnProperty(s)) {
            var r = new LineFeature;
            r.featureName = s;
            var l = a[s];
            if (l < -90 || l > 90) continue;
            for (var o = -180; o <= 180; o += this.frequency) r.addPoint(new ProjectedPoint(l, o));
            this.parallels.push(r);
        }
        this.packagePointsNeedGeoCoords = !0, this.packagePointsNeedProjection = !0, this.packagePointsNeedTransformation = !0, 
        this.packagePointsNeedPlacement = !0, this.rwtOrthographicEarth.broadcastMessage('package/namedParallels', null), 
        Object.seal(this);
    }
    recomputeStyles(e, a, t) {
        expect(e, 'vssStyleSheet'), expect(a, 'Layer'), expect(t, 'Number');
        for (var s = 0; s < this.parallels.length; s++) this.parallels[s].computeFeatureStyle(e, a.vssClassname, a.vssIdentifier, s, t);
        a.layerNeedsRestyling = !1;
    }
    runCourtesyValidator(e, a, t) {
        expect(e, 'vssStyleSheet'), expect(a, 'Layer'), expect(t, 'Number');
        for (var s = 0; s < this.parallels.length; s++) this.parallels[s].runCourtesyValidator(e, a.vssClassname, a.vssIdentifier, s, t);
    }
    rotation(e) {
        for (var a = 0; a < this.parallels.length; a++) this.parallels[a].toGeoCoords(e);
        this.packagePointsNeedGeoCoords = !1, this.packagePointsNeedProjection = !0;
    }
    projection(e) {
        for (var a = 0; a < this.parallels.length; a++) this.parallels[a].toPlane(e);
        this.packagePointsNeedProjection = !1, this.packagePointsNeedTransformation = !0;
    }
    transformation(e) {
        for (var a = 0; a < this.parallels.length; a++) this.parallels[a].toPixels(e);
        this.packagePointsNeedTransformation = !1, this.packagePointsNeedPlacement = !0;
    }
    placement(e) {
        for (var a = 0; a < this.parallels.length; a++) this.parallels[a].toCanvas(e);
        this.packagePointsNeedPlacement = !1;
    }
    renderLayer(e, a) {
        expect(e, 'Earth'), expect(a, 'Number');
        for (var t = 0; t < this.parallels.length; t++) this.parallels[t].renderFeature(e, a);
    }
}