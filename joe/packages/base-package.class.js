/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import Layer from '../layers/layer.class.js';

import RS from '../enum/rendering-state.enum.js';

import PS from '../enum/projection-stage.enum.js';

import expect from '../dev/expect.js';

import terminal from 'softlib/terminal.js';

export default class BasePackage {
    constructor(e) {
        this.rwtOrthographicEarth = e, this.packagePointsNeedGeoCoords = !1, this.packagePointsNeedProjection = !1, 
        this.packagePointsNeedTransformation = !1, this.packagePointsNeedPlacement = !1;
    }
    changeVisibility(e) {
        1 == e && (this.packagePointsNeedGeoCoords = !0, this.packagePointsNeedProjection = !0, 
        this.packagePointsNeedTransformation = !0, this.packagePointsNeedPlacement = !0), 
        this.rwtOrthographicEarth.earth.invalidateCanvas();
    }
    recomputeStyles(e, t, o, a) {
        expect(e, 'RenderClock'), expect(t, 'vssStyleSheet'), expect(o, 'Layer'), expect(a, 'Function'), 
        0 == t.allFeaturesNeedRestyling && 0 == o.layerNeedsRestyling || (a(), e.isRenderTimeAvailable() && (o.layerNeedsRestyling = !1));
    }
    runCourtesyValidator(e) {
        expect(e, 'Function'), e();
    }
    rotation(e, t, o) {
        expect(e, 'RenderClock'), expect(t, 'GeocentricCoordinates'), expect(o, 'Function'), 
        0 == t.allPointsNeedGeoCoords && 0 == this.packagePointsNeedGeoCoords || (o(), this.packagePointsNeedGeoCoords = !1, 
        this.packagePointsNeedProjection = !0);
    }
    projection(e, t, o) {
        expect(e, 'RenderClock'), expect(t, 'OrthographicProjection'), expect(o, 'Function'), 
        0 == t.allPointsNeedProjection && 0 == this.packagePointsNeedProjection || (o(), 
        this.packagePointsNeedProjection = !1, this.packagePointsNeedTransformation = !0);
    }
    transformation(e, t, o) {
        expect(e, 'RenderClock'), expect(t, 'CartesianTransformation'), expect(o, 'Function'), 
        0 == t.allPointsNeedTransformation && 0 == this.packagePointsNeedTransformation || (o(), 
        this.packagePointsNeedTransformation = !1, this.packagePointsNeedPlacement = !0);
    }
    placement(e, t, o) {
        expect(e, 'RenderClock'), expect(t, 'Viewport'), expect(o, 'Function'), 0 == t.allPointsNeedPlacement && 0 == this.packagePointsNeedPlacement || (o(), 
        this.packagePointsNeedPlacement = !1);
    }
    drawLayer(e, t) {
        expect(e, 'RenderClock'), expect(t, 'Function'), t();
    }
    discoverFeatures(e, t, o) {
        return null;
    }
}