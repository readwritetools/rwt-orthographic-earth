/* Copyright (c) 2021 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
const degreesToRadians = Math.PI / 180;

export default class OrthographicProjection {
    constructor(t, i, a, s, h) {
        this.rwtOrthographicEarth = t, this.earth = i, this.latitude0 = a, this.longitude0 = s, 
        this.phi0 = a * degreesToRadians, this.lambda0 = s * degreesToRadians, this.radius = h, 
        this.allPointsNeedProjection = !0, this.cos_phi0 = Math.cos(this.phi0), this.sin_phi0 = Math.sin(this.phi0);
    }
    reflectValues() {
        this.rwtOrthographicEarth.broadcastMessage('ortho/tangentLatitude', this.latitude0), 
        this.rwtOrthographicEarth.broadcastMessage('ortho/tangentLongitude', this.longitude0);
    }
    setTangentLatitude(t) {
        this.latitude0 = parseFloat(t), this.phi0 = t * degreesToRadians, this.allPointsNeedProjection = !0, 
        this.cos_phi0 = Math.cos(this.phi0), this.sin_phi0 = Math.sin(this.phi0), this.rwtOrthographicEarth.broadcastMessage('ortho/tangentLatitude', this.latitude0);
    }
    setTangentLongitude(t) {
        this.longitude0 = parseFloat(t), this.lambda0 = t * degreesToRadians, this.allPointsNeedProjection = !0, 
        this.rwtOrthographicEarth.broadcastMessage('ortho/tangentLongitude', this.longitude0);
    }
    toPlane(t) {
        t.easting = this.radius * Math.cos(t.phi) * Math.sin(t.lambda - this.lambda0), t.northing = -1 * this.radius * (this.cos_phi0 * Math.sin(t.phi) - this.sin_phi0 * Math.cos(t.phi) * Math.cos(t.lambda - this.lambda0));
        var i = this.sin_phi0 * Math.sin(t.phi) + this.cos_phi0 * Math.cos(t.phi) * Math.cos(t.lambda - this.lambda0);
        t.visible = i >= 0;
    }
    toNightPlane(t, i) {
        var a = Math.cos(this.phi0), s = Math.sin(this.phi0), h = this.lambda0 + i;
        t.easting = this.radius * Math.cos(t.apparentPhi) * Math.sin(t.apparentLambda - h), 
        t.northing = -1 * this.radius * (a * Math.sin(t.apparentPhi) - s * Math.cos(t.apparentPhi) * Math.cos(t.apparentLambda - h));
        var e = s * Math.sin(t.apparentPhi) + a * Math.cos(t.apparentPhi) * Math.cos(t.apparentLambda - h);
        t.visible = e >= 0;
    }
    inverseProjection(t) {
        var i = t.easting, a = -1 * t.northing;
        if (0 == i && 0 == a) return t.isOnEarth = !0, t.phi = 0, t.latitude = 0, t.lambda = 0, 
        void (t.longitude = 0);
        var s = i * i, h = a * a, e = Math.sqrt(s + h);
        if (e > this.radius) return t.isOnEarth = !1, t.phi = null, t.latitude = null, t.lambda = null, 
        void (t.longitude = null);
        t.isOnEarth = !0;
        var n = Math.asin(e / this.radius), o = Math.sin(n), r = Math.cos(n), d = a * o * this.cos_phi0;
        t.phi = Math.asin(r * this.sin_phi0 + d / e), t.latitude = t.phi / degreesToRadians;
        d = i * o;
        var l = e * this.cos_phi0 * r - a * this.sin_phi0 * o;
        t.lambda = this.lambda0 + Math.atan2(d, l), t.longitude = t.lambda / degreesToRadians, 
        t.longitude > 180 && (t.longitude -= 360), t.longitude < -180 && (t.longitude += 360);
    }
}