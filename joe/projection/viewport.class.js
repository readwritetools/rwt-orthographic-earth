/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
/* Copyright (c) 2021 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
export default class Viewport {
    constructor(t, e, r) {
        this.rwtOrthographicEarth = t, this.earth = e, this.centerPoint = r;
    }
    reflectValues() {
        this.rwtOrthographicEarth.broadcastMessage('viewport/centerPointX', this.centerPoint.x), 
        this.rwtOrthographicEarth.broadcastMessage('viewport/centerPointY', this.centerPoint.y);
    }
    setCenterPoint(t) {
        var e = parseFloat(t.x), r = parseFloat(t.y);
        this.centerPoint.x = Math.round(e), this.centerPoint.y = Math.round(r), this.allPointsNeedPlacement = !0, 
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
    toCanvas(t) {
        t.canvasX = t.earthX + this.centerPoint.x, t.canvasY = t.earthY + this.centerPoint.y;
    }
    inverseViewport(t) {
        t.earthX = t.canvasX - this.centerPoint.x, t.earthY = t.canvasY - this.centerPoint.y;
    }
}