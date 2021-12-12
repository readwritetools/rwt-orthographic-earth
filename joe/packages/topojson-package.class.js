/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BasePackage from './base-package.class.js';

import PointFeature from '../features/point-feature.class.js';

import LineFeature from '../features/line-feature.class.js';

import PolygonFeature from '../features/polygon-feature.class.js';

import ProjectedPoint from '../projection/projected-point.class.js';

export default class TopojsonPackage extends BasePackage {
    constructor(e, t, r, s, o, i, a, n) {
        super(e, t, r, s, o), this.featureKey = i, this.identifiable = a, this.identifyCallback = n, 
        this.featurePolygons = [], this.featureLines = [], this.featurePoints = [], this.replaceAppend = '', 
        this.url = '', this.embeddedName = '', this.topojsonObjects = null, this.topojsonArcs = null, 
        this.scaleX = null, this.scaleY = null, this.translateX = null, this.translateY = null;
    }
    async retrieveData(e, t, r) {
        this.replaceAppend = e, this.embeddedName = r;
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
        if ('replace' == this.replaceAppend && (this.featurePolygons = [], this.featureLines = [], 
        this.featurePoints = []), 'objects' in e == 0) return console.error('No objects in topoJSON layer %s', this.layerName);
        if (this.topojsonObjects = e.objects, 'arcs' in e == 0) return console.error('No arcs in topoJSON layer %s', this.layerName);
        if (this.topojsonArcs = e.arcs, 'transform' in e == 0) return console.error('No transform in topoJSON layer %s', this.layerName);
        if (this.scaleX = parseFloat(e.transform.scale[0]), this.scaleY = parseFloat(e.transform.scale[1]), 
        isNaN(this.scaleX) && (this.scaleX = 1), isNaN(this.scaleY) && (this.scaleY = 1), 
        this.translateX = parseFloat(e.transform.translate[0]), this.translateY = parseFloat(e.transform.translate[1]), 
        this.embeddedName in e.objects == 0) return console.error('No embeddedName by the name of %s in layer %s', this.embeddedName, this.layerName);
        var t = this.topojsonObjects[this.embeddedName];
        if ('GeometryCollection' != t.type) return console.error('Expected GeometryCollection, but found %s in layer %s', t.type, this.layerName);
        for (var r = 0; r < t.geometries.length; r++) {
            var s = t.geometries[r], o = this.importKeyValuePairs(s), i = '';
            if (null != o && '' != this.featureKey && (o.hasOwnProperty(this.featureKey) ? i = o[this.featureKey] : (i = '', 
            console.log('No featureKey by the name of %s in layer %s, VSS rules that use %s will not work', this.featureKey, this.layerName, this.featureKey))), 
            'type' in s != 0) if ('MultiPolygon' == s.type) this.importMultiPolygon(s, o, i); else if ('Polygon' == s.type) this.importPolygon(s, o, i); else if ('MultiLineString' == s.type) this.importMultiLine(s, o, i); else if ('LineString' == s.type) this.importLine(s, o, i); else if ('MultiPoint' == s.type) this.importMultiPoint(s, o, i); else {
                if ('Point' != s.type) {
                    console.error('Info: i[%d] Skipping unknown geometry type %s in layer %s', r, s.type, this.layerName);
                    continue;
                }
                this.importPoint(s, o, i);
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
                var a = new PolygonFeature;
                o.innerRings.push(a), this.importArcLists(a.outerRing, e.arcs[s][i]);
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
                var a = e.arcs[s][i], n = !1;
                a < 0 && (n = !0, a = Math.abs(a) - 1);
                var l = this.topojsonArcs[a];
                this.addArcToFeature(o.lineSegment, l, n);
            }
            this.featureLines.push(o);
        }
    }
    importLine(e, t, r) {
        if ('LineString' != e.type) return console.error('Expected LineString, but found %s', e.type);
        for (var s = 0; s < e.arcs.length; s++) {
            var o = new LineFeature;
            o.kvPairs = t, o.featureName = r;
            var i = e.arcs[s], a = !1;
            i < 0 && (a = !0, i = Math.abs(i) - 1);
            var n = this.topojsonArcs[i];
            this.addArcToFeature(o.lineSegment, n, a), this.featureLines.push(o);
        }
    }
    importMultiPoint(e, t, r) {
        if ('MultiPoint' != e.type) return console.error('Expected MultiPoint, but found %s', e.type);
        for (var s = 0; s < e.coordinates.length; s++) {
            var o = e.coordinates[s][0], i = e.coordinates[s][1], a = o * this.scaleX + this.translateX, n = i * this.scaleY + this.translateY, l = new ProjectedPoint(n, a), h = new PointFeature;
            h.kvPairs = t, h.featureName = r, h.discretePoint = l, this.featurePoints.push(h);
        }
    }
    importPoint(e, t, r) {
        if ('Point' != e.type) return console.error('Expected Point, but found %s', e.type);
        var s = e.coordinates[0], o = e.coordinates[1], i = s * this.scaleX + this.translateX, a = o * this.scaleY + this.translateY, n = new ProjectedPoint(a, i), l = new PointFeature;
        l.kvPairs = t, l.featureName = r, l.discretePoint = n, this.featurePoints.push(l);
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
        for (var s = 0, o = 0, i = t.length, a = [], n = 0; n < i; n++) {
            s += t[f = n][0], o += t[f][1];
            var l = s * this.scaleX + this.translateX, h = o * this.scaleY + this.translateY, u = new ProjectedPoint(h, l);
            a.push(u);
        }
        for (n = 0; n < i; n++) {
            var f = 1 == r ? i - n - 1 : n;
            e.push(a[f]);
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