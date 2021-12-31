/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import PolygonFeature from './polygon-feature.class.js';

import ProjectedPoint from '../projection/projected-point.class.js';

import ECEF from '../projection/earth-centered-earth-fixed.class.js';

import expect from '../joezone/expect.js';

export default class HemisphereFeature extends PolygonFeature {
    constructor(e) {
        super();
        for (let i = 0; i < e + 1; i++) {
            var t = i * (2 * Math.PI / e) + Math.PI / 2, o = Math.cos(t), r = Math.sin(t), {latitude: a, longitude: s} = ECEF.xyz2ll(o, 0, r);
            Math.abs(a) < .1 ? s -= .1 : s -= .1 * Math.abs(1 / a), a > 89.9 ? a = 89.9 : a < -89.9 && (a = -89.9), 
            this.addPoint(new ProjectedPoint(a, s));
        }
    }
}