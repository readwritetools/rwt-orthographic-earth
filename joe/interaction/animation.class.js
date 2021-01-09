/* Copyright (c) 2021 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
export default class Animation {
    constructor(s, h, e, t, i) {
        this.name = s, this.earth = h, this.getCallback = e, this.setCallback = t, this.deltaPerSecond = i.deltaPerSecond || null, 
        this.maxThreshold = i.maxThreshold || null, this.minThreshold = i.minThreshold || null, 
        this.thresholdWrap = void 0 != i.thresholdWrap && i.thresholdWrap, this.isPaused = !0;
    }
    setDeltaPerSecond(s) {
        'String' == s.constructor.name && (s = parseFloat(s)), isNaN(s) && (s = 0), this.deltaPerSecond = s, 
        0 == s ? this.pause() : this.resume(), this.earth.invalidateCanvas();
    }
    pause() {
        this.isPaused = !0;
    }
    resume() {
        this.isPaused = !1;
    }
    fire(s) {
        if (1 != this.isPaused) {
            var h = this.getCallback(), e = h + s * (this.deltaPerSecond / 1e3);
            null != this.maxThreshold && e > this.maxThreshold && (1 == this.thresholdWrap ? e = this.minThreshold : (e = this.maxThreshold, 
            this.isPaused = !0)), null != this.minThreshold && e < this.minThreshold && (1 == this.thresholdWrap ? e = this.maxThreshold : (e = this.minThreshold, 
            this.isPaused = !0)), this.setCallback(e), e != h && this.earth.invalidateCanvas();
        }
    }
};