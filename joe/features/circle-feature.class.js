/* Copyright (c) 2021 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import PolygonFeature from './polygon-feature.class.js';

import ProjectedPoint from '../projection/projected-point.class.js';

import ECEF from '../projection/earth-centered-earth-fixed.class.js';

export default class CircleFeature extends PolygonFeature {
    constructor(t) {
        super();
        for (let i = 0; i < t + 1; i++) {
            var e = i * (2 * Math.PI / t) + Math.PI / 2, o = Math.cos(e), r = Math.sin(e), {latitude: a, longitude: s} = ECEF.xyz2ll(o, 0, r);
            Math.abs(a) < .1 ? s -= .1 : s -= .1 * Math.abs(1 / a), a > 89.9 ? a = 89.9 : a < -89.9 && (a = -89.9), 
            this.addPoint(new ProjectedPoint(a, s));
        }
    }
};