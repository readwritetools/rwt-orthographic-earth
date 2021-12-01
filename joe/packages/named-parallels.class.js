/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
/* Copyright (c) 2021 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BasePackage from './base-package.class.js';

import LineFeature from '../features/line-feature.class.js';

import ProjectedPoint from '../projection/projected-point.class.js';

export default class NamedParallels extends BasePackage {
    constructor(e, a, t, s, r, i) {
        for (var o in super(e, a, t, s), this.parallels = [], this.frequency = void 0 !== i ? i : 1, 
        this.frequency <= 0 && (this.frequency = 1), this.frequency > 15 && (this.frequency = 15), 
        r) if (r.hasOwnProperty(o)) {
            var l = new LineFeature;
            l.featureName = o;
            var n = r[o];
            if (n < -90 || n > 90) continue;
            for (var c = -180; c <= 180; c += this.frequency) l.addPoint(new ProjectedPoint(n, c));
            this.parallels.push(l);
        }
        this.packageNeedsRestyling = !0, this.packagePointsNeedGeoCoords = !0, this.packagePointsNeedProjection = !0, 
        this.packagePointsNeedTransformation = !0, this.packagePointsNeedPlacement = !0, 
        this.rwtOrthographicEarth.broadcastMessage('package/namedParallels', null);
    }
    recomputeStyles(e) {
        for (var a = 0; a < this.parallels.length; a++) this.parallels[a].computeStyle(e, this.classname, this.identifier, a);
        this.packageNeedsRestyling = !1;
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
    render(e) {
        for (var a = 0; a < this.parallels.length; a++) this.parallels[a].render(e);
    }
}