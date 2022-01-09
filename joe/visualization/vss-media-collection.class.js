/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import vssMediaRule from './vss-media-rule.class.js';

import vssCanvasParameters from './vss-canvas-parameters.class.js';

export default class vssMediaCollection {
    constructor() {
        this.vssMediaRules = {}, this.createNewRule('min', 'max');
    }
    ruleExists(e, a) {
        return vssMediaCollection.assembleMediaKey(e, a) in this.vssMediaRules;
    }
    createNewRule(e, a) {
        var s = vssMediaCollection.assembleMediaKey(e, a);
        return this.vssMediaRules[s] = new vssMediaRule(e, a);
    }
    getRule(e, a) {
        var s = vssMediaCollection.assembleMediaKey(e, a);
        return this.vssMediaRules[s];
    }
    getAllMediaRule() {
        var e = vssMediaCollection.assembleMediaKey('min', 'max');
        return this.vssMediaRules[e];
    }
    static assembleMediaKey(e, a) {
        return 'min' != e && isNaN(parseFloat(e)) || 'max' != a && isNaN(parseFloat(a)) || 'min' != e && 'max' != a && e > a ? 'invalid' : `${e}_${a}`;
    }
    computeStyle(e, a, s, i, l, t, r) {
        if ('point' == a) (n = new vssCanvasParameters).initializePointFeature(); else if ('line' == a) {
            (n = new vssCanvasParameters).initializeLineFeature();
        } else if ('polygon' == a) {
            (n = new vssCanvasParameters).initializePolygonFeature();
        } else if ('space' == a || 'sphere' == a) {
            (n = new vssCanvasParameters).initializeGeneralFeature(t), t = void 0;
        } else var n = new vssCanvasParameters;
        var m = this.getAllMediaRule();
        for (var v in m.computeMediaRuleStyle(n, a, s, i, l, t, r), this.vssMediaRules) if (this.vssMediaRules.hasOwnProperty(v)) {
            var u = this.vssMediaRules[v];
            'min' == u.minScale && 'max' == u.maxScale || ('min' == u.minScale && e <= u.maxScale || e > u.minScale && 'max' == u.maxScale || e > u.minScale && e <= u.maxScale) && u.computeMediaRuleStyle(n, a, s, i, l, t, r);
        }
        return n;
    }
    runCourtesyValidator(e, a, s, i, l, t, r) {
        var n = this.getAllMediaRule();
        for (var m in n.runCourtesyValidator(a, s, i, l, t, r), this.vssMediaRules) if (this.vssMediaRules.hasOwnProperty(m)) {
            var v = this.vssMediaRules[m];
            'min' == v.minScale && 'max' == v.maxScale || ('min' == v.minScale && e <= v.maxScale || e > v.minScale && 'max' == v.maxScale || e > v.minScale && e <= v.maxScale) && v.runCourtesyValidator(a, s, i, l, t, r);
        }
    }
}