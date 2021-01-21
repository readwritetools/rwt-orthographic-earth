/* Copyright (c) 2021 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BasePackage from './base-package.class.js';

import PointFeature from '../features/point-feature.class.js';

import LineFeature from '../features/line-feature.class.js';

import PolygonFeature from '../features/polygon-feature.class.js';

import ProjectedPoint from '../projection/projected-point.class.js';

export default class TopojsonPackage extends BasePackage {
    constructor(e, t, s, r, o, i, n) {
        super(e, t, s, r), this.featureKey = o, this.identifiable = i, this.identifyCallback = n, 
        this.featurePolygons = [], this.featureLines = [], this.featurePoints = [], this.replaceAppend = '', 
        this.url = '', this.embeddedName = '', this.topojsonObjects = null, this.topojsonArcs = null, 
        this.scaleX = null, this.scaleY = null, this.translateX = null, this.translateY = null;
    }
    async retrieveData(e, t, s) {
        this.replaceAppend = e, this.embeddedName = s;
        try {
            var r = await fetch(t, {
                cache: 'no-cache',
                referrerPolicy: 'no-referrer'
            });
            if (200 != r.status && 304 != r.status) throw new Error(`Request for ${t} returned with ${r.status}`);
            var o = await r.json();
            this.handlePackageData(o);
        } catch (e) {
            console.log(e.message);
        }
    }
    handlePackageData(e) {
        if ('replace' == this.replaceAppend && (this.featurePolygons = [], this.featureLines = [], 
        this.featurePoints = []), 'objects' in e == 0) return console.assert('Assert: No objects in topoJSON');
        if (this.topojsonObjects = e.objects, 'arcs' in e == 0) return console.assert('Assert: No arcs in topoJSON');
        if (this.topojsonArcs = e.arcs, 'transform' in e == 0) return console.assert('Assert: No transform in topoJSON');
        if (this.scaleX = parseFloat(e.transform.scale[0]), this.scaleY = parseFloat(e.transform.scale[1]), 
        isNaN(this.scaleX) && (this.scaleX = 1), isNaN(this.scaleY) && (this.scaleY = 1), 
        this.translateX = parseFloat(e.transform.translate[0]), this.translateY = parseFloat(e.transform.translate[1]), 
        this.embeddedName in e.objects == 0) return console.assert('Assert: No object by the name of %s', this.embeddedName);
        var t = this.topojsonObjects[this.embeddedName];
        if ('GeometryCollection' != t.type) return console.log('Expected GeometryCollection, but found %s', t.type);
        for (var s = 0; s < t.geometries.length; s++) {
            var r = t.geometries[s], o = this.importKeyValuePairs(r), i = '';
            if (null != o && (i = o.hasOwnProperty(this.featureKey) ? o[this.featureKey] : ''), 
            'type' in r != 0) if ('MultiPolygon' == r.type) this.importMultiPolygon(r, o, i); else if ('Polygon' == r.type) this.importPolygon(r, o, i); else if ('MultiLineString' == r.type) this.importMultiLine(r, o, i); else if ('LineString' == r.type) this.importLine(r, o, i); else if ('MultiPoint' == r.type) this.importMultiPoint(r, o, i); else {
                if ('Point' != r.type) {
                    console.log('Info: i[%d] Skipping unknown geometry type %s', s, r.type);
                    continue;
                }
                this.importPoint(r, o, i);
            }
        }
        this.topojsonObjects = null, this.topojsonTransform = null, this.topojsonArcs = null, 
        this.packageNeedsRestyling = !0, this.packagePointsNeedGeoCoords = !0, this.packagePointsNeedProjection = !0, 
        this.packagePointsNeedTransformation = !0, this.packagePointsNeedPlacement = !0, 
        this.rwtOrthographicEarth.broadcastMessage('package/topojson', this.embeddedName);
    }
    importKeyValuePairs(e) {
        if ('properties' in e == 0) return {};
        var t = {};
        for (var s in e.properties) {
            var r = e.properties[s];
            t[s] = r;
        }
        return t;
    }
    importMultiPolygon(e, t, s) {
        if ('MultiPolygon' != e.type) return console.log('Expected MultiPolygon, but found %s', e.type);
        for (var r = 0; r < e.arcs.length; r++) {
            var o = new PolygonFeature;
            o.kvPairs = t, o.featureName = s;
            for (var i = 0; i < e.arcs[r].length; i++) if (0 == i) this.featurePolygons.push(o), 
            this.importArcLists(o.outerRing, e.arcs[r][i]); else {
                var n = new PolygonFeature;
                o.innerRings.push(n), this.importArcLists(n.outerRing, e.arcs[r][i]);
            }
        }
    }
    importPolygon(e, t, s) {
        if ('Polygon' != e.type) return console.log('Expected Polygon, but found %s', e.type);
        for (var r = 0; r < e.arcs.length; r++) {
            var o = new PolygonFeature;
            if (o.kvPairs = t, o.featureName = s, 0 == r) this.featurePolygons.push(o), this.importArcLists(o.outerRing, e.arcs[r]); else {
                var i = new PolygonFeature;
                o.innerRings.push(i), this.importArcLists(i.outerRing, e.arcs[r]);
            }
        }
    }
    importMultiLine(e, t, s) {
        if ('MultiLineString' != e.type) return console.log('Expected MultiLineString, but found %s', e.type);
        for (var r = 0; r < e.arcs.length; r++) {
            var o = new LineFeature;
            o.kvPairs = t, o.featureName = s;
            for (var i = 0; i < e.arcs[r].length; i++) {
                var n = e.arcs[r][i], a = !1;
                n < 0 && (a = !0, n = Math.abs(n) - 1);
                var l = this.topojsonArcs[n];
                this.addArcToFeature(o.lineSegment, l, a);
            }
            this.featureLines.push(o);
        }
    }
    importLine(e, t, s) {
        if ('LineString' != e.type) return console.log('Expected LineString, but found %s', e.type);
        for (var r = 0; r < e.arcs.length; r++) {
            var o = new LineFeature;
            o.kvPairs = t, o.featureName = s;
            var i = e.arcs[r], n = !1;
            i < 0 && (n = !0, i = Math.abs(i) - 1);
            var a = this.topojsonArcs[i];
            this.addArcToFeature(o.lineSegment, a, n), this.featureLines.push(o);
        }
    }
    importMultiPoint(e, t, s) {
        if ('MultiPoint' != e.type) return console.log('Expected MultiPoint, but found %s', e.type);
        for (var r = 0; r < e.coordinates.length; r++) {
            var o = e.coordinates[r][0], i = e.coordinates[r][1], n = o * this.scaleX + this.translateX, a = i * this.scaleY + this.translateY, l = new ProjectedPoint(a, n), h = new PointFeature;
            h.kvPairs = t, h.featureName = s, h.discretePoint = l, this.featurePoints.push(h);
        }
    }
    importPoint(e, t, s) {
        if ('Point' != e.type) return console.log('Expected Point, but found %s', e.type);
        var r = e.coordinates[0], o = e.coordinates[1], i = r * this.scaleX + this.translateX, n = o * this.scaleY + this.translateY, a = new ProjectedPoint(n, i), l = new PointFeature;
        l.kvPairs = t, l.featureName = s, l.discretePoint = a, this.featurePoints.push(l);
    }
    importArcLists(e, t) {
        for (var s = 0; s < t.length; s++) {
            var r = t[s], o = !1;
            r < 0 && (o = !0, r = Math.abs(r) - 1);
            var i = this.topojsonArcs[r];
            this.addArcToFeature(e, i, o);
        }
    }
    addArcToFeature(e, t, s) {
        for (var r = 0, o = 0, i = t.length, n = [], a = 0; a < i; a++) {
            r += t[f = a][0], o += t[f][1];
            var l = r * this.scaleX + this.translateX, h = o * this.scaleY + this.translateY, u = new ProjectedPoint(h, l);
            n.push(u);
        }
        for (a = 0; a < i; a++) {
            var f = 1 == s ? i - a - 1 : a;
            e.push(n[f]);
        }
    }
    recomputeStyles(e) {
        for (var t = 0; t < this.featurePolygons.length; t++) this.featurePolygons[t].computeStyle(e, this.classname, this.identifier, t);
        for (t = 0; t < this.featureLines.length; t++) this.featureLines[t].computeStyle(e, this.classname, this.identifier, t);
        for (t = 0; t < this.featurePoints.length; t++) this.featurePoints[t].computeStyle(e, this.classname, this.identifier, t);
        this.packageNeedsRestyling = !1;
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
    render(e) {
        this.renderPolygons(e), this.renderLines(e), this.renderPoints(e);
    }
    renderPolygons(e) {
        for (var t = 0; t < this.featurePolygons.length; t++) this.featurePolygons[t].render(e);
    }
    renderLines(e) {
        for (var t = 0; t < this.featureLines.length; t++) this.featureLines[t].render(e);
    }
    renderPoints(e) {
        for (var t = 0; t < this.featurePoints.length; t++) this.featurePoints[t].render(e);
    }
    discoverFeatures(e, t) {
        var s = this.discoverPolygon(e, t);
        return null == s && (s = this.discoverLine(e, t)), null == s && (s = this.discoverPoint(e, t)), 
        s;
    }
    discoverPolygon(e, t) {
        for (var s = 0; s < this.featurePolygons.length; s++) {
            var r = this.featurePolygons[s];
            if (1 == r.isPointerInsidePolygon(e, t)) return r;
        }
        return null;
    }
    discoverLine(e, t) {
        for (var s = 0; s < this.featureLines.length; s++) {
            var r = this.featureLines[s];
            if (1 == r.isPointerOnLine(e, t)) return r;
        }
        return null;
    }
    discoverPoint(e, t) {
        for (var s = 0; s < this.featurePoints.length; s++) {
            var r = this.featurePoints[s];
            if (1 == r.isPointerAtPoint(e, t)) return r;
        }
        return null;
    }
}