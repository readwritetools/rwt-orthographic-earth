/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import expect from '../dev/expect.js';

import terminal from 'softlib/terminal.js';

export default class EnumProxyHandler {
    constructor(e) {
        expect(e, 'String'), this.enumName = e, Object.seal(this);
    }
    get(e, t) {
        if (e.hasOwnProperty(t)) return e[t];
        terminal.logic(`No such enumerated value ${this.enumName}.${t}`);
    }
}