/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import RS from '../enum/rendering-state.enum.js';

import expect from '../dev/expect.js';

import terminal from 'softlib/terminal.js';

export default class BaseFeature {
    static nextFeatureId=0;
    constructor() {
        this.featureId = BaseFeature.nextFeatureId++, this.featureName = '', this.kvPairs = {}, 
        this.isSelected = !1, this.canvasParams = new Map, this.pointsOnNearSide = 0, this.pointsOnFarSide = 0, 
        this.pointsOnCanvas = 0, this.pointsOffCanvas = 0;
    }
    toggleSelectedState() {
        this.isSelected = !this.isSelected;
    }
    computeFeatureStyle(e, t, s, a, i, r) {
        expect(e, 'RenderClock'), expect(t, 'vssStyleSheet'), expect(s, 'String'), expect(a, 'String'), 
        expect(i, 'Number'), expect(r, 'Number'), terminal.logic('Feature subclass must provide a computeFeatureStyle() function');
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
    featureIsVisible(e) {
        expect(e, 'Number');
        let t = this.canvasParams.get(e);
        return null != t && 'hidden' != t.visibility;
    }
    hasSomethingToDraw(e) {
        return expect(e, [ 'vssCanvasParameters', 'undefined' ]), null != e && ('hidden' != e.visibility && (0 != this.pointsOnNearSide && 0 != this.pointsOnCanvas));
    }
    roughAndReadyPoint() {
        return {
            latitude: 0,
            longitude: 0
        };
    }
}