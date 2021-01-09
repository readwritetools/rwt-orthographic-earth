/* Copyright (c) 2021 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
export default class vssCanvasParameters {
    constructor() {
        this.visibility = 'visible', this.transparency = 1;
    }
    dump() {
        var i = '';
        for (property in this) 'function' != typeof this[property] && (i += property + '=>' + this[property] + '\n');
        return i;
    }
    initializePointFeature() {
        this['stroke-width'] = .5, this['stroke-color'] = '#777777', this['fill-color'] = '#777777', 
        this['dot-radius'] = 1;
    }
    initializeLineFeature() {
        this['stroke-width'] = .5, this['stroke-color'] = '#777777';
    }
    initializePolygonFeature() {
        this['stroke-width'] = .5, this['stroke-color'] = '#777777', this['fill-color'] = '#777777';
    }
    initializeGeneralFeature(i) {
        for (var t in i) this[t] = i[t];
    }
}