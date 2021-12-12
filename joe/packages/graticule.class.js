/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BasePackage from './base-package.class.js';

import LineFeature from '../features/line-feature.class.js';

import ProjectedPoint from '../projection/projected-point.class.js';

export default class Graticule extends BasePackage {
    constructor(e, a, i, t, s, r, n, l) {
        if (super(e, a, i, t, s), r = Number(r), n = Number(n), this.parallel_frequency = Number.isNaN(r) ? 'none' : r, 
        this.meridian_frequency = Number.isNaN(n) ? 'none' : n, this.draw_to_poles = void 0 !== l && l, 
        this.parallels = [], this.meridians = [], 'none' != this.parallel_frequency && (this.parallel_frequency <= 0 || this.parallel_frequency > 30) && (this.parallel_frequency = 10), 
        'none' != this.meridian_frequency && (this.meridian_frequency <= 0 || this.meridian_frequency > 30) && (this.meridian_frequency = 10), 
        'none' != this.parallel_frequency) for (var o = -90 + this.parallel_frequency; o < 90; o += this.parallel_frequency) {
            (c = new LineFeature).featureName = 'Parallel ' + o;
            for (var h = -180; h <= 180; h++) c.addPoint(new ProjectedPoint(o, h));
            this.parallels.push(c);
        }
        if ('none' != this.meridian_frequency) for (h = -180; h <= 180; h += this.meridian_frequency) {
            var c;
            if ((c = new LineFeature).featureName = 'Meridian ' + h, 1 == this.draw_to_poles) for (o = -90; o <= 90; o++) c.addPoint(new ProjectedPoint(o, h)); else for (o = -90 + n; o < 90; o++) c.addPoint(new ProjectedPoint(o, h));
            this.meridians.push(c);
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