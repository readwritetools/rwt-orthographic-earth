/* Copyright (c) 2021 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import Gestures from './gestures.class.js';

import EarthProxy from './earth-proxy.class.js';

export default class InteractionHandler {
    constructor(e, t) {
        this.canvas = t, this.earthProxy = new EarthProxy(e, t), this.gestures = new Gestures(t), 
        this.registerEventListeners();
    }
    registerEventListeners() {
        this.canvas.addEventListener('pointerdown', this.onDown.bind(this)), this.canvas.addEventListener('pointermove', this.onMove.bind(this)), 
        this.canvas.addEventListener('pointerup', this.onUp.bind(this)), this.canvas.addEventListener('pointercancel', this.onCancel.bind(this)), 
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this)), this.canvas.addEventListener('pointerover', this.onOver.bind(this)), 
        this.canvas.addEventListener('pointerenter', this.onEnter.bind(this)), this.canvas.addEventListener('pointerout', this.onOut.bind(this)), 
        this.canvas.addEventListener('pointerleave', this.onLeave.bind(this)), this.canvas.addEventListener('gotpointercapture', this.onCaptured.bind(this)), 
        this.canvas.addEventListener('lostpointercapture', this.onReleased.bind(this));
    }
    onDown(e) {
        this.gestures.addFinger(e), this.gestures.sendInitialGesture(), this.earthProxy.captureEarthState(), 
        this.canvas.setPointerCapture(e.pointerId), e.preventDefault();
    }
    onMove(e) {
        this.gestures.updateFinger(e), this.gestures.sendIntermediateGesture(), e.preventDefault();
    }
    onUp(e) {
        this.gestures.updateFinger(e), this.gestures.sendFinalGesture(), this.gestures.removeFinger(e), 
        this.canvas.style.cursor = 'default', this.canvas.releasePointerCapture(e.pointerId), 
        e.preventDefault();
    }
    onCancel(e) {
        this.gestures.cancelFingers(), e.preventDefault();
    }
    onMouseMove(e) {
        var t = {
            x: e.clientX,
            y: e.clientY
        };
        if (1 == e.ctrlKey) var s = new CustomEvent('mouse/hover/ctrlkey', {
            detail: t
        }); else if (1 == e.altKey) s = new CustomEvent('mouse/hover/altkey', {
            detail: t
        }); else if (1 == e.shiftKey) s = new CustomEvent('mouse/hover/shiftkey', {
            detail: t
        }); else s = new CustomEvent('mouse/hover/nokey', {
            detail: t
        });
        this.canvas.dispatchEvent(s), e.preventDefault();
    }
    onOver(e) {
        e.preventDefault();
    }
    onEnter(e) {
        e.preventDefault();
    }
    onOut(e) {
        e.preventDefault();
    }
    onLeave(e) {
        e.preventDefault();
    }
    onCaptured(e) {
        e.preventDefault();
    }
    onReleased(e) {
        e.preventDefault();
    }
}