/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
/* Copyright (c) 2021 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
export default class vssCanvasParameters {
    constructor() {
        this.visibility = 'visible', this.transparency = 1;
    }
    dump() {
        var t = '';
        for (property in this) 'function' != typeof this[property] && (t += property + '=>' + this[property] + '\n');
        return t;
    }
    computeFillPlusTransparency() {
        var t = this.transparency, i = this['fill-color'];
        return 1 == t || 9 == i.length ? i : ('#' == i[0] && (i = i.substr(1)), 3 == i.length && (i = `${i[0]}${i[0]}${i[1]}${i[1]}${i[2]}${i[2]}`), 
        `#${i}${Math.floor(255 * t).toString(16).padStart(2, '0').toUpperCase()}`);
    }
    initializePointFeature() {
        this['stroke-width'] = .5, this['stroke-color'] = '#777777', this['fill-color'] = '#777777', 
        this['dot-radius'] = 1;
    }
    initializeLineFeature() {
        this['stroke-width'] = .5, this['stroke-color'] = '#777777';
    }
    initializePolygonFeature() {
        this['stroke-width'] = .5, this['stroke-color'] = '#777777', this['fill-color'] = '#777777', 
        this['fill-type'] = 'source-over';
    }
    initializeGeneralFeature(t) {
        for (var i in t) this[i] = t[i];
    }
}