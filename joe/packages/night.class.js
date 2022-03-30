/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BasePackage from './base-package.class.js';

import HemisphereFeature from '../features/hemisphere-feature.class.js';

import * as CB from '../menu/panel-callbacks.js';

import expect from '../dev/expect.js';

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
    recomputeStyles(e, t, i, s) {
        expect(e, 'RenderClock'), expect(t, 'vssStyleSheet'), expect(i, 'Layer'), expect(s, 'Number'), 
        super.recomputeStyles(e, t, i, (() => {
            this.identityPoints.computeFeatureStyle(e, t, i.vssClassname, i.vssIdentifier, 0, s);
        }));
    }
    runCourtesyValidator(e, t, i) {
        expect(e, 'vssStyleSheet'), expect(t, 'Layer'), expect(i, 'Number'), super.runCourtesyValidator((() => {
            this.identityPoints.runCourtesyValidator(e, t.vssClassname, t.vssIdentifier, 0, i);
        }));
    }
    rotation(e, t) {
        expect(e, 'RenderClock'), expect(t, 'GeocentricCoordinates'), super.rotation(e, t, (() => {
            for (var e = 0; e < this.identityPoints.outerRing.length; e++) t.toNightPhiLambda(this.identityPoints.outerRing[e]);
        }));
    }
    projection(e, t) {
        expect(e, 'RenderClock'), expect(t, 'OrthographicProjection'), super.projection(e, t, (() => {
            var e = CB.numSecondsSinceMidnightUTC(this.rwtOrthographicEarth.earth.earthPosition.UTC) + 64800;
            e >= 86400 && (e -= 86400);
            var i = 2 * (e / 86400) * Math.PI;
            this.identityPoints.pointsOnNearSide = 0, this.identityPoints.pointsOnFarSide = 0;
            for (var s = 0; s < this.identityPoints.outerRing.length; s++) {
                let e = this.identityPoints.outerRing[s];
                t.toNightEastingNorthing(e, i), e.isOnNearSide ? this.identityPoints.pointsOnNearSide++ : this.identityPoints.pointsOnFarSide++;
            }
        }));
    }
    transformation(e, t) {
        expect(e, 'RenderClock'), expect(t, 'CartesianTransformation'), super.transformation(e, t, (() => {
            for (var e = 0; e < this.identityPoints.outerRing.length; e++) t.toEarthXY(this.identityPoints.outerRing[e], !0, !0, !0);
        }));
    }
    placement(e, t) {
        expect(e, 'RenderClock'), expect(t, 'Viewport'), super.placement(e, t, (() => {
            for (var i = 0; i < this.identityPoints.outerRing.length; i++) {
                let s = this.identityPoints.outerRing[i];
                if (t.toCanvasXY(s), s.isOnNearSide) if (s.isOnCanvas) this.identityPoints.pointsOnCanvas++; else if (this.identityPoints.pointsOffCanvas++, 
                e.renderingState == RS.SKETCHING) return;
            }
        }));
    }
    drawLayer(e, t, i) {
        expect(e, 'RenderClock'), expect(t, 'Earth'), expect(i, 'Number'), super.drawLayer(e, (() => {
            this.identityPoints.drawFeature(e, t, i);
        }));
    }
}