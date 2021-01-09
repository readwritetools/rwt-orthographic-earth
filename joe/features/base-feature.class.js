/* Copyright (c) 2021 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
export default class BaseFeature {
    constructor() {
        this.featureName = '', this.kvPairs = {}, this.canvasParams = null;
    }
    computeStyle(o, e, s, t) {
        console.log('Feature subclass must provide a computeStyle() function');
    }
    toGeoCoords(o) {
        console.log('Feature subclass must provide a toGeoCoords() function');
    }
    toPlane(o) {
        console.log('Feature subclass must provide a toPlane() function');
    }
    toPixels(o) {
        console.log('Feature subclass must provide a toPixels() function');
    }
    toCanvas(o) {
        console.log('Feature subclass must provide a toCanvas() function');
    }
    render(o) {
        console.log('Feature subclass must provide a render() function');
    }
};