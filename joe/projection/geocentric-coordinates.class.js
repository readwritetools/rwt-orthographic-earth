/* Copyright (c) 2021 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import ECEF from './earth-centered-earth-fixed.class.js';

const degreesToRadians = Math.PI / 180;

export default class GeocentricCoordinates {
    constructor(t, e, a) {
        this.rwtOrthographicEarth = t, this.earth = e, this.declination = a, this.delta0 = a * degreesToRadians, 
        this.allPointsNeedGeoCoords = !0;
    }
    reflectValues() {}
    setDeclination(t) {
        this.declination = parseFloat(t), this.delta0 = t * degreesToRadians, this.allPointsNeedGeoCoords = !0;
    }
    getDeclination() {
        return this.declination;
    }
    toGeoCoords(t) {
        t.apparentPhi = t.phi, t.apparentLambda = t.lambda;
    }
    toNightCoords(t) {
        var {x: e, y: a, z: i} = ECEF.ll2xyz(t.latitude, t.longitude), {x1: o, y1: r, z1: s} = ECEF.rotateX(e, a, i, this.delta0), {rho: d, theta: n, phi: h} = ECEF.xyz2rtp(o, r, s), l = ECEF.cophi2phi(h);
        t.apparentPhi = l, t.apparentLambda = n;
    }
    inverse(t) {}
}