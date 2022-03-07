/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BaseFeature from './base-feature.class.js';

import expect from 'softlib/expect.js';

export default class GeneralFeature extends BaseFeature {
    constructor(e, t) {
        super(), this.kvPairs = e, this.generalFeatureType = t;
    }
    computeFeatureStyle(e, t, r, a, s) {
        expect(e, 'vssStyleSheet'), expect(t, 'String'), expect(r, 'String'), expect(a, 'Number'), 
        expect(s, 'Number');
        let o = e.computeStyle(this.generalFeatureType, t, r, '', this.kvPairs, a);
        expect(o, 'vssCanvasParameters'), this.canvasParams.set(s, o);
    }
    runCourtesyValidator(e, t, r, a, s) {
        e.runCourtesyValidator(this.generalFeatureType, t, r, '', this.kvPairs, a);
    }
    static courtesyValidator(e) {
        return !1;
    }
    toGeoCoords(e) {}
    toPlane(e) {}
    toPixels(e) {}
    toCanvas(e) {}
    renderFeature(e, t) {
        expect(e, 'Earth'), expect(t, 'Number');
    }
}