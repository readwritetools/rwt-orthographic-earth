/* Copyright (c) 2021 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BasePackage from './base-package.class.js';

import LineFeature from '../features/line-feature.class.js';

import ProjectedPoint from '../projection/projected-point.class.js';

export default class NamedMeridians extends BasePackage {
    constructor(e, i, t, s, a, r) {
        for (var n in super(e, i, t, s), this.meridians = [], this.frequency = void 0 !== r ? r : 1, 
        this.frequency <= 0 && (this.frequency = 1), this.frequency > 30 && (this.frequency = 30), 
        a) if (a.hasOwnProperty(n)) {
            var o = new LineFeature;
            o.featureName = n;
            var c = a[n];
            if (c < -180 || c > 180) continue;
            for (var h = -90; h <= 90; h += this.frequency) o.addPoint(new ProjectedPoint(h, c));
            this.meridians.push(o);
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