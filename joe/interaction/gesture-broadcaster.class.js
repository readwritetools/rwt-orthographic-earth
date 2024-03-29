/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import FingerPointer from './finger-pointer.class.js';

const Static = {
    intermediateThrottle: 30,
    tapThreshold: 500,
    doubleTapThreshold: 1e3,
    stationTrackThreshold: 1e3,
    flickThreshold: 500,
    flickDistance: 100,
    pinchSpreadDistance: 20,
    panDistance: 20,
    tandemDistance: 30,
    sweepThreshold: 30
};

Object.seal(Static);

export default class GestureBroadcaster {
    constructor(t) {
        this.canvas = t, this.fingerPointers = [], this.mostRecentTap = 0, this.mostRecentIntermediate = 0;
    }
    get fingerCount() {
        return this.fingerPointers.length;
    }
    get stationaryCount() {
        var t = 0;
        for (let e = 0; e < this.fingerPointers.length; e++) this.fingerPointers[e].isStationary() && t++;
        return t;
    }
    get travelerCount() {
        var t = 0;
        for (let e = 0; e < this.fingerPointers.length; e++) this.fingerPointers[e].isTraveler() && t++;
        return t;
    }
    getStationary() {
        for (let t = 0; t < this.fingerPointers.length; t++) if (this.fingerPointers[t].isStationary()) return this.fingerPointers[t];
        return null;
    }
    getSecondStationary() {
        var t = 0;
        for (let e = 0; e < this.fingerPointers.length; e++) if (this.fingerPointers[e].isStationary()) {
            if (0 != t) return this.fingerPointers[e];
            t = 1;
        }
        return null;
    }
    getTraveler() {
        for (let t = 0; t < this.fingerPointers.length; t++) if (this.fingerPointers[t].isTraveler()) return this.fingerPointers[t];
        return null;
    }
    getSecondTraveler() {
        var t = 0;
        for (let e = 0; e < this.fingerPointers.length; e++) if (this.fingerPointers[e].isTraveler()) {
            if (0 != t) return this.fingerPointers[e];
            t = 1;
        }
        return null;
    }
    removeOutstandingFingers() {
        this.fingerPointers = [];
    }
    getPointerById(t) {
        for (let e = 0; e < this.fingerPointers.length; e++) if (this.fingerPointers[e].pointerId == t) return this.fingerPointers[e];
        return null;
    }
    addFinger(t) {
        this.fingerPointers.push(new FingerPointer(t));
    }
    removeFinger(t) {
        for (let e = 0; e < this.fingerPointers.length; e++) if (this.fingerPointers[e].pointerId == t.pointerId) return void this.fingerPointers.splice(e, 1);
    }
    updateFinger(t) {
        var e = this.getPointerById(t.pointerId);
        null != e && e.calculateLatest(t);
    }
    cancelFingers(t) {
        this.removeOutstandingFingers(), this.mostRecentTap = 0, this.mostRecentIntermediate = 0;
    }
    broadcastGesture(t, e) {
        var i = new CustomEvent(t, {
            detail: {
                pointerType: this.fingerPointers[0].pointerType,
                ...e,
                fingerPointers: this.fingerPointers
            }
        });
        this.canvas.dispatchEvent(i);
    }
    sendInitialGesture() {
        if (1 == this.stationaryCount && 0 == this.travelerCount) {
            var t = this.getStationary();
            t.leftButtonDown ? t.ctrlKey ? this.broadcastGesture('gesture/begin/ctrlkey', {
                pointerId: t.pointerId,
                initialX: t.initial.x,
                initialY: t.initial.y
            }) : t.altKey ? this.broadcastGesture('gesture/begin/altkey', {
                pointerId: t.pointerId,
                initialX: t.initial.x,
                initialY: t.initial.y
            }) : t.shiftKey ? this.broadcastGesture('gesture/begin/shiftkey', {
                pointerId: t.pointerId,
                initialX: t.initial.x,
                initialY: t.initial.y
            }) : this.broadcastGesture('gesture/begin/nokey', {
                pointerId: t.pointerId,
                initialX: t.initial.x,
                initialY: t.initial.y
            }) : this.broadcastGesture('gesture/begin/nokey', {
                pointerId: t.pointerId,
                initialX: t.initial.x,
                initialY: t.initial.y
            });
        }
    }
    sendIntermediateGesture() {
        if (!(Date.now() - this.mostRecentIntermediate < Static.intermediateThrottle)) {
            if (this.mostRecentIntermediate = Date.now(), 0 == this.stationaryCount && 1 == this.travelerCount) if ((t = this.getTraveler()).leftButtonDown) return void (t.ctrlKey ? this.broadcastGesture('gesture/track/ctrlkey', {
                pointerId: t.pointerId,
                initialX: t.initial.x,
                initialY: t.initial.y,
                x: t.latest.x,
                y: t.latest.y
            }) : t.altKey ? this.broadcastGesture('gesture/track/altkey', {
                pointerId: t.pointerId,
                initialX: t.initial.x,
                initialY: t.initial.y,
                x: t.latest.x,
                y: t.latest.y
            }) : t.shiftKey ? this.broadcastGesture('gesture/track/shiftkey', {
                pointerId: t.pointerId,
                initialX: t.initial.x,
                initialY: t.initial.y,
                x: t.latest.x,
                y: t.latest.y
            }) : this.broadcastGesture('gesture/track/nokey', {
                pointerId: t.pointerId,
                initialX: t.initial.x,
                initialY: t.initial.y,
                x: t.latest.x,
                y: t.latest.y
            }));
            if (1 == this.stationaryCount && 1 == this.travelerCount && this.getStationary().deltaT > Static.stationTrackThreshold) {
                var t = this.getTraveler();
                this.broadcastGesture('gesture/stationtrack', {
                    pointerId: t.pointerId,
                    x: t.latest.x,
                    y: t.latest.y
                });
            } else if (2 == this.stationaryCount && 1 == this.travelerCount && this.getStationary().deltaT > Static.stationTrackThreshold) {
                t = this.getTraveler();
                this.broadcastGesture('gesture/twostationtrack', {
                    pointerId: t.pointerId,
                    x: t.latest.x,
                    y: t.latest.y
                });
            } else if (2 == this.fingerCount) {
                var e = this.fingerPointers[0], i = this.fingerPointers[1], r = e.initial.y - i.initial.y, a = e.initial.x - i.initial.x, s = Math.hypot(r, a), n = 180 - 180 * Math.atan2(r, a) / Math.PI;
                n < 0 && (n += 180);
                var l = e.latest.y - i.latest.y, o = e.latest.x - i.latest.x, h = Math.hypot(l, o), d = 180 - 180 * Math.atan2(l, o) / Math.PI;
                d < 0 && (d += 180);
                var c = Math.abs(n - d);
                if (c > Static.sweepThreshold) return n < d ? void this.broadcastGesture('gesture/counterclockwise', {
                    deltaSweep: c,
                    initialAngle: n,
                    latestAngle: d
                }) : void this.broadcastGesture('gesture/clockwise', {
                    deltaSweep: c,
                    initialAngle: n,
                    latestAngle: d
                });
                var u = Math.abs(h - s);
                if (u < Static.tandemDistance) {
                    if (e.deltaXY > Static.panDistance && i.deltaXY > Static.panDistance) return void this.broadcastGesture('gesture/xypan', {
                        deltaX: (e.deltaX + i.deltaX) / 2,
                        directionX: e.directionX,
                        deltaY: (e.deltaY + i.deltaY) / 2,
                        directionY: e.directionY
                    });
                    if (e.deltaX > Static.panDistance && i.deltaX > Static.panDistance) return void this.broadcastGesture('gesture/horizontalpan', {
                        deltaX: (e.deltaX + i.deltaX) / 2,
                        directionX: e.directionX
                    });
                    if (e.deltaY > Static.panDistance && i.deltaY > Static.panDistance) return void this.broadcastGesture('gesture/verticalpan', {
                        deltaY: (e.deltaY + i.deltaY) / 2,
                        directionY: e.directionY
                    });
                }
                if (u > Static.pinchSpreadDistance) return h > s ? void this.broadcastGesture('gesture/spread', {
                    deltaDistance: u
                }) : void this.broadcastGesture('gesture/pinch', {
                    deltaDistance: u
                });
            }
        }
    }
    sendFinalGesture() {
        if (1 == this.fingerCount) {
            var t = this.fingerPointers[0];
            t.isStationary() ? t.deltaT < Static.tapThreshold ? Date.now() - this.mostRecentTap < Static.doubleTapThreshold ? (this.mostRecentTap = 0, 
            t.ctrlKey ? this.broadcastGesture('gesture/doubletap/ctrlkey', {
                x: t.latest.x,
                y: t.latest.y
            }) : t.altKey ? this.broadcastGesture('gesture/doubletap/altkey', {
                x: t.latest.x,
                y: t.latest.y
            }) : t.shiftKey ? this.broadcastGesture('gesture/doubletap/shiftkey', {
                x: t.latest.x,
                y: t.latest.y
            }) : this.broadcastGesture('gesture/doubletap/nokey', {
                x: t.latest.x,
                y: t.latest.y
            })) : (this.mostRecentTap = Date.now(), t.ctrlKey ? this.broadcastGesture('gesture/tap/ctrlkey', {
                x: t.latest.x,
                y: t.latest.y
            }) : t.altKey ? this.broadcastGesture('gesture/tap/altkey', {
                x: t.latest.x,
                y: t.latest.y
            }) : t.shiftKey ? this.broadcastGesture('gesture/tap/shiftkey', {
                x: t.latest.x,
                y: t.latest.y
            }) : this.broadcastGesture('gesture/tap/nokey', {
                x: t.latest.x,
                y: t.latest.y
            })) : t.ctrlKey ? this.broadcastGesture('gesture/press/ctrlkey', {
                x: t.latest.x,
                y: t.latest.y
            }) : t.altKey ? this.broadcastGesture('gesture/press/altkey', {
                x: t.latest.x,
                y: t.latest.y
            }) : t.shiftKey ? this.broadcastGesture('gesture/press/shiftkey', {
                x: t.latest.x,
                y: t.latest.y
            }) : this.broadcastGesture('gesture/press/nokey', {
                x: t.latest.x,
                y: t.latest.y
            }) : t.deltaT < Static.flickThreshold && t.deltaXY > Static.flickDistance && (t.deltaX > t.deltaY ? this.broadcastGesture('gesture/horizontalflick', {
                deltaX: t.deltaX,
                directionX: t.directionX
            }) : this.broadcastGesture('gesture/verticalflick', {
                deltaY: t.deltaY,
                directionY: t.directionY
            }));
        } else if (2 == this.fingerCount) {
            var e = this.fingerPointers[0], i = this.fingerPointers[1];
            e.isStationary() && i.isStationary() && e.deltaT < Static.tapThreshold && i.deltaT < Static.tapThreshold && this.broadcastGesture('gesture/twofingertap', {
                x: e.latest.x,
                y: e.latest.y
            });
        } else if (3 == this.fingerCount) {
            e = this.fingerPointers[0], i = this.fingerPointers[1];
            var r = this.fingerPointers[2];
            e.isStationary() && i.isStationary() && r.isStationary() && e.deltaT < Static.tapThreshold && i.deltaT < Static.tapThreshold && r.deltaT < Static.tapThreshold && this.broadcastGesture('gesture/threefingertap', {
                x: e.latest.x,
                y: e.latest.y
            });
        }
        this.removeOutstandingFingers();
    }
}