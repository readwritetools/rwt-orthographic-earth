/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BasePackage from './base-package.class.js';

import PointFeature from '../features/point-feature.class.js';

import expect from 'softlib/expect.js';

export default class PlaceOfInterest extends BasePackage {
    constructor(e, t, a, s, i) {
        super(e, t, a, s, i), this.pointFeature = new PointFeature, this.pointFeature.featureName = 'place-of-interest', 
        this.registerEventListeners(), this.packagePointsNeedGeoCoords = !0, this.packagePointsNeedProjection = !0, 
        this.packagePointsNeedTransformation = !0, this.packagePointsNeedPlacement = !0, 
        this.rwtOrthographicEarth.broadcastMessage('package/place-of-interest', null), Object.seal(this);
    }
    registerEventListeners() {
        this.rwtOrthographicEarth.addEventListener('earthPosition/placeOfInterest', (e => {
            var t = e.detail;
            this.pointFeature.discretePoint.setLatitude(t.latitude), this.pointFeature.discretePoint.setLongitude(t.longitude), 
            this.packagePointsNeedProjection = !0, this.packagePointsNeedTransformation = !0, 
            this.packagePointsNeedPlacement = !0, this.rwtOrthographicEarth.invalidateCanvas();
        }));
    }
    recomputeStyles(e, t, a) {
        expect(e, 'vssStyleSheet'), expect(t, 'Layer'), expect(a, 'Number'), this.pointFeature.computeFeatureStyle(e, t.vssClassname, t.vssIdentifier, 0, a), 
        t.layerNeedsRestyling = !1;
    }
    runCourtesyValidator(e, t, a) {
        expect(e, 'vssStyleSheet'), expect(t, 'Layer'), expect(a, 'Number'), this.pointFeature.runCourtesyValidator(e, t.vssClassname, t.vssIdentifier, 0, a);
    }
    rotation(e) {
        this.pointFeature.toGeoCoords(e), this.packagePointsNeedGeoCoords = !1, this.packagePointsNeedProjection = !0;
    }
    projection(e) {
        this.pointFeature.toPlane(e), this.packagePointsNeedProjection = !1, this.packagePointsNeedTransformation = !0;
    }
    transformation(e) {
        this.pointFeature.toPixels(e), this.packagePointsNeedTransformation = !1, this.packagePointsNeedPlacement = !0;
    }
    placement(e) {
        this.pointFeature.toCanvas(e), this.packagePointsNeedPlacement = !1;
    }
    renderLayer(e, t) {
        expect(e, 'Earth'), expect(t, 'Number'), this.pointFeature.renderFeature(e, t);
    }
}