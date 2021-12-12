/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BasePackage from './base-package.class.js';

import LineFeature from '../features/line-feature.class.js';

import ProjectedPoint from '../projection/projected-point.class.js';

export default class NamedMeridians extends BasePackage {
    constructor(e, i, t, s, a, r, n) {
        for (var o in super(e, i, t, s, a), this.meridians = [], this.frequency = void 0 !== n ? n : 1, 
        this.frequency <= 0 && (this.frequency = 1), this.frequency > 30 && (this.frequency = 30), 
        r) if (r.hasOwnProperty(o)) {
            var c = new LineFeature;
            c.featureName = o;
            var h = r[o];
            if (h < -180 || h > 180) continue;
            for (var d = -90; d <= 90; d += this.frequency) c.addPoint(new ProjectedPoint(d, h));
            this.meridians.push(c);
        }
        this.packageNeedsRestyling = !0, this.packagePointsNeedGeoCoords = !0, this.packagePointsNeedProjection = !0, 
        this.packagePointsNeedTransformation = !0, this.packagePointsNeedPlacement = !0, 
        this.rwtOrthographicEarth.broadcastMessage('package/NamedMeridians', null);
    }
    recomputeStyles(e) {
        for (var i = 0; i < this.meridians.length; i++) this.meridians[i].computeStyle(e, this.classname, this.identifier, i);
        this.packageNeedsRestyling = !1;
    }
    rotation(e) {
        for (var i = 0; i < this.meridians.length; i++) this.meridians[i].toGeoCoords(e);
        this.packagePointsNeedGeoCoords = !1, this.packagePointsNeedProjection = !0;
    }
    projection(e) {
        for (var i = 0; i < this.meridians.length; i++) this.meridians[i].toPlane(e);
        this.packagePointsNeedProjection = !1, this.packagePointsNeedTransformation = !0;
    }
    transformation(e) {
        for (var i = 0; i < this.meridians.length; i++) this.meridians[i].toPixels(e);
        this.packagePointsNeedTransformation = !1, this.packagePointsNeedPlacement = !0;
    }
    placement(e) {
        for (var i = 0; i < this.meridians.length; i++) this.meridians[i].toCanvas(e);
        this.packagePointsNeedPlacement = !1;
    }
    render(e) {
        for (var i = 0; i < this.meridians.length; i++) this.meridians[i].render(e);
    }
}