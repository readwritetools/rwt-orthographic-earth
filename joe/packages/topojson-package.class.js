/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import ExternalPackage from './external-package.class.js';

import PointFeature from '../features/point-feature.class.js';

import LineFeature from '../features/line-feature.class.js';

import PolygonFeature from '../features/polygon-feature.class.js';

import ProjectedPoint from '../projection/projected-point.class.js';

import expect from 'softlib/expect.js';

import terminal from 'softlib/terminal.js';

export default class TopojsonPackage extends ExternalPackage {
    constructor(t) {
        super(t), this.embeddedName = '', this.topojsonObjects = null, this.topojsonArcs = null, 
        this.scaleX = null, this.scaleY = null, this.translateX = null, this.translateY = null, 
        this.topojsonObjects = null, this.topojsonTransform = null, this.topojsonArcs = null, 
        Object.seal(this);
    }
    async retrieveData(t, e, r) {
        expect(t, 'String'), expect(e, 'String'), expect(r, 'Object'), this.replaceAppend = t, 
        this.url = e, this.featureKey = r.featureKey || '', this.embeddedName = r.embeddedName || '';
        try {
            var s = await fetch(e, {
                cache: 'no-cache',
                referrerPolicy: 'no-referrer'
            });
            if (200 != s.status && 304 != s.status) throw new Error(`Request for ${e} returned with ${s.status}`);
            var a = await s.json();
            this.handlePackageData(a);
        } catch (t) {
            terminal.abnormal(t.message);
        }
    }
    handlePackageData(t) {
        if (expect(t, 'Object'), 'replace' == this.replaceAppend && (this.featurePolygons = [], 
        this.featureLines = [], this.featurePoints = []), 'objects' in t == 0) return terminal.abnormal('No objects in topoJSON "%s"', this.url);
        if (this.topojsonObjects = t.objects, 'arcs' in t == 0) return terminal.abnormal('No arcs in topoJSON "%s"', this.url);
        if (this.topojsonArcs = t.arcs, 'transform' in t == 0) return terminal.abnormal('No transform in topoJSON "%s"', this.url);
        if (this.scaleX = parseFloat(t.transform.scale[0]), this.scaleY = parseFloat(t.transform.scale[1]), 
        isNaN(this.scaleX) && (this.scaleX = 1), isNaN(this.scaleY) && (this.scaleY = 1), 
        this.translateX = parseFloat(t.transform.translate[0]), this.translateY = parseFloat(t.transform.translate[1]), 
        this.embeddedName in t.objects == 0) return terminal.abnormal('No embeddedName by the name of %s in "%s"', this.embeddedName, this.url);
        var e = this.topojsonObjects[this.embeddedName];
        if ('GeometryCollection' != e.type) return terminal.abnormal('Expected GeometryCollection, but found %s in "%s"', e.type, this.url);
        for (var r = 0; r < e.geometries.length; r++) {
            var s = e.geometries[r], a = this.importKeyValuePairs(s), i = '';
            if (null != a && '' != this.featureKey && (a.hasOwnProperty(this.featureKey) ? i = a[this.featureKey] : (i = '', 
            terminal.trace('No featureKey by the name of %s while parsing %s, VSS rules that use %s will not work', this.featureKey, this.url, this.featureKey))), 
            'type' in s != 0 && null != s.type) if ('MultiPolygon' == s.type) this.importMultiPolygon(s, a, i); else if ('Polygon' == s.type) this.importPolygon(s, a, i); else if ('MultiLineString' == s.type) this.importMultiLine(s, a, i); else if ('LineString' == s.type) this.importLine(s, a, i); else if ('MultiPoint' == s.type) this.importMultiPoint(s, a, i); else {
                if ('Point' != s.type) {
                    terminal.abnormal('Info: i[%d] Skipping unknown geometry type %s in "%s"', r, s.type, this.url);
                    continue;
                }
                this.importPoint(s, a, i);
            }
        }
        this.topojsonObjects = null, this.topojsonTransform = null, this.topojsonArcs = null, 
        this.packagePointsNeedGeoCoords = !0, this.packagePointsNeedProjection = !0, this.packagePointsNeedTransformation = !0, 
        this.packagePointsNeedPlacement = !0, this.rwtOrthographicEarth.broadcastMessage('package/external', this.url);
    }
    importKeyValuePairs(t) {
        if ('properties' in t == 0) return {};
        var e = {};
        for (var r in t.properties) {
            var s = t.properties[r];
            e[r] = s;
        }
        return e;
    }
    importMultiPolygon(t, e, r) {
        if ('MultiPolygon' != t.type) return terminal.abnormal('Expected MultiPolygon, but found %s', t.type);
        for (var s = 0; s < t.arcs.length; s++) {
            var a = new PolygonFeature;
            a.kvPairs = e, a.featureName = r;
            for (var i = 0; i < t.arcs[s].length; i++) if (0 == i) this.featurePolygons.push(a), 
            this.importArcLists(a.outerRing, t.arcs[s][i]); else {
                var o = new PolygonFeature;
                a.innerRings.push(o), this.importArcLists(o.outerRing, t.arcs[s][i]);
            }
        }
    }
    importPolygon(t, e, r) {
        if ('Polygon' != t.type) return terminal.abnormal('Expected Polygon, but found %s', t.type);
        for (var s = 0; s < t.arcs.length; s++) {
            var a = new PolygonFeature;
            if (a.kvPairs = e, a.featureName = r, 0 == s) this.featurePolygons.push(a), this.importArcLists(a.outerRing, t.arcs[s]); else {
                var i = new PolygonFeature;
                a.innerRings.push(i), this.importArcLists(i.outerRing, t.arcs[s]);
            }
        }
    }
    importMultiLine(t, e, r) {
        if ('MultiLineString' != t.type) return terminal.abnormal('Expected MultiLineString, but found %s', t.type);
        for (var s = 0; s < t.arcs.length; s++) {
            var a = new LineFeature;
            a.kvPairs = e, a.featureName = r;
            for (var i = 0; i < t.arcs[s].length; i++) {
                var o = t.arcs[s][i], n = !1;
                o < 0 && (n = !0, o = Math.abs(o) - 1);
                var l = this.topojsonArcs[o];
                this.addArcToFeature(a.lineSegment, l, n);
            }
            this.featureLines.push(a);
        }
    }
    importLine(t, e, r) {
        if ('LineString' != t.type) return terminal.abnormal('Expected LineString, but found %s', t.type);
        for (var s = 0; s < t.arcs.length; s++) {
            var a = new LineFeature;
            a.kvPairs = e, a.featureName = r;
            var i = t.arcs[s], o = !1;
            i < 0 && (o = !0, i = Math.abs(i) - 1);
            var n = this.topojsonArcs[i];
            this.addArcToFeature(a.lineSegment, n, o), this.featureLines.push(a);
        }
    }
    importMultiPoint(t, e, r) {
        if ('MultiPoint' != t.type) return terminal.abnormal('Expected MultiPoint, but found %s', t.type);
        for (var s = 0; s < t.coordinates.length; s++) {
            var a = t.coordinates[s][0], i = t.coordinates[s][1], o = a * this.scaleX + this.translateX, n = i * this.scaleY + this.translateY, l = new ProjectedPoint(n, o), u = new PointFeature;
            u.kvPairs = e, u.featureName = r, u.discretePoint = l, this.featurePoints.push(u);
        }
    }
    importPoint(t, e, r) {
        if ('Point' != t.type) return terminal.abnormal('Expected Point, but found %s', t.type);
        var s = t.coordinates[0], a = t.coordinates[1], i = s * this.scaleX + this.translateX, o = a * this.scaleY + this.translateY, n = new ProjectedPoint(o, i), l = new PointFeature;
        l.kvPairs = e, l.featureName = r, l.discretePoint = n, this.featurePoints.push(l);
    }
    importArcLists(t, e) {
        for (var r = 0; r < e.length; r++) {
            var s = e[r], a = !1;
            s < 0 && (a = !0, s = Math.abs(s) - 1);
            var i = this.topojsonArcs[s];
            this.addArcToFeature(t, i, a);
        }
    }
    addArcToFeature(t, e, r) {
        for (var s = 0, a = 0, i = e.length, o = [], n = 0; n < i; n++) {
            s += e[p = n][0], a += e[p][1];
            var l = s * this.scaleX + this.translateX, u = a * this.scaleY + this.translateY, h = new ProjectedPoint(u, l);
            o.push(h);
        }
        for (n = 0; n < i; n++) {
            var p = 1 == r ? i - n - 1 : n;
            t.push(o[p]);
        }
    }
}