/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import Layer from '../layers/layer.class.js';

import expect from '../joezone/expect.js';

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
    recomputeStyles(e, a, t) {
        expect(e, 'vssStyleSheet'), expect(a, 'Layer'), expect(t, 'Number'), console.log('BasePackage subclass must provide a recomputeStyles() function');
    }
    runCourtesyValidator(e, a, t) {
        expect(e, 'vssStyleSheet'), expect(a, 'Layer'), expect(t, 'Number'), console.log('BasePackage subclass must provide a runCourtesyValidator() function');
    }
    rotation(e) {
        console.log('BasePackage subclass must provide a rotation() function');
    }
    projection(e) {
        console.log('BasePackage subclass must provide a projection() function');
    }
    transformation(e) {
        console.log('BasePackage subclass must provide a transformation() function');
    }
    placement(e) {
        console.log('BasePackage subclass must provide a placement() function');
    }
    renderLayer(e, a) {
        expect(e, 'Earth'), expect(a, 'Number'), console.log('BasePackage subclass must provide a renderLayer() function');
    }
    discoverFeatures(e, a) {
        return null;
    }
}