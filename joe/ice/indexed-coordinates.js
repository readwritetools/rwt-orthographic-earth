/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import expect from 'softlib/expect.js';

import aver from 'softlib/aver.js';

export default class IndexedCoordinates {
    constructor() {
        this.meridians = new Array, this.parallels = new Array;
    }
    get packedWidth() {
        return this.meridians.length > 65536 || this.parallels.length > 65536 ? 4 : 2;
    }
    registerLongitude(e) {
        expect(e, 'Number'), aver(e >= -180 && e <= 180), this.meridians.push(e);
    }
    registerLatitude(e) {
        expect(e, 'Number'), aver(e >= -90 && e <= 90), this.parallels.push(e);
    }
    getLongitude(e) {
        return e < 0 || e >= this.meridians.length ? null : this.meridians[e];
    }
    getLatitude(e) {
        return e < 0 || e >= this.parallels.length ? null : this.parallels[e];
    }
}