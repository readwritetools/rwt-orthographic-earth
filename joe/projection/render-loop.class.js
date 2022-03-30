/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import terminal from 'softlib/terminal.js';

import RS from '../enum/rendering-state.enum.js';

import RenderClock from './render-clock.class.js';

export default class RenderLoop {
    constructor(t, e) {
        this.rwtOrthographicEarth = t, this.earth = e, this.animations = new Array, this.renderClock = new RenderClock, 
        this.pendingProjection = !1, this.pendingFinalPaint = !1, this.mruCentralParallel = 0, 
        this.mruCentralMeridian = 0, this.mruMapScale = 0, this.mruTranslationA = 0, this.mruTranslationB = 0, 
        window.requestAnimationFrame(this.continuous.bind(this)), Object.seal(this);
    }
    invalidateCanvas() {
        this.pendingProjection = !0;
    }
    continuous(t) {
        var e = t - this.renderClock.mostRecentRender;
        if (e > 16.67) {
            1 == this.earth.canvasCoordsPending && this.canvasCoordsChanged();
            for (let t = 0; t < this.animations.length; t++) this.animations[t].fire(e);
            this.renderClock.renderingState == RS.NOT_RENDERING && (1 != this.pendingProjection && 1 != this.pendingFinalPaint || (this.preRender(), 
            this.earth.renderAllInOne(this.renderClock), this.postRender()), this.renderClock.mostRecentRender = t, 
            this.earth.canvasCoordsPending = !0);
        }
        window.requestAnimationFrame(this.continuous.bind(this));
    }
    preRender() {
        this.hasActiveAnimation() ? (this.renderClock.renderTimeRemaining = 2e3, this.renderClock.renderingState = RS.PAINTING) : this.hasAnythingChanged() ? (this.renderClock.renderTimeRemaining = 250, 
        this.renderClock.renderingState = RS.SKETCHING) : (this.renderClock.renderTimeRemaining = 15e3, 
        this.renderClock.renderingState = RS.PAINTING);
    }
    postRender() {
        this.renderClock.renderingState == RS.PAINTING && (this.earth.coords.allPointsNeedGeoCoords = !1, 
        this.earth.ortho.allPointsNeedProjection = !1, this.earth.carte.allPointsNeedTransformation = !1, 
        this.earth.viewport.allPointsNeedPlacement = !1, this.earth.visual.allFeaturesNeedRestyling = !1), 
        this.hasAnythingChanged() ? this.pendingFinalPaint = !0 : this.pendingFinalPaint = !1, 
        this.pendingProjection = !1, this.mruCentralMeridian = this.earth.getTangentLongitude(), 
        this.mruCentralParallel = this.earth.getTangentLatitude(), this.mruMapScale = this.earth.getMapScale(), 
        this.mruTranslationA = this.earth.getTranslationEastWest(), this.mruTranslationB = this.earth.getTranslationNorthSouth(), 
        this.renderClock.renderingState = RS.NOT_RENDERING;
    }
    hasActiveAnimation() {
        for (let t = 0; t < this.animations.length; t++) if (!this.animations[t].isPaused) return !0;
        return !1;
    }
    hasAnythingChanged() {
        return this.mruCentralMeridian != this.earth.getTangentLongitude() || (this.mruCentralParallel != this.earth.getTangentLatitude() || (this.mruMapScale != this.earth.getMapScale() || (this.mruTranslationA != this.earth.getTranslationEastWest() || this.mruTranslationB != this.earth.getTranslationNorthSouth())));
    }
    canvasCoordsChanged() {
        var t = this.earth.canvasCoordsToProjectedPoint();
        this.rwtOrthographicEarth.broadcastMessage('user/latitudeLongitude', t);
        var e = this.earth.discoverFeatures();
        this.rwtOrthographicEarth.broadcastMessage('user/discoveredFeatures', e), this.earth.canvasCoordsPending = !1;
    }
    addAnimation(t) {
        this.animations.push(t);
    }
    getAnimationByName(t) {
        for (let e = 0; e < this.animations.length; e++) if (this.animations[e].name == t) return this.animations[e];
        return null;
    }
    deleteAnimation(t) {
        for (let e = 0; e < this.animations.length; e++) if (this.animations[e].name == t) return this.animations.splice(e, 1), 
        !0;
        return !1;
    }
    pauseAnimation(t) {
        var e = this.getAnimationByName(t);
        null != e && e.pause();
    }
    resumeAnimation(t) {
        var e = this.getAnimationByName(t);
        null != e && e.resume();
    }
}