/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
/* Copyright (c) 2021 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BaseFeature from './base-feature.class.js';

export default class GeneralFeature extends BaseFeature {
    constructor(e) {
        super(), this.kvPairs = e;
    }
    computeStyle(e, a, s, t) {
        this.canvasParams = e.computeStyle('general', a, s, '', this.kvPairs, t);
    }
    toGeoCoords(e) {}
    toPlane(e) {}
    toPixels(e) {}
    toCanvas(e) {}
    render(e) {}
};