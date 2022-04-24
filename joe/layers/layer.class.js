/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import expect from '../dev/expect.js';

export default class Layer {
    constructor(e, t, i, s, a, l, r, h, n, c) {
        expect(e, 'rwtOrthographicEarth'), expect(t, 'Number'), expect(i, 'Number'), expect(s, 'String'), 
        expect(a, 'String'), expect(l, 'String'), expect(r, 'String'), expect(h, 'String'), 
        expect(n, [ 'Function', 'null' ]), expect(c, 'String'), this.rwtOrthographicEarth = e, 
        this.packageId = t, this.zOrder = i, this.layerName = s, this.vssIdentifier = a, 
        this.vssClassname = l, this.featureKey = r, this.identifiable = h, this.identifyCallback = n, 
        this.selectable = c, this.visible = !0, this.layerNeedsRestyling = !0, Object.seal(this);
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
    getSelectable() {
        return this.selectable;
    }
    isSelectable() {
        return 1 == this.visible && 'yes' == this.selectable;
    }
    changeSelectability(e) {
        expect(e, 'Boolean'), this.selectable = 1 == e ? 'yes' : 'no';
    }
}