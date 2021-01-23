/* Copyright (c) 2021 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import Cursors from './cursors.js';

export default class EarthProxy {
    constructor(t, e) {
        this.rwtOrthographicEarth = t, this.earth = t.earth, this.canvas = e, this.initialLatitude = 0, 
        this.initialLongitude = 0, this.initialMapScale = 10, this.initialTranslationEastWest = 0, 
        this.initialTranslationNorthSouth = 0, this.registerEventListeners();
    }
    registerEventListeners() {
        this.canvas.addEventListener('mouse/hover/ctrlkey', this.noop.bind(this)), this.canvas.addEventListener('mouse/hover/altkey', this.noop.bind(this)), 
        this.canvas.addEventListener('mouse/hover/shiftkey', this.noop.bind(this)), this.canvas.addEventListener('mouse/hover/nokey', this.locateIdentify.bind(this)), 
        this.canvas.addEventListener('gesture/begin/ctrlkey', this.reserved.bind(this)), 
        this.canvas.addEventListener('gesture/begin/altkey', this.beginZoom.bind(this)), 
        this.canvas.addEventListener('gesture/begin/shiftkey', this.beginPan.bind(this)), 
        this.canvas.addEventListener('gesture/begin/nokey', this.beginChangePlaceOfInterest.bind(this)), 
        this.canvas.addEventListener('gesture/tap/ctrlkey', this.noop.bind(this)), this.canvas.addEventListener('gesture/tap/altkey', this.noop.bind(this)), 
        this.canvas.addEventListener('gesture/tap/shiftkey', this.noop.bind(this)), this.canvas.addEventListener('gesture/tap/nokey', this.noop.bind(this)), 
        this.canvas.addEventListener('gesture/doubletap/ctrlkey', this.noop.bind(this)), 
        this.canvas.addEventListener('gesture/doubletap/altkey', this.noop.bind(this)), 
        this.canvas.addEventListener('gesture/doubletap/shiftkey', this.noop.bind(this)), 
        this.canvas.addEventListener('gesture/doubletap/nokey', this.noop.bind(this)), this.canvas.addEventListener('gesture/press/ctrlkey', this.noop.bind(this)), 
        this.canvas.addEventListener('gesture/press/altkey', this.noop.bind(this)), this.canvas.addEventListener('gesture/press/shiftkey', this.noop.bind(this)), 
        this.canvas.addEventListener('gesture/press/nokey', this.changePlaceOfInterest.bind(this)), 
        this.canvas.addEventListener('gesture/track/ctrlkey', this.reserved.bind(this)), 
        this.canvas.addEventListener('gesture/track/altkey', this.zoomScale.bind(this)), 
        this.canvas.addEventListener('gesture/track/shiftkey', this.panSpace.bind(this)), 
        this.canvas.addEventListener('gesture/track/nokey', this.rotateTilt.bind(this)), 
        this.canvas.addEventListener('gesture/spread', this.zoomSpreadGesture.bind(this)), 
        this.canvas.addEventListener('gesture/pinch', this.zoomPinchGesture.bind(this)), 
        this.canvas.addEventListener('gesture/xypan', this.panXYGesture.bind(this)), this.canvas.addEventListener('gesture/horizontalpan', this.panHorizontalGesture.bind(this)), 
        this.canvas.addEventListener('gesture/verticalpan', this.panVerticalGesture.bind(this)), 
        this.canvas.addEventListener('gesture/twofingertap', this.noop.bind(this)), this.canvas.addEventListener('gesture/threefingertap', this.noop.bind(this)), 
        this.canvas.addEventListener('gesture/horizontalflick', this.onGesture), this.canvas.addEventListener('gesture/verticalflick', this.noop.bind(this)), 
        this.canvas.addEventListener('gesture/stationtrack', this.locateIdentify.bind(this)), 
        this.canvas.addEventListener('gesture/twostationtrack', this.noop.bind(this)), this.canvas.addEventListener('gesture/counterclockwise', this.noop.bind(this)), 
        this.canvas.addEventListener('gesture/clockwise', this.noop.bind(this));
    }
    onGesture(t) {}
    captureEarthState() {
        this.initialLatitude = this.earth.getTangentLatitude(), this.initialLongitude = this.earth.getTangentLongitude(), 
        this.initialMapScale = this.earth.getMapScale(), this.initialTranslationEastWest = this.earth.getTranslationEastWest(), 
        this.initialTranslationNorthSouth = this.earth.getTranslationNorthSouth();
    }
    locateIdentify(t) {
        this.rwtOrthographicEarth.broadcastMessage('user/changeCanvasCoords', {
            x: t.detail.x,
            y: t.detail.y
        });
    }
    changePlaceOfInterest(t) {
        this.rwtOrthographicEarth.broadcastMessage('user/changePlaceOfInterest', {
            x: t.detail.x,
            y: t.detail.y
        });
    }
    noop(t) {
        this.canvas.style.cursor = Cursors.standard, this.onGesture(t);
    }
    reserved(t) {
        this.canvas.style.cursor = Cursors.reserved;
    }
    beginZoom(t) {
        this.canvas.style.cursor = Cursors.zoomScale;
    }
    beginPan(t) {
        this.canvas.style.cursor = Cursors.panSpace;
    }
    beginChangePlaceOfInterest(t) {
        this.canvas.style.cursor = Cursors.changePlaceOfInterest;
    }
    zoomScale(t) {
        this.canvas.style.cursor = Cursors.zoomScale;
        var e = t.detail.initialY - t.detail.y, s = this.determineScalingFactor(e, 1), i = e < 0 ? Math.max(this.initialMapScale / s, 1) : Math.min(this.initialMapScale * s, 1e3);
        this.earth.supressCanvasCoords(), this.earth.setMapScale(i), this.rwtOrthographicEarth.explicitMapScale = !0;
    }
    zoomSpreadGesture(t) {
        var e = this.determineScalingFactor(t.detail.deltaDistance, 5), s = Math.max(this.initialMapScale / e, 1);
        this.earth.supressCanvasCoords(), this.earth.setMapScale(s), this.rwtOrthographicEarth.explicitMapScale = !0;
    }
    zoomPinchGesture(t) {
        var e = this.determineScalingFactor(t.detail.deltaDistance, 5), s = Math.min(this.initialMapScale * e, 1e3);
        this.earth.supressCanvasCoords(), this.earth.setMapScale(s), this.rwtOrthographicEarth.explicitMapScale = !0;
    }
    determineScalingFactor(t, e) {
        var s = Math.log(1), i = (Math.log(1e3) - s) / (Math.min(this.earth.canvas.width, this.earth.canvas.height) * e - 1);
        return Math.exp(s + i * (Math.abs(t) - 1));
    }
    panSpace(t) {
        this.canvas.style.cursor = Cursors.panSpace;
        var e = t.detail.x - t.detail.initialX, s = t.detail.y - t.detail.initialY, i = e * this.earth.getMapScale() + this.initialTranslationEastWest, a = s * this.earth.getMapScale() + this.initialTranslationNorthSouth;
        this.earth.supressCanvasCoords(), this.earth.setTranslationEastWest(i), this.earth.setTranslationNorthSouth(a);
    }
    panXYGesture(t) {
        this.panHorizontalGesture(t), this.panVerticalGesture(t);
    }
    panHorizontalGesture(t) {
        var e = t.detail.deltaX;
        'left' == t.detail.directionX && (e *= -1);
        var s = e * this.earth.getMapScale() + this.initialTranslationEastWest;
        this.earth.supressCanvasCoords(), this.earth.setTranslationEastWest(s);
    }
    panVerticalGesture(t) {
        var e = t.detail.deltaY;
        'up' == t.detail.directionY && (e *= -1);
        var s = e * this.earth.getMapScale() + this.initialTranslationNorthSouth;
        this.earth.supressCanvasCoords(), this.earth.setTranslationNorthSouth(s);
    }
    rotateTilt(t) {
        this.canvas.style.cursor = Cursors.rotateTilt, this.earth.supressCanvasCoords();
        var e = t.detail.x - t.detail.initialX, s = t.detail.y - t.detail.initialY, i = 'mouse' == t.detail.pointerType ? 1 : 3, {newLongitude: a, newLatitude: n} = this.latLngFromCanvasDelta(e, s, i);
        this.earth.setTangentLongitude(a), this.earth.setTangentLatitude(n);
    }
    latLngFromCanvasDelta(t, e, s) {
        var i = 2 * this.earth.getVisualizedRadius(), a = t / i * -180 / s, n = this.initialLongitude + a, r = e / i * 180 / s, h = this.initialLatitude + r;
        return h = Math.min(h, 90), {
            newLongitude: n,
            newLatitude: h = Math.max(h, -90)
        };
    }
}