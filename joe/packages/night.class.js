/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BasePackage from './base-package.class.js';

import HemisphereFeature from '../features/hemisphere-feature.class.js';

import * as CB from '../panels/panel-callbacks.js';

const degreesToRadians = Math.PI / 180;

export default class Night extends BasePackage {
    constructor(t, e, i, s, a) {
        super(t, e, i, s, a);
        this.identityPoints = new HemisphereFeature(90), this.identityPoints.featureName = 'night', 
        this.registerEventListeners(), this.packageNeedsRestyling = !0, this.packagePointsNeedGeoCoords = !0, 
        this.packagePointsNeedProjection = !0, this.packagePointsNeedTransformation = !0, 
        this.packagePointsNeedPlacement = !0, this.rwtOrthographicEarth.broadcastMessage('package/night', null);
    }
    registerEventListeners() {
        this.rwtOrthographicEarth.addEventListener('carte/solarDeclination', (t => {
            this.packagePointsNeedProjection = !0, this.packagePointsNeedTransformation = !0;
        })), this.rwtOrthographicEarth.addEventListener('earthPosition/timeOfDayHMS', (t => {
            this.packagePointsNeedProjection = !0, this.packagePointsNeedTransformation = !0;
        }));
    }
    recomputeStyles(t) {
        this.identityPoints.computeStyle(t, this.classname, this.identifier, 0), this.packageNeedsRestyling = !1;
    }
    rotation(t) {
        for (var e = 0; e < this.identityPoints.outerRing.length; e++) t.toNightCoords(this.identityPoints.outerRing[e]);
        this.packagePointsNeedGeoCoords = !1, this.packagePointsNeedProjection = !0;
    }
    projection(t) {
        var e = CB.numSecondsSinceMidnightUTC(this.rwtOrthographicEarth.earth.earthPosition.UTC) + 64800;
        e >= 86400 && (e -= 86400);
        for (var i = 2 * (e / 86400) * Math.PI, s = 0; s < this.identityPoints.outerRing.length; s++) t.toNightPlane(this.identityPoints.outerRing[s], i);
        this.packagePointsNeedProjection = !1, this.packagePointsNeedTransformation = !0;
    }
    transformation(t) {
        for (var e = 0; e < this.identityPoints.outerRing.length; e++) t.toPixels(this.identityPoints.outerRing[e], !0, !0, !0);
        this.packagePointsNeedTransformation = !1, this.packagePointsNeedPlacement = !0;
    }
    placement(t) {
        this.identityPoints.toCanvas(t), this.packagePointsNeedPlacement = !1;
    }
    render(t) {
        'hidden' != this.identityPoints.canvasParams.visibility && this.identityPoints.render(t);
    }
}