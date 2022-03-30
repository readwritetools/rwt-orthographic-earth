/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import expect from '../dev/expect.js';

export default class Layer {
    constructor(e, i, t, s, r, a, h, n, l) {
        expect(e, 'rwtOrthographicEarth'), expect(i, 'Number'), expect(t, 'Number'), expect(s, 'String'), 
        expect(r, 'String'), expect(a, 'String'), expect(h, 'String'), expect(n, 'String'), 
        expect(l, [ 'Function', 'null' ]), this.rwtOrthographicEarth = e, this.packageId = i, 
        this.zOrder = t, this.layerName = s, this.vssIdentifier = r, this.vssClassname = a, 
        this.featureKey = h, this.identifiable = n, this.identifyCallback = l, this.visible = !0, 
        this.layerNeedsRestyling = !0, Object.seal(this);
    }
    isVisible() {
        return this.visible;
    }
    changeVisibility(e) {
        expect(e, 'Boolean'), this.visible = e, this.rwtOrthographicEarth.earth.invalidateCanvas();
    }
    getIdentifiable() {
        return this.identifiable;
    }
    isIdentifiable() {
        return 1 == this.visible && 'yes' == this.identifiable;
    }
    changeIdentifiability(e) {
        expect(e, 'Boolean'), this.identifiable = 1 == e ? 'yes' : 'no';
    }
}