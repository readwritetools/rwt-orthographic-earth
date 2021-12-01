/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
/* Copyright (c) 2021 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import vssMediaRule from './vss-media-rule.class.js';

import vssCanvasParameters from './vss-canvas-parameters.class.js';

export default class vssMediaCollection {
    constructor() {
        this.vssMediaRules = {}, this.createNewRule('min', 'max');
    }
    ruleExists(e, s) {
        return vssMediaCollection.assembleMediaKey(e, s) in this.vssMediaRules;
    }
    createNewRule(e, s) {
        var a = vssMediaCollection.assembleMediaKey(e, s);
        return this.vssMediaRules[a] = new vssMediaRule(e, s);
    }
    getRule(e, s) {
        var a = vssMediaCollection.assembleMediaKey(e, s);
        return this.vssMediaRules[a];
    }
    getAllMediaRule() {
        var e = vssMediaCollection.assembleMediaKey('min', 'max');
        return this.vssMediaRules[e];
    }
    static assembleMediaKey(e, s) {
        return 'min' != e && isNaN(parseFloat(e)) || 'max' != s && isNaN(parseFloat(s)) || 'min' != e && 'max' != s && e > s ? 'invalid' : `${e}_${s}`;
    }
    computeStyle(e, s, a, i, l, t, r) {
        if ('point' == s) (n = new vssCanvasParameters).initializePointFeature(); else if ('line' == s) {
            (n = new vssCanvasParameters).initializeLineFeature();
        } else if ('polygon' == s) {
            (n = new vssCanvasParameters).initializePolygonFeature();
        } else if ('general' == s) {
            (n = new vssCanvasParameters).initializeGeneralFeature(t), t = void 0;
        } else var n = new vssCanvasParameters;
        var m = this.getAllMediaRule();
        for (var v in m.computeMediaRuleStyle(n, s, a, i, l, t, r), this.vssMediaRules) if (this.vssMediaRules.hasOwnProperty(v)) {
            var u = this.vssMediaRules[v];
            'min' == u.minScale && 'max' == u.maxScale || ('min' == u.minScale && e <= u.maxScale || e > u.minScale && 'max' == u.maxScale || e > u.minScale && e <= u.maxScale) && u.computeMediaRuleStyle(n, s, a, i, l, t, r);
        }
        return n;
    }
}