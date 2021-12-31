/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BaseFeature from './base-feature.class.js';

import expect from '../joezone/expect.js';

export default class GeneralFeature extends BaseFeature {
    constructor(e) {
        super(), this.kvPairs = e;
    }
    computeFeatureStyle(e, t, r, s, a) {
        expect(e, 'vssStyleSheet'), expect(t, 'String'), expect(r, 'String'), expect(s, 'Number'), 
        expect(a, 'Number');
        let o = e.computeStyle('general', t, r, '', this.kvPairs, s);
        expect(o, 'vssCanvasParameters'), this.canvasParams.set(a, o);
    }
    toGeoCoords(e) {}
    toPlane(e) {}
    toPixels(e) {}
    toCanvas(e) {}
    renderFeature(e, t) {
        expect(e, 'Earth'), expect(t, 'Number');
    }
}