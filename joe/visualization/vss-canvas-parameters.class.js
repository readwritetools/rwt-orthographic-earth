/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
export default class vssCanvasParameters {
    constructor() {}
    dump() {
        var i = '';
        for (property in this) 'function' != typeof this[property] && (i += property + '=>' + this[property] + '\n');
        return i;
    }
    computeFillPlusTransparency() {
        var i = this.transparency, t = this['fill-color'];
        return (null == i || Number.isNaN(i)) && (i = 1), null != t && 'String' == t.constructor.name || (t = '#777777'), 
        1 == i || 9 == t.length ? t : ('#' == t[0] && (t = t.substr(1)), 3 == t.length && (t = `${t[0]}${t[0]}${t[1]}${t[1]}${t[2]}${t[2]}`), 
        `#${t}${Math.floor(255 * i).toString(16).padStart(2, '0').toUpperCase()}`);
    }
    initializeGeneralFeature(i) {
        for (var t in i) this[t] = i[t];
    }
    initializePointFeature() {
        this.visibility = 'visible', this['symbol-type'] = 'circle', this.size = 3, this['stroke-width'] = .5, 
        this['stroke-color'] = '#777777', this['fill-color'] = '#777777', this['node-count'] = 3, 
        this['inner-size'] = 1;
    }
    initializeLineFeature() {
        this.visibility = 'visible', this['stroke-width'] = .5, this['stroke-color'] = '#777777', 
        this['stroke-type'] = 'solid';
    }
    initializePolygonFeature() {
        this.visibility = 'visible', this.transparency = 1, this['stroke-width'] = .5, this['stroke-color'] = '#777777', 
        this['stroke-type'] = 'solid', this['fill-color'] = '#777777', this['fill-type'] = 'source-over';
    }
}