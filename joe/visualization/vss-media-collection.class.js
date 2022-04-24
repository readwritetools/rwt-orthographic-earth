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
    computeStyle(e, a, s, i, l, t, r, n) {
        if ('point' == a) (m = new vssCanvasParameters).initializePointFeature(); else if ('line' == a) {
            (m = new vssCanvasParameters).initializeLineFeature();
        } else if ('polygon' == a) {
            (m = new vssCanvasParameters).initializePolygonFeature();
        } else if ('space' == a || 'sphere' == a) {
            (m = new vssCanvasParameters).initializeGeneralFeature(r), r = void 0;
        } else var m = new vssCanvasParameters;
        var v = this.getAllMediaRule();
        for (var u in v.computeMediaRuleStyle(m, a, s, i, l, t, r, n), this.vssMediaRules) if (this.vssMediaRules.hasOwnProperty(u)) {
            var o = this.vssMediaRules[u];
            'min' == o.minScale && 'max' == o.maxScale || ('min' == o.minScale && e <= o.maxScale || e > o.minScale && 'max' == o.maxScale || e > o.minScale && e <= o.maxScale) && o.computeMediaRuleStyle(m, a, s, i, l, t, r, n);
        }
        return m;
    }
    runCourtesyValidator(e, a, s, i, l, t, r) {
        var n = this.getAllMediaRule();
        for (var m in n.runCourtesyValidator(a, s, i, l, t, r), this.vssMediaRules) if (this.vssMediaRules.hasOwnProperty(m)) {
            var v = this.vssMediaRules[m];
            'min' == v.minScale && 'max' == v.maxScale || ('min' == v.minScale && e <= v.maxScale || e > v.minScale && 'max' == v.maxScale || e > v.minScale && e <= v.maxScale) && v.runCourtesyValidator(a, s, i, l, t, r);
        }
    }
}