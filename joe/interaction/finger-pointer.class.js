/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
export default class FingerPointer {
    constructor(t) {
        this.pointerId = t.pointerId, this.pointerType = t.pointerType, this.epsilonX = t.width, 
        this.epsilonY = t.height, this.initial = {
            x: t.offsetX,
            y: t.offsetY,
            t: Date.now()
        }, this.latest = {
            x: t.offsetX,
            y: t.offsetY,
            t: Date.now()
        }, this.deltaT = 0, this.deltaX = 0, this.deltaY = 0, this.deltaXY = 0, this.directionX = '', 
        this.directionY = '', null == t.buttons ? (this.leftButtonDown = !1, this.wheelButtonDown = !1, 
        this.rightButtonDown = !1) : (this.leftButtonDown = !!(1 & t.buttons), this.rightButtonDown = !!(2 & t.buttons), 
        this.wheelButtonDown = !!(4 & t.buttons)), this.ctrlKey = !!t.ctrlKey, this.altKey = !!t.altKey, 
        this.shiftKey = !!t.shiftKey;
    }
    isStationary() {
        return Math.abs(this.initial.x - this.latest.x) < this.epsilonX && Math.abs(this.initial.y - this.latest.y) < this.epsilonY;
    }
    isTraveler() {
        return !(Math.abs(this.initial.x - this.latest.x) < this.epsilonX && Math.abs(this.initial.y - this.latest.y) < this.epsilonY);
    }
    calculateLatest(t) {
        this.latest.x = t.offsetX, this.latest.y = t.offsetY, this.latest.t = Date.now(), 
        this.deltaT = this.latest.t - this.initial.t, this.deltaX = Math.abs(this.latest.x - this.initial.x), 
        this.deltaY = Math.abs(this.latest.y - this.initial.y), this.deltaXY = Math.hypot(this.deltaX, this.deltaY), 
        this.directionX = this.latest.x - this.initial.x >= 0 ? 'right' : 'left', this.directionY = this.latest.y - this.initial.y >= 0 ? 'down' : 'up';
    }
}