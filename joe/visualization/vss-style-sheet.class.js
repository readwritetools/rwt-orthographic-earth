/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import vssMediaCollection from './vss-media-collection.class.js';

import vssProperty from './vss-property.class.js';

import cssTokenizer from './css-tokenizer.js';

import cssParser from './css-parser.js';

import expect from '../dev/expect.js';

import terminal from 'softlib/terminal.js';

export default class vssStyleSheet {
    constructor(e, t) {
        this.rwtOrthographicEarth = e, this.vssMediaCollection = new vssMediaCollection, 
        this.mapScale = t, this.allFeaturesNeedRestyling = !1, Object.seal(this);
    }
    setMapScale(e) {
        this.mapScale = e, this.allFeaturesNeedRestyling = !0;
    }
    async addVisualizationStyleSheet(e) {
        try {
            var t = await fetch(e, {
                cache: 'no-cache',
                referrerPolicy: 'no-referrer'
            });
            if (200 != t.status && 304 != t.status) throw new Error(`Request for ${e} returned with ${t.status}`);
            var r = await t.text();
            this.addVisualizationRule(r);
        } catch (e) {
            terminal.caught(e);
        }
    }
    addVisualizationRule(e) {
        var t = cssTokenizer(e), r = cssParser(t);
        if ('STYLESHEET' != r.type) return terminal.logic(`Expected 'STYLESHEET', but found ${r.type}`);
        var a = this.vssMediaCollection.getAllMediaRule();
        this.decodeSheet(a, r), this.allFeaturesNeedRestyling = !0, this.rwtOrthographicEarth.broadcastMessage('visualization/styleSheetAdded', null);
    }
    decodeSheet(e, t) {
        for (var r = 0; r < t.value.length; r++) {
            var a = t.value[r];
            if ('AT-RULE' != a.type) if ('STYLE-RULE' == a.type) for (var n = this.determineSelectorName(a.selector), l = 0; l < a.value.length; l++) {
                var i = a.value[l];
                if ('DECLARATION' == i.type) for (var o = this.determinePropertyValuePair(i.name, i.value), s = 0; s < n.length; s++) {
                    var c = n[s];
                    if (e.selectorExists(c)) var u = e.getSelector(c); else u = e.createNewSelector(c);
                    u.addProperty(o);
                } else terminal.logic(`Expected 'DECLARATION', but found ${i.type} . . . skipping`);
            } else terminal.logic(`Expected 'AT-RULE' or 'STYLE-RULE', but found ${a.type} . . . skipping`); else {
                if ('media' != a.name) continue;
                var p = this.determineValidMapScales(a.prelude);
                if (this.vssMediaCollection.ruleExists(p.minScale, p.maxScale)) var v = this.vssMediaCollection.getRule(p.minScale, p.maxScale); else v = this.vssMediaCollection.createNewRule(p.minScale, p.maxScale);
                this.decodeSheet(v, a);
            }
        }
    }
    determineValidMapScales(e) {
        for (var t = {
            minScale: 'min',
            maxScale: 'max'
        }, r = 0; r < e.length; r++) if ('BLOCK' == e[r].type && '(' == e[r].name) {
            for (var a = '', n = '', l = 0; l < e[r].value.length; l++) {
                var i = e[r].value[l];
                if ('IDENT' == i.tokenType) a = i.value; else {
                    if (':' == i.tokenType) continue;
                    'NUMBER' == i.tokenType && (n = i.value);
                }
            }
            'gt-scale' == a ? t.minScale = n : 'ng-scale' == a && (t.maxScale = n);
        } else if ('IDENT' == e[r].tokenType && 'and' == e[r].value) continue;
        return t;
    }
    determineSelectorName(e) {
        for (var t = [], r = '', a = 0; a < e.length; a++) if ('DELIM' == e[a].tokenType && '.' == e[a].value) r += e[a].value; else if ('HASH' == e[a].tokenType) r += '#' + e[a].value; else if ('IDENT' == e[a].tokenType) r += e[a].value; else if ('BLOCK' == e[a].type && '[' == e[a].name) {
            for (var n = '', l = e[a].value, i = 0; i < l.length; i++) 'IDENT' == l[i].tokenType || 'DELIM' == l[i].tokenType || 'NUMBER' == l[i].tokenType ? n += l[i].value : 'STRING' == l[i].tokenType && (n += `"${l[i].value}"`);
            r += `[${n}]`;
        } else 'DELIM' == e[a].tokenType && ',' == e[a].value && (t.push(r), r = '');
        return t.push(r), t;
    }
    determinePropertyValuePair(e, t) {
        var r = new vssProperty;
        r.name = e;
        for (var a = 0; a < t.length; a++) {
            var n = t[a];
            if ('BLOCK' == n.type && '(' == n.name) {
                for (var l = [], i = n.value, o = 0; o < i.length; o++) 'HASH' == i[o].tokenType && l.push('#' + i[o].value);
                r.value = l;
            } else if ('FUNCTION' == n.type) r.value = this.decodeFunction(r.name, n.name, n.value); else switch (n.tokenType) {
              case 'WHITESPACE':
                continue;

              case 'DIMENSION':
                r.value = n.num;
                break;

              case 'HASH':
                r.value = '#' + n.value;
                break;

              case 'NUMBER':
              case 'IDENT':
                r.value = n.value;
                break;

              default:
                continue;
            }
        }
        return r;
    }
    decodeFunction(e, t, r) {
        if (expect(name, 'String'), expect(r, 'Array'), 'rgb' == t || 'RGB' == t) {
            if (3 != r.length) return terminal.abnormal(`VSS style sheet expected 3 arguments to ${t} for property ${e}`), 
            null;
            return `#${convertIntegerToHex(getFunctionArg(r[0]))}${convertIntegerToHex(getFunctionArg(r[1]))}${convertIntegerToHex(getFunctionArg(r[2]))}`;
        }
        if ('rgba' == t || 'RGBA' == t) {
            if (4 != r.length) return terminal.abnormal(`VSS style sheet expected 4 arguments to ${t} for property ${e}`), 
            null;
            return `#${convertIntegerToHex(getFunctionArg(r[0]))}${convertIntegerToHex(getFunctionArg(r[1]))}${convertIntegerToHex(getFunctionArg(r[2]))}${convertIntegerToHex(Math.round(255 * getFunctionArg(r[3]), 0))}`;
        }
        return terminal.abnormal(`VSS style sheet unhandled function ${t} for property ${e}`), 
        null;
    }
    computeStyle(e, t, r, a, n, l, i) {
        return this.vssMediaCollection.computeStyle(this.mapScale, e, t, r, a, n, l, i);
    }
    runCourtesyValidator(e, t, r, a, n, l) {
        this.vssMediaCollection.runCourtesyValidator(this.mapScale, e, t, r, a, n, l);
    }
}

function getFunctionArg(e) {
    expect(e, 'CSSParserRule');
    var t = e.value;
    return 'Array' != t.constructor.name || 1 != t.length || 'CSSParserToken' != t[0].constructor.name || 'integer' != t[0].type && 'number' != t[0].type ? 0 : t[0].value;
}

function convertIntegerToHex(e) {
    return expect(e, 'Number'), isNaN(e) || e < 0 || e > 255 ? '00' : e.toString(16).padStart(2, '0').toUpperCase();
}