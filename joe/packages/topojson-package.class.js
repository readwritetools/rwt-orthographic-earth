/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import ExternalPackage from './external-package.class.js';

import PointFeature from '../features/point-feature.class.js';

import LineFeature from '../features/line-feature.class.js';

import PolygonFeature from '../features/polygon-feature.class.js';

import ProjectedPoint from '../projection/projected-point.class.js';

import expect from '../dev/expect.js';

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
            var a = await fetch(e, {
                cache: 'no-cache',
                referrerPolicy: 'no-referrer'
            });
            if (200 != a.status && 304 != a.status) throw new Error(`Request for ${e} returned with ${a.status}`);
            var i = await a.json();
            this.handlePackageData(i);
        } catch (t) {
            terminal.caught(t);
        }
    }
    handlePackageData(t) {
        if (expect(t, 'Object'), 'replace' == this.replaceAppend && (this.featurePolygons = [], 
        this.featureLines = [], this.featurePoints = []), 'objects' in t == 0) return terminal.abnormal(`No objects in topoJSON "${this.url}"`);
        if (this.topojsonObjects = t.objects, 'arcs' in t == 0) return terminal.abnormal(`No arcs in topoJSON "${this.url}"`);
        if (this.topojsonArcs = t.arcs, 'transform' in t == 0) return terminal.abnormal(`No transform in topoJSON "${this.url}"`);
        if (this.scaleX = parseFloat(t.transform.scale[0]), this.scaleY = parseFloat(t.transform.scale[1]), 
        isNaN(this.scaleX) && (this.scaleX = 1), isNaN(this.scaleY) && (this.scaleY = 1), 
        this.translateX = parseFloat(t.transform.translate[0]), this.translateY = parseFloat(t.transform.translate[1]), 
        this.embeddedName in t.objects == 0) return terminal.abnormal(`No embeddedName by the name of ${this.embeddedName} in "${this.url}"`);
        var e = this.topojsonObjects[this.embeddedName];
        if ('GeometryCollection' != e.type) return terminal.abnormal(`Expected GeometryCollection, but found ${e.type} in "${this.url}"`);
        for (var r = 0; r < e.geometries.length; r++) {
            var a = e.geometries[r], i = this.importKeyValuePairs(a), s = '';
            if (null != i && '' != this.featureKey && (i.hasOwnProperty(this.featureKey) ? s = i[this.featureKey] : (s = '', 
            terminal.trace(`No featureKey by the name of ${this.featureKey} while parsing ${this.url}, VSS rules that use ${this.featureKey} will not work`))), 
            'type' in a != 0 && null != a.type) if ('MultiPolygon' == a.type) this.importMultiPolygon(a, i, s); else if ('Polygon' == a.type) this.importPolygon(a, i, s); else if ('MultiLineString' == a.type) this.importMultiLine(a, i, s); else if ('LineString' == a.type) this.importLine(a, i, s); else if ('MultiPoint' == a.type) this.importMultiPoint(a, i, s); else {
                if ('Point' != a.type) {
                    terminal.abnormal(`Info: [${r}] Skipping unknown geometry type ${a.type} in "${this.url}"`);
                    continue;
                }
                this.importPoint(a, i, s);
            }
        }
        this.topojsonObjects = null, this.topojsonTransform = null, this.topojsonArcs = null, 
        this.packagePointsNeedGeoCoords = !0, this.packagePointsNeedProjection = !0, this.packagePointsNeedTransformation = !0, 
        this.packagePointsNeedPlacement = !0, this.rwtOrthographicEarth.broadcastMessage('package/topojson-package', this.url);
    }
    importKeyValuePairs(t) {
        if ('properties' in t == 0) return {};
        var e = {};
        for (var r in t.properties) {
            var a = t.properties[r];
            e[r] = a;
        }
        return e;
    }
    importMultiPolygon(t, e, r) {
        if ('MultiPolygon' != t.type) return terminal.abnormal(`Expected MultiPolygon, but found ${t.type}`);
        for (var a = 0; a < t.arcs.length; a++) {
            var i = new PolygonFeature;
            i.kvPairs = e, i.featureName = r;
            for (var s = 0; s < t.arcs[a].length; s++) if (0 == s) this.featurePolygons.push(i), 
            this.importArcLists(i.outerRing, t.arcs[a][s]); else {
                var o = new PolygonFeature;
                i.innerRings.push(o), this.importArcLists(o.outerRing, t.arcs[a][s]);
            }
        }
    }
    importPolygon(t, e, r) {
        if ('Polygon' != t.type) return terminal.abnormal(`Expected Polygon, but found ${t.type}`);
        for (var a = 0; a < t.arcs.length; a++) {
            var i = new PolygonFeature;
            if (i.kvPairs = e, i.featureName = r, 0 == a) this.featurePolygons.push(i), this.importArcLists(i.outerRing, t.arcs[a]); else {
                var s = new PolygonFeature;
                i.innerRings.push(s), this.importArcLists(s.outerRing, t.arcs[a]);
            }
        }
    }
    importMultiLine(t, e, r) {
        if ('MultiLineString' != t.type) return terminal.abnormal(`Expected MultiLineString, but found ${t.type}`);
        for (var a = 0; a < t.arcs.length; a++) {
            var i = new LineFeature;
            i.kvPairs = e, i.featureName = r;
            for (var s = 0; s < t.arcs[a].length; s++) {
                var o = t.arcs[a][s], n = !1;
                o < 0 && (n = !0, o = Math.abs(o) - 1);
                var l = this.topojsonArcs[o];
                this.addArcToFeature(i.lineSegment, l, n);
            }
            this.featureLines.push(i);
        }
    }
    importLine(t, e, r) {
        if ('LineString' != t.type) return terminal.abnormal(`Expected LineString, but found ${t.type}`);
        for (var a = 0; a < t.arcs.length; a++) {
            var i = new LineFeature;
            i.kvPairs = e, i.featureName = r;
            var s = t.arcs[a], o = !1;
            s < 0 && (o = !0, s = Math.abs(s) - 1);
            var n = this.topojsonArcs[s];
            this.addArcToFeature(i.lineSegment, n, o), this.featureLines.push(i);
        }
    }
    importMultiPoint(t, e, r) {
        if ('MultiPoint' != t.type) return terminal.abnormal(`Expected MultiPoint, but found ${t.type}`);
        for (var a = 0; a < t.coordinates.length; a++) {
            var i = t.coordinates[a][0], s = t.coordinates[a][1], o = i * this.scaleX + this.translateX, n = s * this.scaleY + this.translateY, l = new ProjectedPoint(n, o), u = new PointFeature;
            u.kvPairs = e, u.featureName = r, u.discretePoint = l, this.featurePoints.push(u);
        }
    }
    importPoint(t, e, r) {
        if ('Point' != t.type) return terminal.abnormal(`Expected Point, but found ${t.type}`);
        var a = t.coordinates[0], i = t.coordinates[1], s = a * this.scaleX + this.translateX, o = i * this.scaleY + this.translateY, n = new ProjectedPoint(o, s), l = new PointFeature;
        l.kvPairs = e, l.featureName = r, l.discretePoint = n, this.featurePoints.push(l);
    }
    importArcLists(t, e) {
        for (var r = 0; r < e.length; r++) {
            var a = e[r], i = !1;
            a < 0 && (i = !0, a = Math.abs(a) - 1);
            var s = this.topojsonArcs[a];
            this.addArcToFeature(t, s, i);
        }
    }
    addArcToFeature(t, e, r) {
        for (var a = 0, i = 0, s = e.length, o = [], n = 0; n < s; n++) {
            a += e[p = n][0], i += e[p][1];
            var l = a * this.scaleX + this.translateX, u = i * this.scaleY + this.translateY, h = new ProjectedPoint(u, l);
            o.push(h);
        }
        for (n = 0; n < s; n++) {
            var p = 1 == r ? s - n - 1 : n;
            t.push(o[p]);
        }
    }
}