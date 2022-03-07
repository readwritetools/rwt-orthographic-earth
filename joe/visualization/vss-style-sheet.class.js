/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import vssMediaCollection from './vss-media-collection.class.js';

import vssProperty from './vss-property.class.js';

import cssTokenizer from './css-tokenizer.js';

import cssParser from './css-parser.js';

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
            var a = await t.text();
            this.addVisualizationRule(a);
        } catch (e) {
            terminal.caught(e);
        }
    }
    addVisualizationRule(e) {
        var t = cssTokenizer(e), a = cssParser(t);
        if ('STYLESHEET' != a.type) return terminal.logic('Expected \'STYLESHEET\', but found %s', a.type);
        var l = this.vssMediaCollection.getAllMediaRule();
        this.decodeSheet(l, a), this.allFeaturesNeedRestyling = !0, this.rwtOrthographicEarth.broadcastMessage('visualization/styleSheetAdded', null);
    }
    decodeSheet(e, t) {
        for (var a = 0; a < t.value.length; a++) {
            var l = t.value[a];
            if ('AT-RULE' != l.type) if ('STYLE-RULE' == l.type) for (var s = this.determineSelectorName(l.selector), r = 0; r < l.value.length; r++) {
                var i = l.value[r];
                if ('DECLARATION' == i.type) for (var o = this.determinePropertyValuePair(i.name, i.value), n = 0; n < s.length; n++) {
                    var c = s[n];
                    if (e.selectorExists(c)) var u = e.getSelector(c); else u = e.createNewSelector(c);
                    u.addProperty(o);
                } else terminal.logic('Expected \'DECLARATION\', but found %s . . . skipping', i.type);
            } else terminal.logic('Expected \'AT-RULE\' or \'STYLE-RULE\', but found %s . . . skipping', l.type); else {
                if ('media' != l.name) continue;
                var v = this.determineValidMapScales(l.prelude);
                if (this.vssMediaCollection.ruleExists(v.minScale, v.maxScale)) var p = this.vssMediaCollection.getRule(v.minScale, v.maxScale); else p = this.vssMediaCollection.createNewRule(v.minScale, v.maxScale);
                this.decodeSheet(p, l);
            }
        }
    }
    determineValidMapScales(e) {
        for (var t = {
            minScale: 'min',
            maxScale: 'max'
        }, a = 0; a < e.length; a++) if ('BLOCK' == e[a].type && '(' == e[a].name) {
            for (var l = '', s = '', r = 0; r < e[a].value.length; r++) {
                var i = e[a].value[r];
                if ('IDENT' == i.tokenType) l = i.value; else {
                    if (':' == i.tokenType) continue;
                    'NUMBER' == i.tokenType && (s = i.value);
                }
            }
            'gt-scale' == l ? t.minScale = s : 'ng-scale' == l && (t.maxScale = s);
        } else if ('IDENT' == e[a].tokenType && 'and' == e[a].value) continue;
        return t;
    }
    determineSelectorName(e) {
        for (var t = [], a = '', l = 0; l < e.length; l++) if ('DELIM' == e[l].tokenType && '.' == e[l].value) a += e[l].value; else if ('HASH' == e[l].tokenType) a += '#' + e[l].value; else if ('IDENT' == e[l].tokenType) a += e[l].value; else if ('BLOCK' == e[l].type && '[' == e[l].name) {
            for (var s = '', r = e[l].value, i = 0; i < r.length; i++) 'IDENT' == r[i].tokenType || 'DELIM' == r[i].tokenType || 'NUMBER' == r[i].tokenType ? s += r[i].value : 'STRING' == r[i].tokenType && (s += `"${r[i].value}"`);
            a += `[${s}]`;
        } else 'DELIM' == e[l].tokenType && ',' == e[l].value && (t.push(a), a = '');
        return t.push(a), t;
    }
    determinePropertyValuePair(e, t) {
        var a = new vssProperty;
        a.name = e;
        for (var l = 0; l < t.length; l++) {
            var s = t[l];
            if ('BLOCK' == s.type && '(' == s.name) {
                for (var r = [], i = s.value, o = 0; o < i.length; o++) 'HASH' == i[o].tokenType && r.push('#' + i[o].value);
                a.value = r;
            } else switch (s.tokenType) {
              case 'WHITESPACE':
                continue;

              case 'DIMENSION':
                a.value = s.num;
                break;

              case 'HASH':
                a.value = '#' + s.value;
                break;

              case 'NUMBER':
              case 'IDENT':
                a.value = s.value;
                break;

              default:
                continue;
            }
        }
        return a;
    }
    computeStyle(e, t, a, l, s, r) {
        return this.vssMediaCollection.computeStyle(this.mapScale, e, t, a, l, s, r);
    }
    runCourtesyValidator(e, t, a, l, s, r) {
        this.vssMediaCollection.runCourtesyValidator(this.mapScale, e, t, a, l, s, r);
    }
}