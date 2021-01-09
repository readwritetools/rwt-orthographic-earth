/* Copyright (c) 2021 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BasePackage from './base-package.class.js';

import LineFeature from '../features/line-feature.class.js';

import ProjectedPoint from '../projection/projected-point.class.js';

export default class Graticule extends BasePackage {
    constructor(e, i, a, t, s, r, n) {
        if (super(e, i, a, t), this.identifiable = 'disallow', this.parallel_frequency = void 0 !== s ? s : 10, 
        this.meridian_frequency = void 0 !== r ? r : 10, this.draw_to_poles = void 0 !== n && n, 
        this.parallels = [], this.meridians = [], 'none' != this.parallel_frequency && (this.parallel_frequency <= 0 || this.parallel_frequency > 30) && (this.parallel_frequency = 10), 
        'none' != this.meridian_frequency && (this.meridian_frequency <= 0 || this.meridian_frequency > 30) && (this.meridian_frequency = 10), 
        'none' != this.parallel_frequency) for (var o = -90 + s; o < 90; o += s) {
            (h = new LineFeature).featureName = 'Parallel ' + o;
            for (var l = -180; l <= 180; l++) h.addPoint(new ProjectedPoint(o, l));
            this.parallels.push(h);
        }
        if ('none' != this.meridian_frequency) for (l = -180; l <= 180; l += r) {
            var h;
            if ((h = new LineFeature).featureName = 'Meridian ' + l, 1 == this.draw_to_poles) for (o = -90; o <= 90; o++) h.addPoint(new ProjectedPoint(o, l)); else for (o = -90 + r; o < 90; o++) h.addPoint(new ProjectedPoint(o, l));
            this.meridians.push(h);
        }
        this.packageNeedsRestyling = !0, this.packagePointsNeedGeoCoords = !0, this.packagePointsNeedProjection = !0, 
        this.packagePointsNeedTransformation = !0, this.packagePointsNeedPlacement = !0, 
        this.rwtOrthographicEarth.broadcastMessage('package/graticule', null);
    }
    recomputeStyles(e) {
        for (var i = 0; i < this.parallels.length; i++) this.parallels[i].computeStyle(e, this.classname, this.identifier, i);
        for (i = 0; i < this.meridians.length; i++) this.meridians[i].computeStyle(e, this.classname, this.identifier, i);
        this.packageNeedsRestyling = !1;
    }
    rotation(e) {
        for (var i = 0; i < this.parallels.length; i++) this.parallels[i].toGeoCoords(e);
        for (i = 0; i < this.meridians.length; i++) this.meridians[i].toGeoCoords(e);
        this.packagePointsNeedGeoCoords = !1, this.packagePointsNeedProjection = !0;
    }
    projection(e) {
        for (var i = 0; i < this.parallels.length; i++) this.parallels[i].toPlane(e);
        for (i = 0; i < this.meridians.length; i++) this.meridians[i].toPlane(e);
        this.packagePointsNeedProjection = !1, this.packagePointsNeedTransformation = !0;
    }
    transformation(e) {
        for (var i = 0; i < this.parallels.length; i++) this.parallels[i].toPixels(e);
        for (i = 0; i < this.meridians.length; i++) this.meridians[i].toPixels(e);
        this.packagePointsNeedTransformation = !1, this.packagePointsNeedPlacement = !0;
    }
    placement(e) {
        for (var i = 0; i < this.parallels.length; i++) this.parallels[i].toCanvas(e);
        for (i = 0; i < this.meridians.length; i++) this.meridians[i].toCanvas(e);
        this.packagePointsNeedPlacement = !1;
    }
    render(e) {
        for (var i = 0; i < this.parallels.length; i++) this.parallels[i].render(e);
        for (i = 0; i < this.meridians.length; i++) this.meridians[i].render(e);
    }
}