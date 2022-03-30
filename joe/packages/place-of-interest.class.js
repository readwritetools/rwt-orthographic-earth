/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BasePackage from './base-package.class.js';

import PointFeature from '../features/point-feature.class.js';

import expect from '../dev/expect.js';

export default class PlaceOfInterest extends BasePackage {
    constructor(e, t, r, a, s) {
        super(e, t, r, a, s), this.pointFeature = new PointFeature, this.pointFeature.featureName = 'place-of-interest', 
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
    recomputeStyles(e, t, r, a) {
        expect(e, 'RenderClock'), expect(t, 'vssStyleSheet'), expect(r, 'Layer'), expect(a, 'Number'), 
        super.recomputeStyles(e, t, r, (() => {
            this.pointFeature.computeFeatureStyle(e, t, r.vssClassname, r.vssIdentifier, 0, a);
        }));
    }
    runCourtesyValidator(e, t, r) {
        expect(e, 'vssStyleSheet'), expect(t, 'Layer'), expect(r, 'Number'), super.runCourtesyValidator((() => {
            this.pointFeature.runCourtesyValidator(e, t.vssClassname, t.vssIdentifier, 0, r);
        }));
    }
    rotation(e, t) {
        expect(e, 'RenderClock'), expect(t, 'GeocentricCoordinates'), super.rotation(e, t, (() => {
            this.pointFeature.toGeoCoords(e, t);
        }));
    }
    projection(e, t) {
        expect(e, 'RenderClock'), expect(t, 'OrthographicProjection'), super.projection(e, t, (() => {
            this.pointFeature.toPlane(e, t);
        }));
    }
    transformation(e, t) {
        expect(e, 'RenderClock'), expect(t, 'CartesianTransformation'), super.transformation(e, t, (() => {
            this.pointFeature.toPixels(e, t);
        }));
    }
    placement(e, t) {
        expect(e, 'RenderClock'), expect(t, 'Viewport'), super.placement(e, t, (() => {
            this.pointFeature.toViewportCanvas(e, t);
        }));
    }
    drawLayer(e, t, r) {
        expect(e, 'RenderClock'), expect(t, 'Earth'), expect(r, 'Number'), super.drawLayer(e, (() => {
            this.pointFeature.drawFeature(e, t, r);
        }));
    }
}