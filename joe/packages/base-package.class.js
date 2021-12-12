/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import expect from '../joezone/expect.js';

export default class BasePackage {
    constructor(e, t, s, i, a) {
        expect(e, 'rwtOrthographicEarth'), expect(t, 'Number'), expect(s, 'String'), expect(i, 'String'), 
        expect(a, 'String'), this.rwtOrthographicEarth = e, this.zOrder = t, this.layerName = s, 
        this.identifier = i, this.classname = a, this.visible = !0, this.identifiable = 'disallow', 
        this.packageNeedsRestyling = !1, this.packagePointsNeedGeoCoords = !1, this.packagePointsNeedProjection = !1, 
        this.packagePointsNeedTransformation = !1, this.packagePointsNeedPlacement = !1, 
        this.packageNeedsHashing = !1;
    }
    isVisible() {
        return this.visible;
    }
    changeVisibility(e) {
        this.visible = e, 1 == e && (this.packageNeedsRestyling = !0, this.packagePointsNeedGeoCoords = !0, 
        this.packagePointsNeedProjection = !0, this.packagePointsNeedTransformation = !0, 
        this.packagePointsNeedPlacement = !0, this.packageNeedsHashing = !0), this.rwtOrthographicEarth.earth.invalidateCanvas();
    }
    isIdentifiable() {
        return 1 == this.visible && 'yes' == this.identifiable;
    }
    changeIdentifiability(e) {
        this.identifiable = 1 == e ? 'yes' : 'no';
    }
    recomputeStyles(e) {
        console.log('BasePackage subclass must provide a recomputeStyles() function');
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
    hash(e) {}
    placement(e) {
        console.log('Package subclass must provide a placement() function');
    }
    render(e) {
        console.log('Package subclass must provide a render() function');
    }
    discoverFeatures(e, t) {
        return null;
    }
}