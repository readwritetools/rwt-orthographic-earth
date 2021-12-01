/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
/* Copyright (c) 2021 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import vssSelectorCollection from './vss-selector-collection.class.js';

export default class vssMediaRule {
    constructor(e, s) {
        this.minScale = e, this.maxScale = s, this.vssSelectorCollection = new vssSelectorCollection;
    }
    selectorExists(e) {
        return this.vssSelectorCollection.selectorExists(e);
    }
    createNewSelector(e) {
        return this.vssSelectorCollection.createNewSelector(e);
    }
    getSelector(e) {
        return this.vssSelectorCollection.getSelector(e);
    }
    computeMediaRuleStyle(e, s, t, r, l, i, o) {
        var a = s, c = '.' + t, n = '#' + r, u = `["${l}"]`;
        if (this.assignPropertyValues(e, a, o), '' != t && this.assignPropertyValues(e, c, o), 
        '' != r && this.assignPropertyValues(e, n, o), '' != l && this.assignPropertyValues(e, u, o), 
        '' != t && '' != l && this.assignPropertyValues(e, c + u, o), '' != r && '' != l && this.assignPropertyValues(e, n + u, o), 
        null != i) for (var h in i) {
            var p = i[h];
            if ('' != t) {
                var v = `${c}[${h}="${p}"]`;
                this.assignPropertyValues(e, v, o);
            }
            if ('' != r) {
                var S = `${n}[${h}="${p}"]`;
                this.assignPropertyValues(e, S, o);
            }
        }
    }
    assignPropertyValues(e, s, t) {
        var r = this.lookupStyle(s);
        if (null != r) for (let s in r.properties) {
            var l = r.properties[s], i = l.name, o = l.value;
            l.units;
            if (Array.isArray(o)) {
                var a = o[t % o.length];
                e[i] = a;
            } else e[i] = o;
        }
    }
    lookupStyle(e) {
        if ('' != e) return this.selectorExists(e) ? this.getSelector(e) : void 0;
    }
}