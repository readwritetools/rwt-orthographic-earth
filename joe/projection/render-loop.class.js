/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import terminal from 'softlib/terminal.js';

export default class RenderLoop {
    constructor(t, i) {
        this.rwtOrthographicEarth = t, this.earth = i, this.animations = new Array, this.mostRecentPaint = performance.now(), 
        window.requestAnimationFrame(this.continuous.bind(this));
    }
    continuous(t) {
        var i = t - this.mostRecentPaint;
        if (i > 16.67) {
            1 == this.earth.canvasCoordsPending && this.canvasCoordsChanged();
            for (let t = 0; t < this.animations.length; t++) this.animations[t].fire(i);
            1 == this.earth.pendingUpdates && 0 == this.earth.currentlyPainting && (this.earth.paintCanvas(i), 
            this.mostRecentPaint = t, this.earth.canvasCoordsPending = !0);
        }
        window.requestAnimationFrame(this.continuous.bind(this));
    }
    canvasCoordsChanged() {
        var t = this.earth.canvasCoordsToProjectedPoint();
        this.rwtOrthographicEarth.broadcastMessage('user/latitudeLongitude', t);
        var i = this.earth.discoverFeatures();
        this.rwtOrthographicEarth.broadcastMessage('user/discoveredFeatures', i), this.earth.canvasCoordsPending = !1;
    }
    addAnimation(t) {
        this.animations.push(t);
    }
    getAnimationByName(t) {
        for (let i = 0; i < this.animations.length; i++) if (this.animations[i].name == t) return this.animations[i];
        return null;
    }
    deleteAnimation(t) {
        for (let i = 0; i < this.animations.length; i++) if (this.animations[i].name == t) return this.animations.splice(i, 1), 
        !0;
        return !1;
    }
    pauseAnimation(t) {
        var i = this.getAnimationByName(t);
        null != i && i.pause();
    }
    resumeAnimation(t) {
        var i = this.getAnimationByName(t);
        null != i && i.resume();
    }
}