/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import * as ECEF from '../spherical-earth/coordinate-translations.js';

const degreesToRadians = Math.PI / 180;

export default class GeocentricCoordinates {
    constructor(t, a, e) {
        this.rwtOrthographicEarth = t, this.earth = a, this.declination = e, this.delta0 = e * degreesToRadians, 
        this.allPointsNeedGeoCoords = !0, Object.seal(this);
    }
    reflectValues() {}
    setDeclination(t) {
        this.declination = parseFloat(t), this.delta0 = t * degreesToRadians, this.allPointsNeedGeoCoords = !0;
    }
    getDeclination() {
        return this.declination;
    }
    toPhiLambda(t) {
        t.apparentPhi = t.phi, t.apparentLambda = t.lambda;
    }
    toNightPhiLambda(t) {
        var {x: a, y: e, z: i} = ECEF.ll2xyz(t.latitude, t.longitude), {x1: o, y1: s, z1: r} = ECEF.rotateX(a, e, i, this.delta0), {rho: h, theta: n, phi: d} = ECEF.xyz2rtp(o, s, r), l = ECEF.cophi2phi(d);
        t.apparentPhi = l, t.apparentLambda = n;
    }
    inverse(t) {}
}