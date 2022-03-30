/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import * as ct from './coordinate-translations.js';

import aver from 'softlib/aver.js';

const π = Math.PI, degreesToRadians = Math.PI / 180, radiansToDegrees = 180 / Math.PI, EARTH_RADIUS = 6371;

export function interiorAngle(t, a, e, n) {
    const i = t * degreesToRadians, s = e * degreesToRadians, r = (n - a) * degreesToRadians, o = Math.sin(r) * Math.cos(s), d = Math.cos(i) * Math.sin(s) - Math.sin(i) * Math.cos(s) * Math.cos(r);
    return Math.atan2(o, d);
}

export function lengthOfArc(t, a, e, n) {
    const i = t * degreesToRadians, s = e * degreesToRadians, r = (e - t) * degreesToRadians, o = (n - a) * degreesToRadians, d = Math.sin(r / 2) * Math.sin(r / 2) + Math.cos(i) * Math.cos(s) * Math.sin(o / 2) * Math.sin(o / 2);
    return 2 * Math.asin(Math.sqrt(d));
}

export function sphericalExcess(t, a, e, n, i, s) {
    var r = lengthOfArc(e, n, i, s), o = lengthOfArc(i, s, t, a), d = lengthOfArc(t, a, e, n), l = (r + o + d) / 2;
    return Math.sqrt(l * (l - r) * (l - o) * (l - d));
}

export function triangularArea(t, a, e, n, i, s) {
    return sphericalExcess(t, a, e, n, i, s) * 6371 ** 2;
}

export function centroidOfEquilateralTriangle(t, a, e, n, i, s) {
    const {x: r, y: o, z: d} = ct.ll2xyz(t, a), {x: l, y: h, z: c} = ct.ll2xyz(e, n), {x: M, y: u, z: g} = ct.ll2xyz(i, s), T = (r + l + M) / 3, p = (o + h + u) / 3, x = (d + c + g) / 3, f = Math.sqrt(T ** 2 + p ** 2 + x ** 2), R = T / f, A = p / f, y = x / f, {latitude: z, longitude: v} = ct.xyz2ll(R, A, y);
    return {
        latitude: z,
        longitude: v
    };
}

export function sphericalMidpoint(t, a, e, n) {
    const {x: i, y: s, z: r} = ct.ll2xyz(t, a), {x: o, y: d, z: l} = ct.ll2xyz(e, n), h = (i + o) / 2, c = (s + d) / 2, M = (r + l) / 2, u = Math.sqrt(h ** 2 + c ** 2 + M ** 2), g = h / u, T = c / u, p = M / u, x = ct.xyz2ll(g, T, p), f = sphericalMidpointAlt(t, a, e, n), R = JSON.stringify(x.latitude.toFixed(6) + ',' + x.longitude.toFixed(6)), A = JSON.stringify(f.latitude.toFixed(6) + ',' + f.longitude.toFixed(6));
    return R != A && console.log(`sphericalMidpoint mismatch ${R} ${A}`), {
        latitude: x.latitude,
        longitude: x.longitude
    };
}

export function haversine(t, a, e, n) {
    const i = t * degreesToRadians, s = e * degreesToRadians, r = (e - t) * degreesToRadians, o = (n - a) * degreesToRadians, d = Math.sin(r / 2) * Math.sin(r / 2) + Math.cos(i) * Math.cos(s) * Math.sin(o / 2) * Math.sin(o / 2);
    return 6371 * (2 * Math.atan2(Math.sqrt(d), Math.sqrt(1 - d)));
}

export function bearing(t, a, e, n) {
    const i = t * degreesToRadians, s = e * degreesToRadians, r = a * degreesToRadians, o = n * degreesToRadians, d = (n - a) * degreesToRadians, l = Math.sin(o - r) * Math.cos(s), h = Math.cos(i) * Math.sin(s) - Math.sin(i) * Math.cos(s) * Math.cos(d);
    return (Math.atan2(l, h) * radiansToDegrees + 360) % 360;
}

export function sphericalMidpointAlt(t, a, e, n) {
    const i = t * degreesToRadians, s = e * degreesToRadians, r = a * degreesToRadians, o = n * degreesToRadians, d = Math.cos(s) * Math.cos(o - r), l = Math.cos(s) * Math.sin(o - r), h = Math.atan2(Math.sin(i) + Math.sin(s), Math.sqrt((Math.cos(i) + d) * (Math.cos(i) + d) + l * l));
    var c = (r + Math.atan2(l, Math.cos(i) + d)) * radiansToDegrees;
    return -180 == (c = (c + 540) % 360 - 180) && (c = 180), {
        latitude: h * radiansToDegrees,
        longitude: c
    };
}

export function sphericalIntermediatePoint(t, a, e, n, i) {
    if (t + e == 0) return null;
    if (Math.abs(n - a) == Math.PI) return null;
    if (i < 0 || i > 1) return null;
    const s = t * degreesToRadians, r = e * degreesToRadians, o = a * degreesToRadians, d = n * degreesToRadians, l = lengthOfArc(t, a, e, n), h = Math.sin((1 - i) * l) / Math.sin(l), c = Math.sin(i * l) / Math.sin(l), M = h * Math.cos(s) * Math.cos(o) + c * Math.cos(r) * Math.cos(d), u = h * Math.cos(s) * Math.sin(o) + c * Math.cos(r) * Math.sin(d), g = h * Math.sin(s) + c * Math.sin(r), T = Math.atan2(g, Math.sqrt(M ** 2 + u ** 2));
    var p = Math.atan2(u, M) * radiansToDegrees;
    return {
        latitude: T * radiansToDegrees,
        longitude: p = (p + 540) % 360 - 180
    };
}

export function sphericalFinalPoint(t, a, e, n) {
    const i = t * degreesToRadians, s = a * degreesToRadians, r = e, o = n / 6371, d = Math.asin(Math.sin(i) * Math.cos(o) + Math.cos(i) * Math.sin(o) * Math.cos(r));
    var l = (s + Math.atan2(Math.sin(r) * Math.sin(o) * Math.cos(i), Math.cos(o) - Math.sin(i) * Math.sin(d))) * radiansToDegrees;
    return {
        latitude: d * radiansToDegrees,
        longitude: l = (l + 540) % 360 - 180
    };
}

export function antipode(t, a) {
    return {
        latitude: -t,
        longitude: a > 0 ? a - 180 : a + 180
    };
}

export function greatCircleArc(t, a, e, n, i, s) {
    var r = [];
    for (let d = 0; d < i; d++) {
        var o = sphericalIntermediatePoint(t, a, e, n, 1 == s ? d / (i - 1) : d / i);
        null != o && r.push(o);
    }
    return r;
}

export function greatCirclePoints(t, a, e, n, i) {
    const s = {
        latitude: t,
        longitude: a
    }, r = {
        latitude: e,
        longitude: n
    };
    var o = antipode(s.latitude, s.longitude), d = antipode(r.latitude, r.longitude), l = i / 2, h = lengthOfArc(s.latitude, s.longitude, r.latitude, r.longitude) / Math.PI, c = Math.round(l * h), M = l - c, u = greatCircleArc(s.latitude, s.longitude, r.latitude, r.longitude, c, !1), g = greatCircleArc(r.latitude, r.longitude, o.latitude, o.longitude, M, !1), T = greatCircleArc(o.latitude, o.longitude, d.latitude, d.longitude, c, !1), p = greatCircleArc(d.latitude, d.longitude, s.latitude, s.longitude, M, !1);
    return u.concat(g, T, p, [ s ]);
}