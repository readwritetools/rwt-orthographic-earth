/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BasePackage from './base-package.class.js';

import LineFeature from '../features/line-feature.class.js';

import ProjectedPoint from '../projection/projected-point.class.js';

import expect from '../joezone/expect.js';

export default class NamedMeridians extends BasePackage {
    constructor(e, t, s) {
        for (var i in super(e), this.meridians = [], this.frequency = void 0 !== s ? s : 1, 
        this.frequency <= 0 && (this.frequency = 1), this.frequency > 30 && (this.frequency = 30), 
        t) if (t.hasOwnProperty(i)) {
            var a = new LineFeature;
            a.featureName = i;
            var r = t[i];
            if (r < -180 || r > 180) continue;
            for (var n = -90; n <= 90; n += this.frequency) a.addPoint(new ProjectedPoint(n, r));
            this.meridians.push(a);
        }
        this.packagePointsNeedGeoCoords = !0, this.packagePointsNeedProjection = !0, this.packagePointsNeedTransformation = !0, 
        this.packagePointsNeedPlacement = !0, this.rwtOrthographicEarth.broadcastMessage('package/NamedMeridians', null), 
        Object.seal(this);
    }
    recomputeStyles(e, t, s) {
        expect(e, 'vssStyleSheet'), expect(t, 'Layer'), expect(s, 'Number');
        for (var i = 0; i < this.meridians.length; i++) this.meridians[i].computeFeatureStyle(e, t.vssClassname, t.vssIdentifier, i, s);
        t.layerNeedsRestyling = !1;
    }
    runCourtesyValidator(e, t, s) {
        expect(e, 'vssStyleSheet'), expect(t, 'Layer'), expect(s, 'Number');
        for (var i = 0; i < this.meridians.length; i++) this.meridians[i].runCourtesyValidator(e, t.vssClassname, t.vssIdentifier, i, s);
    }
    rotation(e) {
        for (var t = 0; t < this.meridians.length; t++) this.meridians[t].toGeoCoords(e);
        this.packagePointsNeedGeoCoords = !1, this.packagePointsNeedProjection = !0;
    }
    projection(e) {
        for (var t = 0; t < this.meridians.length; t++) this.meridians[t].toPlane(e);
        this.packagePointsNeedProjection = !1, this.packagePointsNeedTransformation = !0;
    }
    transformation(e) {
        for (var t = 0; t < this.meridians.length; t++) this.meridians[t].toPixels(e);
        this.packagePointsNeedTransformation = !1, this.packagePointsNeedPlacement = !0;
    }
    placement(e) {
        for (var t = 0; t < this.meridians.length; t++) this.meridians[t].toCanvas(e);
        this.packagePointsNeedPlacement = !1;
    }
    renderLayer(e, t) {
        expect(e, 'Earth'), expect(t, 'Number');
        for (var s = 0; s < this.meridians.length; s++) this.meridians[s].renderFeature(e, t);
    }
}