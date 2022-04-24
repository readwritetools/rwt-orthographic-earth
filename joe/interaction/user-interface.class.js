/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import Cursors from './cursors.class.js';

import PointerHandler from './pointer-handler.class.js';

import KeyboardHandler from './keyboard-handler.class.js';

import KC from '../enum/keycodes.enum.js';

import CA from '../enum/cursor-action.enum.js';

import terminal from 'softlib/terminal.js';

import expect from 'softlib/expect.js';

export default class UserInterface {
    constructor(t, e) {
        this.rwtOrthographicEarth = t, this.earth = t.earth, this.canvas = e, this.pointerHandler = new PointerHandler(t, e), 
        this.keyboardHandler = new KeyboardHandler(t, e), this.cursors = new Cursors(t, e), 
        this.initialLatitude = 0, this.initialLongitude = 0, this.initialMapScale = 10, 
        this.initialTranslationEastWest = 0, this.initialTranslationNorthSouth = 0, this.initialCanvasX = 0, 
        this.initialCanvasY = 0, this.registerEventListeners();
    }
    registerEventListeners() {
        this.canvas.addEventListener('keyboard/begin-cursor', this.beginCursor.bind(this)), 
        this.canvas.addEventListener('keyboard/nsew/north', this.nsewNorth.bind(this)), 
        this.canvas.addEventListener('keyboard/nsew/south', this.nsewSouth.bind(this)), 
        this.canvas.addEventListener('keyboard/nsew/east', this.nsewEast.bind(this)), this.canvas.addEventListener('keyboard/nsew/west', this.nsewWest.bind(this)), 
        this.canvas.addEventListener('keyboard/nsew/north-pole', this.nsewNorthPole.bind(this)), 
        this.canvas.addEventListener('keyboard/nsew/south-pole', this.nsewSouthPole.bind(this)), 
        this.canvas.addEventListener('keyboard/nsew/prime-meridian', this.nsewPrimeMeridian.bind(this)), 
        this.canvas.addEventListener('keyboard/nsew/dateline', this.nsewDateline.bind(this)), 
        this.canvas.addEventListener('keyboard/zoom/in', this.zoomIn.bind(this)), this.canvas.addEventListener('keyboard/zoom/out', this.zoomOut.bind(this)), 
        this.canvas.addEventListener('keyboard/zoom/fit', this.zoomFit.bind(this)), this.canvas.addEventListener('keyboard/pan-space/north', this.panSpaceNorth.bind(this)), 
        this.canvas.addEventListener('keyboard/pan-space/south', this.panSpaceSouth.bind(this)), 
        this.canvas.addEventListener('keyboard/pan-space/east', this.panSpaceEast.bind(this)), 
        this.canvas.addEventListener('keyboard/pan-space/west', this.panSpaceWest.bind(this)), 
        this.canvas.addEventListener('keyboard/pan-space/recenter', this.panSpaceRecenter.bind(this)), 
        this.canvas.addEventListener('keyboard/pan-canvas/north', this.panCanvasNorth.bind(this)), 
        this.canvas.addEventListener('keyboard/pan-canvas/south', this.panCanvasSouth.bind(this)), 
        this.canvas.addEventListener('keyboard/pan-canvas/east', this.panCanvasEast.bind(this)), 
        this.canvas.addEventListener('keyboard/pan-canvas/west', this.panCanvasWest.bind(this)), 
        this.canvas.addEventListener('keyboard/pan-canvas/recenter', this.panCanvasRecenter.bind(this)), 
        this.canvas.addEventListener('mouse/hover/ctrlkey', this.noop.bind(this)), this.canvas.addEventListener('mouse/hover/altkey', this.noop.bind(this)), 
        this.canvas.addEventListener('mouse/hover/shiftkey', this.noop.bind(this)), this.canvas.addEventListener('mouse/hover/nokey', this.locatePositionAndDiscoverFeatures.bind(this)), 
        this.canvas.addEventListener('gesture/begin/ctrlkey', this.noop.bind(this)), this.canvas.addEventListener('gesture/begin/altkey', this.noop.bind(this)), 
        this.canvas.addEventListener('gesture/begin/shiftkey', this.noop.bind(this)), this.canvas.addEventListener('gesture/begin/nokey', this.noop.bind(this)), 
        this.canvas.addEventListener('gesture/tap/ctrlkey', this.selectFeatures.bind(this)), 
        this.canvas.addEventListener('gesture/tap/altkey', this.nsewFromCursorPosition.bind(this)), 
        this.canvas.addEventListener('gesture/tap/shiftkey', this.identifyFeatures.bind(this)), 
        this.canvas.addEventListener('gesture/tap/nokey', this.tapAlphabeticKey.bind(this)), 
        this.canvas.addEventListener('gesture/doubletap/ctrlkey', this.noop.bind(this)), 
        this.canvas.addEventListener('gesture/doubletap/altkey', this.noop.bind(this)), 
        this.canvas.addEventListener('gesture/doubletap/shiftkey', this.noop.bind(this)), 
        this.canvas.addEventListener('gesture/doubletap/nokey', this.noop.bind(this)), this.canvas.addEventListener('gesture/press/ctrlkey', this.noop.bind(this)), 
        this.canvas.addEventListener('gesture/press/altkey', this.noop.bind(this)), this.canvas.addEventListener('gesture/press/shiftkey', this.noop.bind(this)), 
        this.canvas.addEventListener('gesture/press/nokey', this.noop.bind(this)), this.canvas.addEventListener('gesture/track/ctrlkey', this.noop.bind(this)), 
        this.canvas.addEventListener('gesture/track/altkey', this.nsewAny.bind(this)), this.canvas.addEventListener('gesture/track/shiftkey', this.noop.bind(this)), 
        this.canvas.addEventListener('gesture/track/nokey', this.trackAlphabeticKey.bind(this)), 
        this.canvas.addEventListener('gesture/spread', this.zoomSpreadGesture.bind(this)), 
        this.canvas.addEventListener('gesture/pinch', this.zoomPinchGesture.bind(this)), 
        this.canvas.addEventListener('gesture/xypan', this.panXYGesture.bind(this)), this.canvas.addEventListener('gesture/horizontalpan', this.panHorizontalGesture.bind(this)), 
        this.canvas.addEventListener('gesture/verticalpan', this.panVerticalGesture.bind(this)), 
        this.canvas.addEventListener('gesture/twofingertap', this.noop.bind(this)), this.canvas.addEventListener('gesture/threefingertap', this.noop.bind(this)), 
        this.canvas.addEventListener('gesture/horizontalflick', this.noop.bind(this)), this.canvas.addEventListener('gesture/verticalflick', this.noop.bind(this)), 
        this.canvas.addEventListener('gesture/stationtrack', this.locatePositionAndDiscoverFeatures.bind(this)), 
        this.canvas.addEventListener('gesture/twostationtrack', this.noop.bind(this)), this.canvas.addEventListener('gesture/counterclockwise', this.noop.bind(this)), 
        this.canvas.addEventListener('gesture/clockwise', this.noop.bind(this));
    }
    captureEarthState() {
        this.initialLatitude = this.earth.getTangentLatitude(), this.initialLongitude = this.earth.getTangentLongitude(), 
        this.initialMapScale = this.earth.getMapScale(), this.initialTranslationEastWest = this.earth.getTranslationEastWest(), 
        this.initialTranslationNorthSouth = this.earth.getTranslationNorthSouth(), this.initialCanvasX = this.earth.getCenterPoint().x, 
        this.initialCanvasY = this.earth.getCenterPoint().y;
    }
    broadcastEvent(t, e) {
        var s = new CustomEvent(t, {
            detail: {
                cursorAction: e
            }
        });
        this.canvas.dispatchEvent(s);
    }
    beginCursor(t) {
        switch (t.detail.cursorAction) {
          case CA.RESTING_STATE:
            let e = this.earth.canvasCoordsToProjectedPoint();
            this.setRestingStateCursor(e);
            break;

          case CA.FEATURE_DISCOVER:
            this.cursors.featureDiscover();
            break;

          case CA.FEATURE_IDENTIFY:
            this.cursors.featureIdentify();
            break;

          case CA.FEATURE_SELECT:
            this.cursors.featureSelect();
            break;

          case CA.INDETERMINATE_ACTION:
            this.cursors.altMenu();
            break;

          case CA.NSEW_ANY:
            this.cursors.nsewAny();
            break;

          case CA.NSEW_FROM_CURSOR:
            this.cursors.nsewFromCursor();
            break;

          case CA.NSEW_NORTH:
            this.cursors.nsewNorth();
            break;

          case CA.NSEW_SOUTH:
            this.cursors.nsewSouth();
            break;

          case CA.NSEW_EAST:
            this.cursors.nsewEast();
            break;

          case CA.NSEW_WEST:
            this.cursors.nsewWest();
            break;

          case CA.NSEW_NORTH_POLE:
            this.cursors.nsewNorthPole();
            break;

          case CA.NSEW_SOUTH_POLE:
            this.cursors.nsewSouthPole();
            break;

          case CA.NSEW_PRIME_MERIDIAN:
            this.cursors.nsewPrimeMeridian();
            break;

          case CA.NSEW_DATELINE:
            this.cursors.nsewDateline();
            break;

          case CA.ZOOM_ANY:
            this.cursors.zoomAny();
            break;

          case CA.ZOOM_IN:
            this.cursors.zoomIn();
            break;

          case CA.ZOOM_OUT:
            this.cursors.zoomOut();
            break;

          case CA.ZOOM_FIT:
            this.cursors.zoomFit();
            break;

          case CA.PAN_SPACE_ANY:
            this.cursors.panSpaceAny();
            break;

          case CA.PAN_SPACE_NORTH:
            this.cursors.panSpaceNorth();
            break;

          case CA.PAN_SPACE_SOUTH:
            this.cursors.panSpaceSouth();
            break;

          case CA.PAN_SPACE_EAST:
            this.cursors.panSpaceEast();
            break;

          case CA.PAN_SPACE_WEST:
            this.cursors.panSpaceWest();
            break;

          case CA.PAN_SPACE_RECENTER:
            this.cursors.panSpaceRecenter();
            break;

          case CA.PAN_CANVAS_ANY:
            this.cursors.panCanvasAny();
            break;

          case CA.PAN_CANVAS_NORTH:
            this.cursors.panCanvasNorth();
            break;

          case CA.PAN_CANVAS_SOUTH:
            this.cursors.panCanvasSouth();
            break;

          case CA.PAN_CANVAS_EAST:
            this.cursors.panCanvasEast();
            break;

          case CA.PAN_CANVAS_WEST:
            this.cursors.panCanvasWest();
            break;

          case CA.PAN_CANVAS_RECENTER:
            this.cursors.panCanvasRecenter();
            break;

          case CA.SET_POINT_A:
            this.cursors.setPointA();
            break;

          case CA.SET_POINT_B:
            this.cursors.setPointB();
            break;

          case CA.SET_PLACE_OF_INTEREST:
            this.cursors.placeOfInterest();
            break;

          default:
            terminal.logic(`Unknown action ${t.detail.cursorAction} with beginCursor`);
        }
    }
    setRestingStateCursor(t) {
        expect(t, 'ProjectedPoint'), this.keyboardHandler.pressedDown.has(KC.ALT) || (t.isOnEarth ? this.cursors.featureDiscover() : this.cursors.standard());
    }
    tapAlphabeticKey(t) {
        this.keyboardHandler.pressedDown.has(KC.LETTER_A) ? this.setPointA(t) : this.keyboardHandler.pressedDown.has(KC.LETTER_B) ? this.setPointB(t) : this.keyboardHandler.pressedDown.has(KC.LETTER_D) && this.setPlaceOfInterest(t);
    }
    trackAlphabeticKey(t) {
        this.keyboardHandler.pressedDown.has(KC.LETTER_C) ? this.panCanvasAny(t) : this.keyboardHandler.pressedDown.has(KC.LETTER_X) ? this.panSpaceAny(t) : this.keyboardHandler.pressedDown.has(KC.LETTER_Z) ? this.zoomAny(t) : this.reserved(t);
    }
    locatePositionAndDiscoverFeatures(t) {
        this.rwtOrthographicEarth.broadcastMessage('user/changeCanvasCoords', {
            x: t.detail.x,
            y: t.detail.y
        });
    }
    identifyFeatures(t) {
        this.rwtOrthographicEarth.broadcastMessage('user/requestFeatureIdentification', {
            x: t.detail.x,
            y: t.detail.y
        });
    }
    selectFeatures(t) {
        this.rwtOrthographicEarth.broadcastMessage('user/requestFeatureSelection', {
            x: t.detail.x,
            y: t.detail.y
        });
    }
    setPlaceOfInterest(t) {
        this.rwtOrthographicEarth.broadcastMessage('user/changePlaceOfInterest', {
            x: t.detail.x,
            y: t.detail.y
        });
    }
    setPointA(t) {
        this.rwtOrthographicEarth.broadcastMessage('user/setPointA', {
            x: t.detail.x,
            y: t.detail.y
        });
    }
    setPointB(t) {
        this.rwtOrthographicEarth.broadcastMessage('user/setPointB', {
            x: t.detail.x,
            y: t.detail.y
        });
    }
    noop(t) {}
    reserved(t) {
        this.cursors.reserved();
    }
    zoomAny(t) {
        var e = t.detail.initialY - t.detail.y, s = this.determineScalingFactor(e, 1), a = e < 0 ? Math.max(this.initialMapScale / s, .025) : Math.min(this.initialMapScale * s, 1e3);
        this.earth.supressCanvasCoords(), this.rwtOrthographicEarth.setMapScale(a), this.rwtOrthographicEarth.explicitMapScale = !0;
    }
    zoomIn() {
        var t = this.earth.getMapScale();
        t = Math.min(1e3, 1.5 * t), this.rwtOrthographicEarth.setMapScale(t), this.rwtOrthographicEarth.explicitMapScale = !0;
    }
    zoomOut() {
        var t = this.earth.getMapScale();
        t = Math.max(.025, t / 1.5), this.rwtOrthographicEarth.setMapScale(t), this.rwtOrthographicEarth.explicitMapScale = !0;
    }
    zoomFit() {
        var t = Math.min(this.canvas.width, this.canvas.height) / 2 - 10;
        this.rwtOrthographicEarth.setMapScale(this.earth.getEarthRadius() / t), this.rwtOrthographicEarth.explicitMapScale = !1;
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
        var s = Math.log(1), a = (Math.log(1e3) - s) / (Math.min(this.earth.canvas.width, this.earth.canvas.height) * e - 1);
        return Math.exp(s + a * (Math.abs(t) - 1));
    }
    panSpaceAny(t) {
        var e = t.detail.x - t.detail.initialX, s = t.detail.y - t.detail.initialY, a = e * this.earth.getMapScale() + this.initialTranslationEastWest, i = s * this.earth.getMapScale() + this.initialTranslationNorthSouth;
        this.earth.supressCanvasCoords(), this.earth.setTranslationEastWest(a), this.earth.setTranslationNorthSouth(i);
    }
    panSpaceNorth() {
        var t = this.earth.getTranslationNorthSouth();
        t -= 100 * this.earth.getMapScale(), this.earth.setTranslationNorthSouth(t);
    }
    panSpaceSouth() {
        var t = this.earth.getTranslationNorthSouth();
        t += 100 * this.earth.getMapScale(), this.earth.setTranslationNorthSouth(t);
    }
    panSpaceEast() {
        var t = this.earth.getTranslationEastWest();
        t += 100 * this.earth.getMapScale(), this.earth.setTranslationEastWest(t);
    }
    panSpaceWest() {
        var t = this.earth.getTranslationEastWest();
        t -= 100 * this.earth.getMapScale(), this.earth.setTranslationEastWest(t);
    }
    panSpaceRecenter() {
        this.earth.setTranslationNorthSouth(0), this.earth.setTranslationEastWest(0);
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
    panCanvasAny(t) {
        var e = t.detail.x - t.detail.initialX, s = t.detail.y - t.detail.initialY, a = e + this.initialCanvasX, i = s + this.initialCanvasY;
        this.earth.supressCanvasCoords(), this.earth.setCenterPointX(a), this.earth.setCenterPointY(i);
    }
    panCanvasNorth() {
        var t = this.earth.getCenterPointY();
        t -= 50;
        var e = 0 - this.earth.getVisualizedRadius();
        t = Math.max(t, e), this.earth.setCenterPointY(t);
    }
    panCanvasSouth() {
        var t = this.earth.getCenterPointY();
        t += 50;
        var e = this.earth.getCanvasHeight() + this.earth.getVisualizedRadius();
        t = Math.min(t, e), this.earth.setCenterPointY(t);
    }
    panCanvasEast() {
        var t = this.earth.getCenterPointX();
        t += 50;
        var e = this.earth.getCanvasWidth() + this.earth.getVisualizedRadius();
        t = Math.min(t, e), this.earth.setCenterPointX(t);
    }
    panCanvasWest() {
        var t = this.earth.getCenterPointX();
        t -= 50;
        var e = 0 - this.earth.getVisualizedRadius();
        t = Math.max(t, e), this.earth.setCenterPointX(t);
    }
    panCanvasRecenter() {
        this.earth.setCenterPointX(this.earth.getCanvasWidth() / 2), this.earth.setCenterPointY(this.earth.getCanvasHeight() / 2);
    }
    nsewAny(t) {
        this.earth.supressCanvasCoords();
        var e = t.detail.x - t.detail.initialX, s = t.detail.y - t.detail.initialY, a = 'mouse' == t.detail.pointerType ? 1 : 3, {newLongitude: i, newLatitude: n} = this.nsewFromCanvasDelta(e, s, a);
        this.earth.setTangentLongitude(i), this.earth.setTangentLatitude(n);
    }
    nsewNorth() {
        var t = this.earth.getTangentLatitude();
        t += 5, t = Math.min(90, t), this.earth.setTangentLatitude(t);
    }
    nsewSouth() {
        var t = this.earth.getTangentLatitude();
        t -= 5, t = Math.max(-90, t), this.earth.setTangentLatitude(t);
    }
    nsewEast() {
        var t = this.earth.getTangentLongitude();
        (t += 5) > 180 && (t -= 360), this.earth.setTangentLongitude(t);
    }
    nsewWest() {
        var t = this.earth.getTangentLongitude();
        (t -= 5) < -180 && (t += 360), this.earth.setTangentLongitude(t);
    }
    nsewNorthPole() {
        this.earth.setTangentLatitude(90);
    }
    nsewSouthPole() {
        this.earth.setTangentLatitude(-90);
    }
    nsewPrimeMeridian() {
        this.earth.setTangentLatitude(0), this.earth.setTangentLongitude(0);
    }
    nsewDateline() {
        this.earth.setTangentLatitude(0), this.earth.setTangentLongitude(180);
    }
    nsewFromCanvasDelta(t, e, s) {
        var a = 2 * this.earth.getVisualizedRadius(), i = t / a * -180 / s, n = this.initialLongitude + i, r = e / a * 180 / s, h = this.initialLatitude + r;
        return h = Math.min(h, 90), {
            newLongitude: n,
            newLatitude: h = Math.max(h, -90)
        };
    }
    nsewFromCursorPosition(t) {
        this.cursors.nsewFromCursor();
        var e = this.earth.getCoordinatesFromCanvasXY(t.detail.x, t.detail.y);
        this.earth.setTangentLongitude(e.longitude), this.earth.setTangentLatitude(e.latitude);
    }
}