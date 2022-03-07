/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import expect from 'softlib/expect.js';

import terminal from 'softlib/terminal.js';

export default class BaseFeature {
    constructor() {
        this.featureName = '', this.kvPairs = {}, this.canvasParams = new Map;
    }
    computeFeatureStyle(e, t, a, r, s) {
        expect(e, 'vssStyleSheet'), expect(t, 'String'), expect(a, 'String'), expect(r, 'Number'), 
        expect(s, 'Number'), terminal.logic('Feature subclass must provide a computeFeatureStyle() function');
    }
    toGeoCoords(e) {
        terminal.logic('Feature subclass must provide a toGeoCoords() function');
    }
    toPlane(e) {
        terminal.logic('Feature subclass must provide a toPlane() function');
    }
    toPixels(e) {
        terminal.logic('Feature subclass must provide a toPixels() function');
    }
    toCanvas(e) {
        terminal.logic('Feature subclass must provide a toCanvas() function');
    }
    renderFeature(e, t) {
        expect(e, 'Earth'), expect(t, 'Number'), terminal.logic('Feature subclass must provide a renderFeature() function');
    }
}