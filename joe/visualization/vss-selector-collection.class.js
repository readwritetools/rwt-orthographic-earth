/* Copyright (c) 2021 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import vssStyle from './vss-style.class.js';

export default class vssSelectorCollection {
    constructor() {
        this.vssSelectors = {};
    }
    selectorExists(s) {
        return null != s && s in this.vssSelectors;
    }
    createNewSelector(s) {
        return this.vssSelectors[s] = new vssStyle;
    }
    getSelector(s) {
        return this.vssSelectors[s];
    }
}