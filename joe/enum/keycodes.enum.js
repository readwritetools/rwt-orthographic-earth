/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import EnumProxyHandler from './enum-proxy-handler.class.js';

var Keycode = {
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    ESC: 27,
    LEFT_ARROW: 37,
    UP_ARROW: 38,
    RIGHT_ARROW: 39,
    DOWN_ARROW: 40,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    LETTER_A: 65,
    LETTER_B: 66,
    LETTER_C: 67,
    LETTER_D: 68,
    LETTER_S: 83,
    LETTER_X: 88,
    LETTER_Z: 90
};

Object.freeze(Keycode);

export default new Proxy(Keycode, new EnumProxyHandler('Keycode'));