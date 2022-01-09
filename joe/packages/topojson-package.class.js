/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BasePackage from './base-package.class.js';

import PointFeature from '../features/point-feature.class.js';

import LineFeature from '../features/line-feature.class.js';

import PolygonFeature from '../features/polygon-feature.class.js';

import ProjectedPoint from '../projection/projected-point.class.js';

import expect from '../joezone/expect.js';

export default class TopojsonPackage extends BasePackage {
    constructor(e) {
        super(e), this.featurePolygons = [], this.featureLines = [], this.featurePoints = [], 
        this.replaceAppend = '', this.url = '', this.embeddedName = '', this.topojsonObjects = null, 
        this.topojsonArcs = null, this.scaleX = null, this.scaleY = null, this.translateX = null, 
        this.translateY = null, this.topojsonObjects = null, this.topojsonTransform = null, 
        this.topojsonArcs = null, Object.seal(this);
    }
    async retrieveData(e, t, r) {
        expect(e, 'String'), expect(t, 'String'), expect(r, 'String'), this.replaceAppend = e, 
        this.url = t, this.embeddedName = r;
        try {
            var s = await fetch(t, {
                cache: 'no-cache',
                referrerPolicy: 'no-referrer'
            });
            if (200 != s.status && 304 != s.status) throw new Error(`Request for ${t} returned with ${s.status}`);
            var o = await s.json();
            this.handlePackageData(o);
        } catch (e) {
            console.error(e.message);
        }
    }
    handlePackageData(e) {
        if (expect(e, 'Object'), 'replace' == this.replaceAppend && (this.featurePolygons = [], 
        this.featureLines = [], this.featurePoints = []), 'objects' in e == 0) return console.error('No objects in topoJSON "%s"', this.url);
        if (this.topojsonObjects = e.objects, 'arcs' in e == 0) return console.error('No arcs in topoJSON "%s"', this.url);
        if (this.topojsonArcs = e.arcs, 'transform' in e == 0) return console.error('No transform in topoJSON "%s"', this.url);
        if (this.scaleX = parseFloat(e.transform.scale[0]), this.scaleY = parseFloat(e.transform.scale[1]), 
        isNaN(this.scaleX) && (this.scaleX = 1), isNaN(this.scaleY) && (this.scaleY = 1), 
        this.translateX = parseFloat(e.transform.translate[0]), this.translateY = parseFloat(e.transform.translate[1]), 
        this.embeddedName in e.objects == 0) return console.error('No embeddedName by the name of %s in "%s"', this.embeddedName, this.url);
        var t = this.topojsonObjects[this.embeddedName];
        if ('GeometryCollection' != t.type) return console.error('Expected GeometryCollection, but found %s in "%s"', t.type, this.url);
        for (var r = 0; r < t.geometries.length; r++) {
            var s = t.geometries[r], o = this.importKeyValuePairs(s), i = '';
            if ('type' in s != 0 && null != s.type) if ('MultiPolygon' == s.type) this.importMultiPolygon(s, o, i); else if ('Polygon' == s.type) this.importPolygon(s, o, i); else if ('MultiLineString' == s.type) this.importMultiLine(s, o, i); else if ('LineString' == s.type) this.importLine(s, o, i); else if ('MultiPoint' == s.type) this.importMultiPoint(s, o, i); else {
                if ('Point' != s.type) {
                    console.error('Info: i[%d] Skipping unknown geometry type %s in "%s"', r, s.type, this.url);
                    continue;
                }
                this.importPoint(s, o, i);
            }
        }
        this.topojsonObjects = null, this.topojsonTransform = null, this.topojsonArcs = null, 
        this.packagePointsNeedGeoCoords = !0, this.packagePointsNeedProjection = !0, this.packagePointsNeedTransformation = !0, 
        this.packagePointsNeedPlacement = !0, this.rwtOrthographicEarth.broadcastMessage('package/topojson', this.embeddedName);
    }
    importKeyValuePairs(e) {
        if ('properties' in e == 0) return {};
        var t = {};
        for (var r in e.properties) {
            var s = e.properties[r];
            t[r] = s;
        }
        return t;
    }
    importMultiPolygon(e, t, r) {
        if ('MultiPolygon' != e.type) return console.error('Expected MultiPolygon, but found %s', e.type);
        for (var s = 0; s < e.arcs.length; s++) {
            var o = new PolygonFeature;
            o.kvPairs = t, o.featureName = r;
            for (var i = 0; i < e.arcs[s].length; i++) if (0 == i) this.featurePolygons.push(o), 
            this.importArcLists(o.outerRing, e.arcs[s][i]); else {
                var n = new PolygonFeature;
                o.innerRings.push(n), this.importArcLists(n.outerRing, e.arcs[s][i]);
            }
        }
    }
    importPolygon(e, t, r) {
        if ('Polygon' != e.type) return console.error('Expected Polygon, but found %s', e.type);
        for (var s = 0; s < e.arcs.length; s++) {
            var o = new PolygonFeature;
            if (o.kvPairs = t, o.featureName = r, 0 == s) this.featurePolygons.push(o), this.importArcLists(o.outerRing, e.arcs[s]); else {
                var i = new PolygonFeature;
                o.innerRings.push(i), this.importArcLists(i.outerRing, e.arcs[s]);
            }
        }
    }
    importMultiLine(e, t, r) {
        if ('MultiLineString' != e.type) return console.error('Expected MultiLineString, but found %s', e.type);
        for (var s = 0; s < e.arcs.length; s++) {
            var o = new LineFeature;
            o.kvPairs = t, o.featureName = r;
            for (var i = 0; i < e.arcs[s].length; i++) {
                var n = e.arcs[s][i], a = !1;
                n < 0 && (a = !0, n = Math.abs(n) - 1);
                var l = this.topojsonArcs[n];
                this.addArcToFeature(o.lineSegment, l, a);
            }
            this.featureLines.push(o);
        }
    }
    importLine(e, t, r) {
        if ('LineString' != e.type) return console.error('Expected LineString, but found %s', e.type);
        for (var s = 0; s < e.arcs.length; s++) {
            var o = new LineFeature;
            o.kvPairs = t, o.featureName = r;
            var i = e.arcs[s], n = !1;
            i < 0 && (n = !0, i = Math.abs(i) - 1);
            var a = this.topojsonArcs[i];
            this.addArcToFeature(o.lineSegment, a, n), this.featureLines.push(o);
        }
    }
    importMultiPoint(e, t, r) {
        if ('MultiPoint' != e.type) return console.error('Expected MultiPoint, but found %s', e.type);
        for (var s = 0; s < e.coordinates.length; s++) {
            var o = e.coordinates[s][0], i = e.coordinates[s][1], n = o * this.scaleX + this.translateX, a = i * this.scaleY + this.translateY, l = new ProjectedPoint(a, n), h = new PointFeature;
            h.kvPairs = t, h.featureName = r, h.discretePoint = l, this.featurePoints.push(h);
        }
    }
    importPoint(e, t, r) {
        if ('Point' != e.type) return console.error('Expected Point, but found %s', e.type);
        var s = e.coordinates[0], o = e.coordinates[1], i = s * this.scaleX + this.translateX, n = o * this.scaleY + this.translateY, a = new ProjectedPoint(n, i), l = new PointFeature;
        l.kvPairs = t, l.featureName = r, l.discretePoint = a, this.featurePoints.push(l);
    }
    importArcLists(e, t) {
        for (var r = 0; r < t.length; r++) {
            var s = t[r], o = !1;
            s < 0 && (o = !0, s = Math.abs(s) - 1);
            var i = this.topojsonArcs[s];
            this.addArcToFeature(e, i, o);
        }
    }
    addArcToFeature(e, t, r) {
        for (var s = 0, o = 0, i = t.length, n = [], a = 0; a < i; a++) {
            s += t[f = a][0], o += t[f][1];
            var l = s * this.scaleX + this.translateX, h = o * this.scaleY + this.translateY, u = new ProjectedPoint(h, l);
            n.push(u);
        }
        for (a = 0; a < i; a++) {
            var f = 1 == r ? i - a - 1 : a;
            e.push(n[f]);
        }
    }
    recomputeStyles(e, t, r) {
        expect(e, 'vssStyleSheet'), expect(t, 'Layer'), expect(r, 'Number');
        for (var s = 0; s < this.featurePolygons.length; s++) this.featurePolygons[s].computeFeatureStyle(e, t.vssClassname, t.vssIdentifier, s, r);
        for (s = 0; s < this.featureLines.length; s++) this.featureLines[s].computeFeatureStyle(e, t.vssClassname, t.vssIdentifier, s, r);
        for (s = 0; s < this.featurePoints.length; s++) this.featurePoints[s].computeFeatureStyle(e, t.vssClassname, t.vssIdentifier, s, r);
        t.layerNeedsRestyling = !1;
    }
    runCourtesyValidator(e, t, r) {
        expect(e, 'vssStyleSheet'), expect(t, 'Layer'), expect(r, 'Number');
        for (var s = 0; s < this.featurePolygons.length; s++) this.featurePolygons[s].runCourtesyValidator(e, t.vssClassname, t.vssIdentifier, s, r);
        for (s = 0; s < this.featureLines.length; s++) this.featureLines[s].runCourtesyValidator(e, t.vssClassname, t.vssIdentifier, s, r);
        for (s = 0; s < this.featurePoints.length; s++) this.featurePoints[s].runCourtesyValidator(e, t.vssClassname, t.vssIdentifier, s, r);
    }
    rotation(e) {
        for (var t = 0; t < this.featurePolygons.length; t++) this.featurePolygons[t].toGeoCoords(e);
        for (t = 0; t < this.featureLines.length; t++) this.featureLines[t].toGeoCoords(e);
        for (t = 0; t < this.featurePoints.length; t++) this.featurePoints[t].toGeoCoords(e);
        this.packagePointsNeedGeoCoords = !1, this.packagePointsNeedProjection = !0;
    }
    projection(e) {
        for (var t = 0; t < this.featurePolygons.length; t++) this.featurePolygons[t].toPlane(e);
        for (t = 0; t < this.featureLines.length; t++) this.featureLines[t].toPlane(e);
        for (t = 0; t < this.featurePoints.length; t++) this.featurePoints[t].toPlane(e);
        this.packagePointsNeedProjection = !1, this.packagePointsNeedTransformation = !0;
    }
    transformation(e) {
        for (var t = 0; t < this.featurePolygons.length; t++) this.featurePolygons[t].toPixels(e);
        for (t = 0; t < this.featureLines.length; t++) this.featureLines[t].toPixels(e);
        for (t = 0; t < this.featurePoints.length; t++) this.featurePoints[t].toPixels(e);
        this.packagePointsNeedTransformation = !1, this.packagePointsNeedPlacement = !0;
    }
    placement(e) {
        for (var t = 0; t < this.featurePolygons.length; t++) this.featurePolygons[t].toCanvas(e);
        for (t = 0; t < this.featureLines.length; t++) this.featureLines[t].toCanvas(e);
        for (t = 0; t < this.featurePoints.length; t++) this.featurePoints[t].toCanvas(e);
        this.packagePointsNeedPlacement = !1;
    }
    renderLayer(e, t) {
        expect(e, 'Earth'), expect(t, 'Number'), this.renderPolygons(e, t), this.renderLines(e, t), 
        this.renderPoints(e, t);
    }
    renderPolygons(e, t) {
        for (var r = 0; r < this.featurePolygons.length; r++) this.featurePolygons[r].renderFeature(e, t);
    }
    renderLines(e, t) {
        for (var r = 0; r < this.featureLines.length; r++) this.featureLines[r].renderFeature(e, t);
    }
    renderPoints(e, t) {
        for (var r = 0; r < this.featurePoints.length; r++) this.featurePoints[r].renderFeature(e, t);
    }
    discoverFeatures(e, t) {
        var r = this.discoverPolygon(e, t);
        return null == r && (r = this.discoverLine(e, t)), null == r && (r = this.discoverPoint(e, t)), 
        r;
    }
    discoverPolygon(e, t) {
        for (var r = 0; r < this.featurePolygons.length; r++) {
            var s = this.featurePolygons[r];
            if (1 == s.isPointerInsidePolygon(e, t)) return s;
        }
        return null;
    }
    discoverLine(e, t) {
        for (var r = 0; r < this.featureLines.length; r++) {
            var s = this.featureLines[r];
            if (1 == s.isPointerOnLine(e, t)) return s;
        }
        return null;
    }
    discoverPoint(e, t) {
        for (var r = 0; r < this.featurePoints.length; r++) {
            var s = this.featurePoints[r];
            if (1 == s.isPointerAtPoint(e, t)) return s;
        }
        return null;
    }
}