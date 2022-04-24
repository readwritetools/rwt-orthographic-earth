/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import expect from '../dev/expect.js';

export default class Viewport {
    constructor(t, e, a) {
        this.rwtOrthographicEarth = t, this.earth = e, this.centerPoint = a, this.canvasWidth = 0, 
        this.canvasHeight = 0, this.allPointsNeedPlacement = !0, Object.seal(this);
    }
    reflectValues() {
        this.rwtOrthographicEarth.broadcastMessage('viewport/centerPointX', this.centerPoint.x), 
        this.rwtOrthographicEarth.broadcastMessage('viewport/centerPointY', this.centerPoint.y);
    }
    syncCanvasDimensions(t, e) {
        expect(t, 'Number'), expect(e, 'Number'), this.canvasWidth = t, this.canvasHeight = e;
    }
    getCanvasWidth() {
        return this.canvasWidth;
    }
    getCanvasHeight() {
        return this.canvasHeight;
    }
    setCenterPoint(t) {
        var e = parseFloat(t.x), a = parseFloat(t.y);
        this.centerPoint.x = Math.round(e), this.centerPoint.y = Math.round(a), this.allPointsNeedPlacement = !0, 
        this.rwtOrthographicEarth.broadcastMessage('viewport/centerPointX', this.centerPoint.x), 
        this.rwtOrthographicEarth.broadcastMessage('viewport/centerPointY', this.centerPoint.y);
    }
    setCenterPointX(t) {
        var e = parseFloat(t);
        this.centerPoint.x = Math.round(e), this.allPointsNeedPlacement = !0, this.rwtOrthographicEarth.broadcastMessage('viewport/centerPointX', this.centerPoint.x);
    }
    setCenterPointY(t) {
        var e = parseFloat(t);
        this.centerPoint.y = Math.round(e), this.allPointsNeedPlacement = !0, this.rwtOrthographicEarth.broadcastMessage('viewport/centerPointY', this.centerPoint.y);
    }
    getCenterPoint() {
        return this.centerPoint;
    }
    getCenterPointX() {
        return this.centerPoint.x;
    }
    getCenterPointY() {
        return this.centerPoint.y;
    }
    toCanvasXY(t) {
        t.canvasX = t.earthX + this.centerPoint.x, t.canvasY = t.earthY + this.centerPoint.y, 
        t.canvasX < 0 || t.canvasX > this.canvasWidth || t.canvasY < 0 || t.canvasY > this.canvasHeight ? t.isOnCanvas = !1 : t.isOnCanvas = !0;
    }
    inverseViewport(t) {
        t.earthX = t.canvasX - this.centerPoint.x, t.earthY = t.canvasY - this.centerPoint.y;
    }
}