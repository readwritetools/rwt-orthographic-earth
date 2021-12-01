/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
/* Copyright (c) 2021 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BasePackage from './base-package.class.js';

import LineFeature from '../features/line-feature.class.js';

import ProjectedPoint from '../projection/projected-point.class.js';

export default class Graticule extends BasePackage {
    constructor(e, a, i, t, s, r, n) {
        if (super(e, a, i, t), s = Number(s), r = Number(r), this.parallel_frequency = Number.isNaN(s) ? 'none' : s, 
        this.meridian_frequency = Number.isNaN(r) ? 'none' : r, this.draw_to_poles = void 0 !== n && n, 
        this.parallels = [], this.meridians = [], 'none' != this.parallel_frequency && (this.parallel_frequency <= 0 || this.parallel_frequency > 30) && (this.parallel_frequency = 10), 
        'none' != this.meridian_frequency && (this.meridian_frequency <= 0 || this.meridian_frequency > 30) && (this.meridian_frequency = 10), 
        'none' != this.parallel_frequency) for (var l = -90 + this.parallel_frequency; l < 90; l += this.parallel_frequency) {
            (h = new LineFeature).featureName = 'Parallel ' + l;
            for (var o = -180; o <= 180; o++) h.addPoint(new ProjectedPoint(l, o));
            this.parallels.push(h);
        }
        if ('none' != this.meridian_frequency) for (o = -180; o <= 180; o += this.meridian_frequency) {
            var h;
            if ((h = new LineFeature).featureName = 'Meridian ' + o, 1 == this.draw_to_poles) for (l = -90; l <= 90; l++) h.addPoint(new ProjectedPoint(l, o)); else for (l = -90 + r; l < 90; l++) h.addPoint(new ProjectedPoint(l, o));
            this.meridians.push(h);
        }
        this.packageNeedsRestyling = !0, this.packagePointsNeedGeoCoords = !0, this.packagePointsNeedProjection = !0, 
        this.packagePointsNeedTransformation = !0, this.packagePointsNeedPlacement = !0, 
        this.rwtOrthographicEarth.broadcastMessage('package/graticule', null);
    }
    recomputeStyles(e) {
        for (var a = 0; a < this.parallels.length; a++) this.parallels[a].computeStyle(e, this.classname, this.identifier, a);
        for (a = 0; a < this.meridians.length; a++) this.meridians[a].computeStyle(e, this.classname, this.identifier, a);
        this.packageNeedsRestyling = !1;
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
    render(e) {
        for (var a = 0; a < this.parallels.length; a++) this.parallels[a].render(e);
        for (a = 0; a < this.meridians.length; a++) this.meridians[a].render(e);
    }
}