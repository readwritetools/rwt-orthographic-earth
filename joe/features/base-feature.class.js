/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import RS from '../enum/rendering-state.enum.js';

import expect from '../dev/expect.js';

import terminal from 'softlib/terminal.js';

export default class BaseFeature {
    constructor() {
        this.featureName = '', this.kvPairs = {}, this.canvasParams = new Map, this.pointsOnNearSide = 0, 
        this.pointsOnFarSide = 0, this.pointsOnCanvas = 0, this.pointsOffCanvas = 0;
    }
    computeFeatureStyle(e, t, s, a, r, i) {
        expect(e, 'RenderClock'), expect(t, 'vssStyleSheet'), expect(s, 'String'), expect(a, 'String'), 
        expect(r, 'Number'), expect(i, 'Number'), terminal.logic('Feature subclass must provide a computeFeatureStyle() function');
    }
    toGeoCoords(e, t) {
        terminal.logic('Feature subclass must provide a toGeoCoords() function');
    }
    toPlane(e, t) {
        terminal.logic('Feature subclass must provide a toPlane() function');
    }
    toPixels(e, t) {
        terminal.logic('Feature subclass must provide a toPixels() function');
    }
    toViewportCanvas(e, t) {
        terminal.logic('Feature subclass must provide a toViewportCanvas() function');
    }
    drawFeature(e, t, s) {
        expect(e, 'RenderClock'), expect(t, 'Earth'), expect(s, 'Number'), terminal.logic('Feature subclass must provide a drawFeature() function');
    }
    featureIsOnNearSide(e) {
        return expect(e, 'Number'), !(this.pointsOnFarSide > 0 && e == RS.SKETCHING);
    }
    featureIsOnCanvas(e) {
        return expect(e, 'Number'), !(this.pointsOffCanvas > 0 && e == RS.SKETCHING);
    }
    hasSomethingToDraw(e) {
        return expect(e, 'vssCanvasParameters'), 'hidden' != e.visibility && (0 != this.pointsOnNearSide && 0 != this.pointsOnCanvas);
    }
}