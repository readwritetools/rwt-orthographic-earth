/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import vssMediaCollection from './vss-media-collection.class.js';

import vssProperty from './vss-property.class.js';

import cssTokenizer from './css-tokenizer.js';

import cssParser from './css-parser.js';

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
            console.log(e.message);
        }
    }
    addVisualizationRule(e) {
        var t = cssTokenizer(e), a = cssParser(t);
        if ('STYLESHEET' != a.type) return console.log('Expected \'STYLESHEET\', but found %s', a.type);
        var s = this.vssMediaCollection.getAllMediaRule();
        this.decodeSheet(s, a), this.allFeaturesNeedRestyling = !0, this.rwtOrthographicEarth.broadcastMessage('visualization/styleSheetAdded', null);
    }
    decodeSheet(e, t) {
        for (var a = 0; a < t.value.length; a++) {
            var s = t.value[a];
            if ('AT-RULE' != s.type) if ('STYLE-RULE' == s.type) for (var l = this.determineSelectorName(s.selector), r = 0; r < s.value.length; r++) {
                var i = s.value[r];
                if ('DECLARATION' == i.type) for (var o = this.determinePropertyValuePair(i.name, i.value), n = 0; n < l.length; n++) {
                    var c = l[n];
                    if (e.selectorExists(c)) var u = e.getSelector(c); else u = e.createNewSelector(c);
                    u.addProperty(o);
                } else console.log('Expected \'DECLARATION\', but found %s . . . skipping', i.type);
            } else console.log('Expected \'AT-RULE\' or \'STYLE-RULE\', but found %s . . . skipping', s.type); else {
                if ('media' != s.name) continue;
                var v = this.determineValidMapScales(s.prelude);
                if (this.vssMediaCollection.ruleExists(v.minScale, v.maxScale)) var p = this.vssMediaCollection.getRule(v.minScale, v.maxScale); else p = this.vssMediaCollection.createNewRule(v.minScale, v.maxScale);
                this.decodeSheet(p, s);
            }
        }
    }
    determineValidMapScales(e) {
        for (var t = {
            minScale: 'min',
            maxScale: 'max'
        }, a = 0; a < e.length; a++) if ('BLOCK' == e[a].type && '(' == e[a].name) {
            for (var s = '', l = '', r = 0; r < e[a].value.length; r++) {
                var i = e[a].value[r];
                if ('IDENT' == i.tokenType) s = i.value; else {
                    if (':' == i.tokenType) continue;
                    'NUMBER' == i.tokenType && (l = i.value);
                }
            }
            'gt-scale' == s ? t.minScale = l : 'ng-scale' == s && (t.maxScale = l);
        } else if ('IDENT' == e[a].tokenType && 'and' == e[a].value) continue;
        return t;
    }
    determineSelectorName(e) {
        for (var t = [], a = '', s = 0; s < e.length; s++) if ('DELIM' == e[s].tokenType && '.' == e[s].value) a += e[s].value; else if ('HASH' == e[s].tokenType) a += '#' + e[s].value; else if ('IDENT' == e[s].tokenType) a += e[s].value; else if ('BLOCK' == e[s].type && '[' == e[s].name) {
            for (var l = '', r = e[s].value, i = 0; i < r.length; i++) 'IDENT' == r[i].tokenType || 'DELIM' == r[i].tokenType || 'NUMBER' == r[i].tokenType ? l += r[i].value : 'STRING' == r[i].tokenType && (l += `"${r[i].value}"`);
            a += `[${l}]`;
        } else 'DELIM' == e[s].tokenType && ',' == e[s].value && (t.push(a), a = '');
        return t.push(a), t;
    }
    determinePropertyValuePair(e, t) {
        var a = new vssProperty;
        a.name = e;
        for (var s = 0; s < t.length; s++) {
            var l = t[s];
            if ('BLOCK' == l.type && '(' == l.name) {
                for (var r = [], i = l.value, o = 0; o < i.length; o++) 'HASH' == i[o].tokenType && r.push('#' + i[o].value);
                a.value = r;
            } else switch (l.tokenType) {
              case 'WHITESPACE':
                continue;

              case 'DIMENSION':
                a.value = l.num, a.units = l.unit;
                break;

              case 'HASH':
                a.value = '#' + l.value;
                break;

              case 'NUMBER':
              case 'IDENT':
                a.value = l.value;
                break;

              default:
                continue;
            }
        }
        return a;
    }
    computeStyle(e, t, a, s, l, r) {
        return this.vssMediaCollection.computeStyle(this.mapScale, e, t, a, s, l, r);
    }
}