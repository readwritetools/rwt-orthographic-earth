/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
export default class vssStyle {
    constructor() {
        this.properties = [];
    }
    addProperty(t) {
        this.properties[t.name] = t;
    }
}