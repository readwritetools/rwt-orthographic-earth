/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
export default class vssCanvasParameters {
    constructor() {}
    dump() {
        var t = '';
        for (property in this) 'function' != typeof this[property] && (t += property + '=>' + this[property] + '\n');
        return t;
    }
    computeFillPlusTransparency() {
        var t = this.transparency, r = this['fill-color'];
        return (null == t || Number.isNaN(t)) && (t = 1), null != r && 'String' == r.constructor.name || (r = '#777777'), 
        1 == t || 9 == r.length ? r : ('#' == r[0] && (r = r.substr(1)), 3 == r.length && (r = `${r[0]}${r[0]}${r[1]}${r[1]}${r[2]}${r[2]}`), 
        `#${r}${Math.floor(255 * t).toString(16).padStart(2, '0').toUpperCase()}`);
    }
    initializeGeneralFeature(t) {
        for (var r in t) this[r] = t[r];
    }
    initializePointFeature() {}
    initializeLineFeature() {}
    initializePolygonFeature() {}
}