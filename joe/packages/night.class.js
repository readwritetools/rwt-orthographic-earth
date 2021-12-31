/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BasePackage from './base-package.class.js';

import HemisphereFeature from '../features/hemisphere-feature.class.js';

import * as CB from '../panels/panel-callbacks.js';

import expect from '../joezone/expect.js';

const degreesToRadians = Math.PI / 180;

export default class Night extends BasePackage {
    constructor(e) {
        super(e);
        this.identityPoints = new HemisphereFeature(90), this.identityPoints.featureName = 'night', 
        this.registerEventListeners(), this.packagePointsNeedGeoCoords = !0, this.packagePointsNeedProjection = !0, 
        this.packagePointsNeedTransformation = !0, this.packagePointsNeedPlacement = !0, 
        this.rwtOrthographicEarth.broadcastMessage('package/night', null), Object.seal(this);
    }
    registerEventListeners() {
        this.rwtOrthographicEarth.addEventListener('carte/solarDeclination', (e => {
            this.packagePointsNeedProjection = !0, this.packagePointsNeedTransformation = !0;
        })), this.rwtOrthographicEarth.addEventListener('earthPosition/timeOfDayHMS', (e => {
            this.packagePointsNeedProjection = !0, this.packagePointsNeedTransformation = !0;
        }));
    }
    recomputeStyles(e, t, i) {
        expect(e, 'vssStyleSheet'), expect(t, 'Layer'), expect(i, 'Number'), this.identityPoints.computeFeatureStyle(e, t.vssClassname, t.vssIdentifier, 0, i), 
        t.layerNeedsRestyling = !1;
    }
    rotation(e) {
        for (var t = 0; t < this.identityPoints.outerRing.length; t++) e.toNightCoords(this.identityPoints.outerRing[t]);
        this.packagePointsNeedGeoCoords = !1, this.packagePointsNeedProjection = !0;
    }
    projection(e) {
        var t = CB.numSecondsSinceMidnightUTC(this.rwtOrthographicEarth.earth.earthPosition.UTC) + 64800;
        t >= 86400 && (t -= 86400);
        for (var i = 2 * (t / 86400) * Math.PI, s = 0; s < this.identityPoints.outerRing.length; s++) e.toNightPlane(this.identityPoints.outerRing[s], i);
        this.packagePointsNeedProjection = !1, this.packagePointsNeedTransformation = !0;
    }
    transformation(e) {
        for (var t = 0; t < this.identityPoints.outerRing.length; t++) e.toPixels(this.identityPoints.outerRing[t], !0, !0, !0);
        this.packagePointsNeedTransformation = !1, this.packagePointsNeedPlacement = !0;
    }
    placement(e) {
        this.identityPoints.toCanvas(e), this.packagePointsNeedPlacement = !1;
    }
    renderLayer(e, t) {
        expect(e, 'Earth'), expect(t, 'Number');
        let i = this.identityPoints.canvasParams.get(t);
        expect(i, 'vssCanvasParameters'), 'hidden' != i.visibility && this.identityPoints.renderFeature(e, t);
    }
}