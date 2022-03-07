/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import ProjectedPoint from './projected-point.class.js';

import terminal from 'softlib/terminal.js';

import aver from 'softlib/aver.js';

const degreesToRadians = Math.PI / 180;

var D2R = Math.PI / 180, R2D = 180 / Math.PI;

export default class GreatCircleArc {
    constructor(t, a) {
        this.pt1 = t, this.pt2 = a, this.centralAngle = this.determineCentralAngle();
    }
    determineCentralAngle() {
        var t = (this.pt1.lambda - this.pt2.lambda) / 2, a = Math.sin(t), i = a * a, h = (this.pt1.phi - this.pt2.phi) / 2, s = Math.sin(h), e = s * s + Math.cos(this.pt1.phi) * Math.cos(this.pt2.phi) * i, r = Math.sqrt(e), n = 2 * Math.asin(r);
        return n == Math.PI || isNaN(n) ? void 0 : n;
    }
    pointsAlongTheGreatCircle(t) {
        var a = [], i = 1 / (t - 1);
        for (let e = 0; e < t; e++) {
            var h = e * i, s = this.interpolate(h);
            a.push(new ProjectedPoint(s.latitude, s.longitude));
        }
        return a;
    }
    interpolate(t) {
        var a = this.pt1.lambda, i = this.pt1.phi, h = this.pt2.lambda, s = this.pt2.phi, e = this.centralAngle, r = t, n = Math.sin((1 - r) * e) / Math.sin(e), o = Math.sin(r * e) / Math.sin(e), p = n * Math.cos(i) * Math.cos(a) + o * Math.cos(s) * Math.cos(h), l = n * Math.cos(i) * Math.sin(a) + o * Math.cos(s) * Math.sin(h), M = n * Math.sin(i) + o * Math.sin(s), c = R2D * Math.atan2(M, Math.sqrt(Math.pow(p, 2) + Math.pow(l, 2)));
        return {
            longitude: R2D * Math.atan2(l, p),
            latitude: c
        };
    }
}