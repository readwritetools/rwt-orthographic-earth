/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
const degreesToRadians = Math.PI / 180;

export default class ProjectedPoint {
    constructor(t, i) {
        this.latitude = t, this.longitude = i, this.phi = t * degreesToRadians, this.lambda = i * degreesToRadians, 
        this.apparentPhi = this.phi, this.apparentLambda = this.lambda, this.northing = null, 
        this.easting = null, this.isOnNearSide = null, this.projectedTheta = null, this.earthY = null, 
        this.earthX = null, this.canvasY = null, this.canvasX = null, this.isOnCanvas = !0, 
        this.isOnEarth = !0, Object.seal(this);
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
    toGeoCoords(t, i) {
        i.toPhiLambda(this);
    }
    toPlane(t, i) {
        i.toEastingNorthing(this);
    }
    toPixels(t, i) {
        i.toEarthXY(this, !0, !0, !0);
    }
    toViewportCanvas(t, i) {
        i.toCanvasXY(this);
    }
}