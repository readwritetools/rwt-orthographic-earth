/* Copyright (c) 2021 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import ProjectedPoint from './projected-point.class.js';

const degreesToRadians = Math.PI / 180;

var D2R = Math.PI / 180, R2D = 180 / Math.PI;

export default class GreatCircleArc {
    constructor(t, a) {
        this.pt1 = t, this.pt2 = a, this.centralAngle = this.determineCentralAngle(), console.log(`centralAngle ${this.centralAngle}`);
    }
    determineCentralAngle() {
        var t = (this.pt1.lambda - this.pt2.lambda) / 2, a = Math.sin(t), h = a * a, i = (this.pt1.phi - this.pt2.phi) / 2, s = Math.sin(i), e = s * s + Math.cos(this.pt1.phi) * Math.cos(this.pt2.phi) * h, n = Math.sqrt(e), r = 2 * Math.asin(n);
        return r == Math.PI || isNaN(r) ? void 0 : r;
    }
    pointsAlongTheGreatCircle(t) {
        var a = [], h = 1 / (t - 1);
        for (let e = 0; e < t; e++) {
            var i = e * h, s = this.interpolate(i);
            a.push(new ProjectedPoint(s.latitude, s.longitude));
        }
        return a;
    }
    interpolate(t) {
        var a = this.pt1.lambda, h = this.pt1.phi, i = this.pt2.lambda, s = this.pt2.phi, e = this.centralAngle, n = t, r = Math.sin((1 - n) * e) / Math.sin(e), o = Math.sin(n * e) / Math.sin(e), l = r * Math.cos(h) * Math.cos(a) + o * Math.cos(s) * Math.cos(i), M = r * Math.cos(h) * Math.sin(a) + o * Math.cos(s) * Math.sin(i), p = r * Math.sin(h) + o * Math.sin(s), c = R2D * Math.atan2(p, Math.sqrt(Math.pow(l, 2) + Math.pow(M, 2)));
        return {
            longitude: R2D * Math.atan2(M, l),
            latitude: c
        };
    }
}