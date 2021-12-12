/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BasePackage from './base-package.class.js';

import LineFeature from '../features/line-feature.class.js';

import ProjectedPoint from '../projection/projected-point.class.js';

export default class NamedParallels extends BasePackage {
    constructor(e, a, t, s, r, i, o) {
        for (var l in super(e, a, t, s, r), this.parallels = [], this.frequency = void 0 !== o ? o : 1, 
        this.frequency <= 0 && (this.frequency = 1), this.frequency > 15 && (this.frequency = 15), 
        i) if (i.hasOwnProperty(l)) {
            var n = new LineFeature;
            n.featureName = l;
            var c = i[l];
            if (c < -90 || c > 90) continue;
            for (var h = -180; h <= 180; h += this.frequency) n.addPoint(new ProjectedPoint(c, h));
            this.parallels.push(n);
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