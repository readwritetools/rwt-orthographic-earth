/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BaseFeature from './base-feature.class.js';

import expect from '../dev/expect.js';

export default class GeneralFeature extends BaseFeature {
    constructor(e, t) {
        super(), this.kvPairs = e, this.generalFeatureType = t;
    }
    computeFeatureStyle(e, t, r, a, s, o) {
        expect(t, 'vssStyleSheet'), expect(r, 'String'), expect(a, 'String'), expect(s, 'Number'), 
        expect(o, 'Number');
        let c = t.computeStyle(this.generalFeatureType, r, a, !1, '', this.kvPairs, s);
        expect(c, 'vssCanvasParameters'), this.canvasParams.set(o, c);
    }
    runCourtesyValidator(e, t, r, a, s) {
        e.runCourtesyValidator(this.generalFeatureType, t, r, '', this.kvPairs, a);
    }
    static courtesyValidator(e) {
        return !1;
    }
    toGeoCoords(e, t) {}
    toPlane(e, t) {}
    toPixels(e, t) {
        expect(e, 'RenderClock'), expect(t, 'CartesianTransformation');
    }
    toViewportCanvas(e, t) {
        expect(e, 'RenderClock'), expect(t, 'Viewport');
    }
    drawFeature(e, t, r) {
        expect(e, 'RenderClock'), expect(t, 'Earth'), expect(r, 'Number'), terminal.logic('Feature subclass must provide a drawFeature() function');
    }
}