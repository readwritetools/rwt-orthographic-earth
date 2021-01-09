/* Copyright (c) 2021 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
const degreesToRadians = Math.PI / 180;

export default class CartesianTransformation {
    constructor(t, a, r, s, e) {
        this.rwtOrthographicEarth = t, this.earth = a, this.translate = {}, this.translate.a = parseInt(r), 
        this.translate.b = parseInt(s), this.mapScale = e, this.multiplier = 1 / e, this.allPointsNeedTransformation = !0;
    }
    reflectValues() {
        this.rwtOrthographicEarth.broadcastMessage('carte/translationEastWest', this.translate.a), 
        this.rwtOrthographicEarth.broadcastMessage('carte/translationNorthSouth', this.translate.b), 
        this.rwtOrthographicEarth.broadcastMessage('carte/mapScale', this.mapScale);
    }
    setTranslation(t, a) {
        this.translate.a = parseInt(t), this.translate.b = parseInt(a), this.allPointsNeedTransformation = !0, 
        this.rwtOrthographicEarth.broadcastMessage('carte/translationEastWest', this.translate.a), 
        this.rwtOrthographicEarth.broadcastMessage('carte/translationNorthSouth', this.translate.b);
    }
    setTranslationEastWest(t) {
        this.translate.a = parseInt(t), this.allPointsNeedTransformation = !0, this.rwtOrthographicEarth.broadcastMessage('carte/translationEastWest', this.translate.a);
    }
    setTranslationNorthSouth(t) {
        this.translate.b = parseInt(t), this.allPointsNeedTransformation = !0, this.rwtOrthographicEarth.broadcastMessage('carte/translationNorthSouth', this.translate.b);
    }
    getTranslation() {
        return this.translate;
    }
    getTranslationEastWest() {
        return this.translate.a;
    }
    getTranslationNorthSouth() {
        return this.translate.b;
    }
    setMultiplier(t) {
        (t = parseFloat(t)) < 0 || isNaN(t) || (this.multiplier = t, this.mapScale = 1 / t, 
        this.allPointsNeedTransformation = !0, this.rwtOrthographicEarth.broadcastMessage('carte/mapScale', this.mapScale));
    }
    getMultiplier() {
        return this.multiplier;
    }
    setMapScale(t) {
        return t = parseFloat(t), isNaN(t) ? 1 : t < .001 ? .001 : t > 1e4 ? 1e4 : (this.mapScale = t, 
        this.multiplier = 1 / t, this.allPointsNeedTransformation = !0, void this.rwtOrthographicEarth.broadcastMessage('carte/mapScale', this.mapScale));
    }
    getMapScale() {
        return this.mapScale;
    }
    toPixels(t, a, r, s) {
        var e = t.easting, i = t.northing;
        t.projectedTheta = Math.atan2(i, e), t.projectedTheta < 0 && (t.projectedTheta = 2 * Math.PI + t.projectedTheta), 
        r && (e += this.translate.a, i += this.translate.b), s && (e *= this.multiplier, 
        i *= this.multiplier), t.earthX = Math.round(e), t.earthY = Math.round(i);
    }
    kilometers_per_pixel() {
        return 1 / this.multiplier;
    }
    inverseTransformation(t) {
        var a = t.earthX, r = t.earthY;
        a /= this.multiplier, r /= this.multiplier, a -= this.translate.a, r -= this.translate.b, 
        t.easting = a, t.northing = r;
    }
}