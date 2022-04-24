/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import KC from '../enum/keycodes.enum.js';

import CA from '../enum/cursor-action.enum.js';

export default class KeyboardHandler {
    constructor(e, s) {
        this.rwtOrthographicEarth = e, this.canvas = s, this.pressedDown = new Set, this.registerEventListeners();
    }
    registerEventListeners() {
        document.addEventListener('keydown', this.onKeydown.bind(this)), document.addEventListener('keyup', this.onKeyup.bind(this));
    }
    onKeydown(e) {
        if (0 == e.repeat) switch (e.keyCode) {
          case KC.SHIFT:
            return this.pressedDown.add(KC.SHIFT), void this.broadcastEvent('keyboard/begin-cursor', CA.FEATURE_IDENTIFY);

          case KC.CTRL:
            return this.pressedDown.add(KC.CTRL), void this.broadcastEvent('keyboard/begin-cursor', CA.FEATURE_SELECT);

          case KC.ALT:
            return this.pressedDown.add(KC.ALT), e.stopPropagation(), e.preventDefault(), void this.broadcastEvent('keyboard/begin-cursor', CA.NSEW_ANY);

          case KC.LETTER_A:
            return this.pressedDown.add(KC.LETTER_A), void this.broadcastEvent('keyboard/begin-cursor', CA.SET_POINT_A);

          case KC.LETTER_B:
            return this.pressedDown.add(KC.LETTER_B), void this.broadcastEvent('keyboard/begin-cursor', CA.SET_POINT_B);

          case KC.LETTER_C:
            return this.pressedDown.add(KC.LETTER_C), void this.broadcastEvent('keyboard/begin-cursor', CA.PAN_CANVAS_ANY);

          case KC.LETTER_D:
            return this.pressedDown.add(KC.LETTER_D), void this.broadcastEvent('keyboard/begin-cursor', CA.SET_PLACE_OF_INTEREST);

          case KC.LETTER_X:
            return this.pressedDown.add(KC.LETTER_X), void this.broadcastEvent('keyboard/begin-cursor', CA.PAN_SPACE_ANY);

          case KC.LETTER_Z:
            return this.pressedDown.add(KC.LETTER_Z), void this.broadcastEvent('keyboard/begin-cursor', CA.ZOOM_ANY);
        }
        if (this.pressedDown.has(KC.ALT)) switch (e.stopPropagation(), e.preventDefault(), 
        e.keyCode) {
          case KC.UP_ARROW:
            return this.broadcastEvent('keyboard/begin-cursor', CA.NSEW_NORTH), void this.broadcastEvent('keyboard/nsew/north');

          case KC.DOWN_ARROW:
            return this.broadcastEvent('keyboard/begin-cursor', CA.NSEW_SOUTH), void this.broadcastEvent('keyboard/nsew/south');

          case KC.LEFT_ARROW:
            return this.broadcastEvent('keyboard/begin-cursor', CA.NSEW_WEST), void this.broadcastEvent('keyboard/nsew/west');

          case KC.RIGHT_ARROW:
            return this.broadcastEvent('keyboard/begin-cursor', CA.NSEW_EAST), void this.broadcastEvent('keyboard/nsew/east');

          case KC.PAGE_UP:
            return this.broadcastEvent('keyboard/begin-cursor', CA.NSEW_NORTH_POLE), void this.broadcastEvent('keyboard/nsew/north-pole');

          case KC.PAGE_DOWN:
            return this.broadcastEvent('keyboard/begin-cursor', CA.NSEW_SOUTH_POLE), void this.broadcastEvent('keyboard/nsew/south-pole');

          case KC.HOME:
            return this.broadcastEvent('keyboard/begin-cursor', CA.NSEW_PRIME_MERIDIAN), void this.broadcastEvent('keyboard/nsew/prime-meridian');

          case KC.END:
            return this.broadcastEvent('keyboard/begin-cursor', CA.NSEW_DATELINE), void this.broadcastEvent('keyboard/nsew/dateline');
        }
        if (this.pressedDown.has(KC.LETTER_X)) switch (e.stopPropagation(), e.preventDefault(), 
        e.keyCode) {
          case KC.UP_ARROW:
            return this.broadcastEvent('keyboard/begin-cursor', CA.PAN_SPACE_NORTH), void this.broadcastEvent('keyboard/pan-space/north');

          case KC.DOWN_ARROW:
            return this.broadcastEvent('keyboard/begin-cursor', CA.PAN_SPACE_SOUTH), void this.broadcastEvent('keyboard/pan-space/south');

          case KC.LEFT_ARROW:
            return this.broadcastEvent('keyboard/begin-cursor', CA.PAN_SPACE_WEST), void this.broadcastEvent('keyboard/pan-space/west');

          case KC.RIGHT_ARROW:
            return this.broadcastEvent('keyboard/begin-cursor', CA.PAN_SPACE_EAST), void this.broadcastEvent('keyboard/pan-space/east');

          case KC.HOME:
            return this.broadcastEvent('keyboard/begin-cursor', CA.PAN_SPACE_RECENTER), void this.broadcastEvent('keyboard/pan-space/recenter');
        }
        if (this.pressedDown.has(KC.LETTER_C)) switch (e.stopPropagation(), e.preventDefault(), 
        e.keyCode) {
          case KC.UP_ARROW:
            return this.broadcastEvent('keyboard/begin-cursor', CA.PAN_CANVAS_NORTH), void this.broadcastEvent('keyboard/pan-canvas/north');

          case KC.DOWN_ARROW:
            return this.broadcastEvent('keyboard/begin-cursor', CA.PAN_CANVAS_SOUTH), void this.broadcastEvent('keyboard/pan-canvas/south');

          case KC.LEFT_ARROW:
            return this.broadcastEvent('keyboard/begin-cursor', CA.PAN_CANVAS_WEST), void this.broadcastEvent('keyboard/pan-canvas/west');

          case KC.RIGHT_ARROW:
            return this.broadcastEvent('keyboard/begin-cursor', CA.PAN_CANVAS_EAST), void this.broadcastEvent('keyboard/pan-canvas/east');

          case KC.HOME:
            return this.broadcastEvent('keyboard/begin-cursor', CA.PAN_CANVAS_RECENTER), void this.broadcastEvent('keyboard/pan-canvas/recenter');
        }
        if (this.pressedDown.has(KC.LETTER_Z)) switch (e.stopPropagation(), e.preventDefault(), 
        e.keyCode) {
          case KC.UP_ARROW:
          case KC.LEFT_ARROW:
            return this.broadcastEvent('keyboard/begin-cursor', CA.ZOOM_IN), void this.broadcastEvent('keyboard/zoom/in');

          case KC.DOWN_ARROW:
          case KC.RIGHT_ARROW:
            return this.broadcastEvent('keyboard/begin-cursor', CA.ZOOM_OUT), void this.broadcastEvent('keyboard/zoom/out');

          case KC.HOME:
            return this.broadcastEvent('keyboard/begin-cursor', CA.ZOOM_FIT), void this.broadcastEvent('keyboard/zoom/fit');
        }
    }
    onKeyup(e) {
        switch (e.keyCode) {
          case KC.SHIFT:
          case KC.CTRL:
          case KC.ALT:
            return void (this.pressedDown.has(e.keyCode) && (this.pressedDown.clear(), e.stopPropagation(), 
            e.preventDefault(), this.broadcastEvent('keyboard/begin-cursor', CA.FEATURE_DISCOVER)));

          case KC.LETTER_A:
          case KC.LETTER_B:
          case KC.LETTER_C:
          case KC.LETTER_D:
          case KC.LETTER_S:
          case KC.LETTER_X:
          case KC.LETTER_Z:
            return void (this.pressedDown.has(e.keyCode) && (this.pressedDown.delete(e.keyCode), 
            this.pressedDown.has(KC.ALT) ? (e.stopPropagation(), e.preventDefault(), this.broadcastEvent('keyboard/begin-cursor', CA.INDETERMINATE_ACTION)) : (e.stopPropagation(), 
            e.preventDefault(), this.broadcastEvent('keyboard/begin-cursor', CA.RESTING_STATE))));
        }
    }
    broadcastEvent(e, s) {
        var r = new CustomEvent(e, {
            detail: {
                cursorAction: s
            }
        });
        this.canvas.dispatchEvent(r);
    }
}