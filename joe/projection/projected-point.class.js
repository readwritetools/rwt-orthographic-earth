/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
/* Copyright (c) 2021 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
const degreesToRadians = Math.PI / 180;

export default class ProjectedPoint {
    constructor(t, i) {
        this.latitude = t, this.longitude = i, this.phi = t * degreesToRadians, this.lambda = i * degreesToRadians, 
        this.apparentPhi = this.phi, this.apparentLambda = this.lambda, this.northing = null, 
        this.easting = null, this.visible = null, this.projectedTheta = null, this.earthY = null, 
        this.earthX = null, this.canvasY = null, this.canvasX = null, this.isOnEarth = !0;
    }
    setLatitude(t) {
        this.latitude = t, this.phi = t * degreesToRadians, this.apparentPhi = this.phi;
    }
    setLongitude(t) {
        this.longitude = t, this.lambda = t * degreesToRadians, this.apparentLambda = this.lambda;
    }
    setPhi(t) {
        this.phi = t, this.latitude = t / degreesToRadians, this.apparentPhi = this.phi;
    }
    setLambda(t) {
        this.lambda = t, this.longitude = t / degreesToRadians, this.apparentLambda = this.lambda;
    }
    toGeoCoords(t) {
        t.toGeoCoords(this);
    }
    toPlane(t) {
        t.toPlane(this);
    }
    toPixels(t) {
        t.toPixels(this, !0, !0, !0);
    }
    toCanvas(t) {
        t.toCanvas(this);
    }
}