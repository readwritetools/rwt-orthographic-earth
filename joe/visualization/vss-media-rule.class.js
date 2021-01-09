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
    computeMediaRuleStyle(e, s, t, r, l, o, i) {
        var a = s, c = '.' + t, n = '#' + r, u = '[' + l + ']';
        if (this.assignPropertyValues(e, a, i), '' != t && this.assignPropertyValues(e, c, i), 
        '' != r && this.assignPropertyValues(e, n, i), '' != l && this.assignPropertyValues(e, u, i), 
        '' != t && '' != l && this.assignPropertyValues(e, c + u, i), '' != r && '' != l && this.assignPropertyValues(e, n + u, i), 
        null != o) for (var h in o) {
            var p = '[' + h + '=' + o[h] + ']';
            this.assignPropertyValues(e, p, i);
        }
    }
    assignPropertyValues(e, s, t) {
        var r = this.lookupStyle(s);
        if (null != r) for (let s in r.properties) {
            var l = r.properties[s], o = l.name, i = l.value;
            l.units;
            if (Array.isArray(i)) {
                var a = i[t % i.length];
                e[o] = a;
            } else e[o] = i;
        }
    }
    lookupStyle(e) {
        if ('' != e) return this.selectorExists(e) ? this.getSelector(e) : void 0;
    }
}