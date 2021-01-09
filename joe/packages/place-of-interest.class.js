/* Copyright (c) 2021 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BasePackage from './base-package.class.js';

import PointFeature from '../features/point-feature.class.js';

export default class PlaceOfInterest extends BasePackage {
    constructor(e, t, a, i) {
        super(e, t, a, i), this.identifiable = 'disallow', this.pointFeature = new PointFeature, 
        this.pointFeature.featureName = 'place-of-interest', this.registerEventListeners(), 
        this.packageNeedsRestyling = !0, this.packagePointsNeedGeoCoords = !0, this.packagePointsNeedProjection = !0, 
        this.packagePointsNeedTransformation = !0, this.packagePointsNeedPlacement = !0, 
        this.rwtOrthographicEarth.broadcastMessage('package/place-of-interest', null);
    }
    registerEventListeners() {
        this.rwtOrthographicEarth.addEventListener('earthPosition/placeOfInterest', (e => {
            var t = e.detail;
            this.pointFeature.discretePoint.setLatitude(t.latitude), this.pointFeature.discretePoint.setLongitude(t.longitude), 
            this.packagePointsNeedProjection = !0, this.packagePointsNeedTransformation = !0, 
            this.packagePointsNeedPlacement = !0, this.rwtOrthographicEarth.invalidateCanvas();
        }));
    }
    recomputeStyles(e) {
        this.pointFeature.computeStyle(e, this.classname, this.identifier, 0), this.packageNeedsRestyling = !1;
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
    render(e) {
        this.pointFeature.render(e);
    }
}