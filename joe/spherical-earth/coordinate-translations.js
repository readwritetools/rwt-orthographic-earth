/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
const degreesToRadians = Math.PI / 180, radiansToDegrees = 180 / Math.PI, EARTH_RADIUS = 6371;

export function ll2rtp(t, a) {
    return {
        rho: 1,
        theta: a * degreesToRadians,
        phi: (90 - t) * degreesToRadians
    };
}

export function ll2xyz(t, a) {
    var n = (90 - t) * degreesToRadians, r = a * degreesToRadians;
    return {
        x: 1 * Math.sin(n) * Math.cos(r),
        y: 1 * Math.sin(n) * Math.sin(r),
        z: 1 * Math.cos(n)
    };
}

export function rtp2xyz(t, a, n) {
    return {
        x: t * Math.sin(n) * Math.cos(a),
        y: t * Math.sin(n) * Math.sin(a),
        z: t * Math.cos(n)
    };
}

export function rtp2ll(t, a, n) {
    Math.sin(n), Math.cos(a), Math.sin(n), Math.sin(a), Math.cos(n);
    return {
        latitude: -1 * (n * radiansToDegrees - 90),
        longitude: a * radiansToDegrees
    };
}

export function xyz2rtp(t, a, n) {
    return {
        rho: Math.sqrt(t * t + a * a + n * n),
        theta: Math.atan2(a, t),
        phi: Math.atan2(Math.sqrt(t * t + a * a), n)
    };
}

export function xyz2ll(t, a, n) {
    Math.sqrt(t * t + a * a + n * n);
    var r = Math.atan2(a, t);
    return {
        latitude: -1 * (Math.atan2(Math.sqrt(t * t + a * a), n) * radiansToDegrees - 90),
        longitude: r * radiansToDegrees
    };
}

export function lat2colat(t) {
    return 90 - t;
}

export function colat2lat(t) {
    return -1 * (t - 90);
}

export function phi2cophi(t) {
    return Math.PI / 2 - t;
}

export function cophi2phi(t) {
    return -1 * (t - Math.PI / 2);
}

export function rotateX(t, a, n, r) {
    return {
        x1: t,
        y1: a * Math.cos(r) - n * Math.sin(r),
        z1: a * Math.sin(r) + n * Math.cos(r)
    };
}

export function rotateY(t, a, n, r) {
    return {
        x1: t * Math.cos(r) + n * Math.sin(r),
        y1: a,
        z1: n * Math.cos(r) - t * Math.sin(r)
    };
}

export function rotateZ(t, a, n, r) {
    return {
        x1: t * Math.cos(r) - a * Math.sin(r),
        y1: t * Math.sin(r) + a * Math.cos(r),
        z1: n
    };
}