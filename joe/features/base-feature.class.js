/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import expect from '../joezone/expect.js';

export default class BaseFeature {
    constructor() {
        this.featureName = '', this.kvPairs = {}, this.canvasParams = new Map;
    }
    computeFeatureStyle(e, t, o, s, a) {
        expect(e, 'vssStyleSheet'), expect(t, 'String'), expect(o, 'String'), expect(s, 'Number'), 
        expect(a, 'Number'), console.log('Feature subclass must provide a computeFeatureStyle() function');
    }
    toGeoCoords(e) {
        console.log('Feature subclass must provide a toGeoCoords() function');
    }
    toPlane(e) {
        console.log('Feature subclass must provide a toPlane() function');
    }
    toPixels(e) {
        console.log('Feature subclass must provide a toPixels() function');
    }
    toCanvas(e) {
        console.log('Feature subclass must provide a toCanvas() function');
    }
    renderFeature(e, t) {
        expect(e, 'Earth'), expect(t, 'Number'), console.log('Feature subclass must provide a renderFeature() function');
    }
}