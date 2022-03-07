/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BasePackage from './base-package.class.js';

import PointFeature from '../features/point-feature.class.js';

import LineFeature from '../features/line-feature.class.js';

import PolygonFeature from '../features/polygon-feature.class.js';

import ProjectedPoint from '../projection/projected-point.class.js';

import expect from 'softlib/expect.js';

export default class ExternalPackage extends BasePackage {
    constructor(e) {
        super(e), this.featurePolygons = [], this.featureLines = [], this.featurePoints = [], 
        this.replaceAppend = '', this.url = '', this.featureKey = '';
    }
    recomputeStyles(e, t, s) {
        expect(e, 'vssStyleSheet'), expect(t, 'Layer'), expect(s, 'Number');
        for (var r = 0; r < this.featurePolygons.length; r++) this.featurePolygons[r].computeFeatureStyle(e, t.vssClassname, t.vssIdentifier, r, s);
        for (r = 0; r < this.featureLines.length; r++) this.featureLines[r].computeFeatureStyle(e, t.vssClassname, t.vssIdentifier, r, s);
        for (r = 0; r < this.featurePoints.length; r++) this.featurePoints[r].computeFeatureStyle(e, t.vssClassname, t.vssIdentifier, r, s);
        t.layerNeedsRestyling = !1;
    }
    runCourtesyValidator(e, t, s) {
        expect(e, 'vssStyleSheet'), expect(t, 'Layer'), expect(s, 'Number');
        for (var r = 0; r < this.featurePolygons.length; r++) this.featurePolygons[r].runCourtesyValidator(e, t.vssClassname, t.vssIdentifier, r, s);
        for (r = 0; r < this.featureLines.length; r++) this.featureLines[r].runCourtesyValidator(e, t.vssClassname, t.vssIdentifier, r, s);
        for (r = 0; r < this.featurePoints.length; r++) this.featurePoints[r].runCourtesyValidator(e, t.vssClassname, t.vssIdentifier, r, s);
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
        for (var s = 0; s < this.featurePolygons.length; s++) this.featurePolygons[s].renderFeature(e, t);
    }
    renderLines(e, t) {
        for (var s = 0; s < this.featureLines.length; s++) this.featureLines[s].renderFeature(e, t);
    }
    renderPoints(e, t) {
        for (var s = 0; s < this.featurePoints.length; s++) this.featurePoints[s].renderFeature(e, t);
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