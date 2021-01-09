/* Copyright (c) 2021 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
const degreesToRadians = Math.PI / 180, radiansToDegrees = 180 / Math.PI;

export default class EarthCenteredEarthFixed {
    constructor() {}
    static ll2rtp(t, a) {
        return {
            rho: 1,
            theta: a * degreesToRadians,
            phi: (90 - t) * degreesToRadians
        };
    }
    static ll2xyz(t, a) {
        var s = (90 - t) * degreesToRadians, r = a * degreesToRadians;
        return {
            x: 1 * Math.sin(s) * Math.cos(r),
            y: 1 * Math.sin(s) * Math.sin(r),
            z: 1 * Math.cos(s)
        };
    }
    static rtp2xyz(t, a, s) {
        return {
            x: t * Math.sin(s) * Math.cos(a),
            y: t * Math.sin(s) * Math.sin(a),
            z: t * Math.cos(s)
        };
    }
    static rtp2ll(t, a, s) {
        Math.sin(s), Math.cos(a), Math.sin(s), Math.sin(a), Math.cos(s);
        return {
            latitude: -1 * (s * radiansToDegrees - 90),
            longitude: a * radiansToDegrees
        };
    }
    static xyz2rtp(t, a, s) {
        return {
            rho: Math.sqrt(t * t + a * a + s * s),
            theta: Math.atan2(a, t),
            phi: Math.atan2(Math.sqrt(t * t + a * a), s)
        };
    }
    static xyz2ll(t, a, s) {
        Math.sqrt(t * t + a * a + s * s);
        var r = Math.atan2(a, t);
        return {
            latitude: -1 * (Math.atan2(Math.sqrt(t * t + a * a), s) * radiansToDegrees - 90),
            longitude: r * radiansToDegrees
        };
    }
    static lat2colat(t) {
        return 90 - t;
    }
    static colat2lat(t) {
        return -1 * (t - 90);
    }
    static phi2cophi(t) {
        return Math.PI / 2 - t;
    }
    static cophi2phi(t) {
        return -1 * (t - Math.PI / 2);
    }
    static rotateX(t, a, s, r) {
        return {
            x1: t,
            y1: a * Math.cos(r) - s * Math.sin(r),
            z1: a * Math.sin(r) + s * Math.cos(r)
        };
    }
    static rotateY(t, a, s, r) {
        return {
            x1: t * Math.cos(r) + s * Math.sin(r),
            y1: a,
            z1: s * Math.cos(r) - t * Math.sin(r)
        };
    }
    static rotateZ(t, a, s, r) {
        return {
            x1: t * Math.cos(r) - a * Math.sin(r),
            y1: t * Math.sin(r) + a * Math.cos(r),
            z1: s
        };
    }
}