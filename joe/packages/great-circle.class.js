/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BasePackage from './base-package.class.js';

import PointFeature from '../features/point-feature.class.js';

import LineFeature from '../features/line-feature.class.js';

import ProjectedPoint from '../projection/projected-point.class.js';

import * as st from '../spherical-earth/spherical-trigonometry.js';

import * as CB from '../menu/panel-callbacks.js';

import expect from '../dev/expect.js';

import terminal from 'softlib/terminal.js';

export default class GreatCircle extends BasePackage {
    constructor(t, e, i) {
        expect(e, 'Object'), expect(i, 'Object'), super(t), this.embarkationName = e.name, 
        this.destinationName = i.name, this.shortArc = new LineFeature, this.longArc = new LineFeature, 
        this.shortIntermediates = [], this.longIntermediates = [], this.distance12 = 0, 
        this.distance14 = 0, this.distance43 = 0, this.distance32 = 0;
        var a = this.validateInputs(e, i);
        0 != a && this.determineArcsAndPoints(e, i, a.embarkationAntipode, a.destinationAntipode), 
        this.packagePointsNeedGeoCoords = !0, this.packagePointsNeedProjection = !0, this.packagePointsNeedTransformation = !0, 
        this.packagePointsNeedPlacement = !0, this.rwtOrthographicEarth.broadcastMessage('package/greatCircle', null), 
        Object.seal(this);
    }
    validateInputs(t, e) {
        if (expect(t, 'Object'), expect(e, 'Object'), t.latitude = Number(t.latitude), t.longitude = Number(t.longitude), 
        e.latitude = Number(e.latitude), e.longitude = Number(e.longitude), Number.isNaN(t.latitude) || Number.isNaN(t.longitude) || Number.isNaN(e.latitude) || Number.isNaN(e.longitude)) return terminal.abnormal(`Great Circle package must specify numeric embarkation and destination\n\t\t\t\tembarkation.latitude: ${t.latitude}\n\t\t\t\tembarkation.longitude: ${t.longitude}\n\t\t\t\tdestination.latitude: ${e.latitude}\n\t\t\t\tdestination.longitude: ${e.longitude}`), 
        !1;
        const i = {
            latitude: t.latitude,
            longitude: t.longitude
        }, a = {
            latitude: e.latitude,
            longitude: e.longitude
        };
        var n = st.antipode(i.latitude, i.longitude), r = st.antipode(a.latitude, a.longitude);
        return a.latitude == n.latitude && a.longitude == n.longitude && (terminal.abnormal('Great Circle starting and ending points are precise antipodes. Offseting longitude by 0.1 degree.'), 
        a.longitude += .1, r = st.antipode(a.latitude, a.longitude)), {
            embarkationAntipode: n,
            destinationAntipode: r
        };
    }
    determineArcsAndPoints(t, e, i, a) {
        expect(t, 'Object'), expect(e, 'Object'), expect(i, 'Object'), expect(a, 'Object');
        const n = t, r = e, s = i, o = a, d = st.lengthOfArc(n.latitude, n.longitude, r.latitude, r.longitude) / Math.PI, l = Math.round(40 * d), h = 40 - l;
        this.determineShortArc(n, r, l), this.determineLongArc(n, r, s, o, l, h), this.determineShortIntermediates(n, r), 
        this.determineLongIntermediates(n, r, s, o);
    }
    determineShortArc(t, e, i) {
        var a = st.greatCircleArc(t.latitude, t.longitude, e.latitude, e.longitude, i, !0);
        for (let t = 0; t < a.length; t++) this.shortArc.addPoint(new ProjectedPoint(a[t].latitude, a[t].longitude));
        this.distance12 = st.haversine(t.latitude, t.longitude, e.latitude, e.longitude);
        var n = this.distance12;
        this.shortArc.kvPairs.type = 'arc', this.shortArc.kvPairs.id = `Shortest route from ${this.embarkationName} to ${this.destinationName}`, 
        this.shortArc.kvPairs.distance = `${Math.round(n)} km`, this.shortArc.kvPairs.embarkation = this.formatLatLng(t.longitude, t.latitude), 
        this.shortArc.kvPairs.destination = this.formatLatLng(e.longitude, e.latitude);
    }
    determineLongArc(t, e, i, a, n, r) {
        var s = st.greatCircleArc(t.latitude, t.longitude, a.latitude, a.longitude, r, !1);
        for (let t = 0; t < s.length; t++) this.longArc.addPoint(new ProjectedPoint(s[t].latitude, s[t].longitude));
        s = st.greatCircleArc(a.latitude, a.longitude, i.latitude, i.longitude, n, !1);
        for (let t = 0; t < s.length; t++) this.longArc.addPoint(new ProjectedPoint(s[t].latitude, s[t].longitude));
        s = st.greatCircleArc(i.latitude, i.longitude, e.latitude, e.longitude, r, !0);
        for (let t = 0; t < s.length; t++) this.longArc.addPoint(new ProjectedPoint(s[t].latitude, s[t].longitude));
        this.distance14 = st.haversine(t.latitude, t.longitude, a.latitude, a.longitude), 
        this.distance43 = st.haversine(a.latitude, a.longitude, i.latitude, i.longitude), 
        this.distance32 = st.haversine(i.latitude, i.longitude, e.latitude, e.longitude);
        var o = this.distance14 + this.distance43 + this.distance32;
        this.longArc.kvPairs.type = 'great circle', this.longArc.kvPairs.id = `Long way around from ${this.embarkationName} to ${this.destinationName}`, 
        this.longArc.kvPairs.distance = `${Math.round(o)} km`, this.longArc.kvPairs.embarkation = this.formatLatLng(t.longitude, t.latitude), 
        this.longArc.kvPairs.destination = this.formatLatLng(e.longitude, e.latitude);
    }
    determineShortIntermediates(t, e) {
        var i = Math.floor(this.distance12 / 1e3), a = 1 / i, n = 1e3 * i / this.distance12, r = st.sphericalIntermediatePoint(t.latitude, t.longitude, e.latitude, e.longitude, n);
        for (let e = 1; e <= i; e++) {
            var s = st.sphericalIntermediatePoint(t.latitude, t.longitude, r.latitude, r.longitude, a * e), o = new PointFeature;
            o.setPoint(new ProjectedPoint(s.latitude, s.longitude)), o.kvPairs.type = 'waypoint', 
            o.kvPairs.id = `${1e3 * e} km from ${this.embarkationName}`, this.shortIntermediates.push(o);
        }
        var d = new PointFeature;
        d.setPoint(new ProjectedPoint(t.latitude, t.longitude)), d.kvPairs.type = 'embarkation', 
        d.kvPairs.id = `${this.embarkationName}<br /> ${this.formatLatLng(t.longitude, t.latitude)}`, 
        d.kvPairs.distance = `${Math.round(this.distance12)} km to ${this.destinationName}`, 
        this.shortIntermediates.push(d);
        var l = new PointFeature;
        l.setPoint(new ProjectedPoint(e.latitude, e.longitude)), l.kvPairs.type = 'destination', 
        l.kvPairs.id = `${this.destinationName}<br />${this.formatLatLng(e.longitude, e.latitude)}`, 
        l.kvPairs.distance = `${Math.round(this.distance12)} km from ${this.embarkationName}`, 
        this.shortIntermediates.push(l);
    }
    determineLongIntermediates(t, e, i, a) {
        var n = Math.floor(this.distance14 / 1e3), r = 1 / n, s = 1e3 * n / this.distance14, o = this.distance14 - 1e3 * n, d = st.sphericalIntermediatePoint(t.latitude, t.longitude, a.latitude, a.longitude, s);
        for (let e = 1; e <= n; e++) {
            var l = st.sphericalIntermediatePoint(t.latitude, t.longitude, d.latitude, d.longitude, r * e);
            (b = new PointFeature).setPoint(new ProjectedPoint(l.latitude, l.longitude)), b.kvPairs.type = 'alt waypoint', 
            b.kvPairs.id = `${1e3 * e} km from ${this.embarkationName}`, this.longIntermediates.push(b);
        }
        var h = this.distance43 + o, u = Math.floor(h / 1e3), c = 1 / u, m = 1e3 * u / h, g = h - 1e3 * u, p = st.sphericalIntermediatePoint(d.latitude, d.longitude, i.latitude, i.longitude, m);
        for (let t = 1; t < u; t++) {
            l = st.sphericalIntermediatePoint(d.latitude, d.longitude, p.latitude, p.longitude, c * t);
            (b = new PointFeature).setPoint(new ProjectedPoint(l.latitude, l.longitude)), b.kvPairs.type = 'alt waypoint', 
            b.kvPairs.id = `${1e3 * (t + n)} km from ${this.embarkationName}`, this.longIntermediates.push(b);
        }
        var P = this.distance32 + g, v = Math.floor(P / 1e3), f = 1 / v, k = 1e3 * v / P, I = st.sphericalIntermediatePoint(p.latitude, p.longitude, e.latitude, e.longitude, k);
        for (let t = 1; t <= v; t++) {
            var b;
            l = st.sphericalIntermediatePoint(p.latitude, p.longitude, I.latitude, I.longitude, f * t);
            (b = new PointFeature).setPoint(new ProjectedPoint(l.latitude, l.longitude)), b.kvPairs.type = 'alt waypoint', 
            b.kvPairs.id = `${1e3 * (t + n + u)} km from ${this.embarkationName}`, this.longIntermediates.push(b);
        }
        var A = new PointFeature;
        A.setPoint(new ProjectedPoint(i.latitude, i.longitude)), A.kvPairs.type = 'embarkation antipode', 
        A.kvPairs.id = `${this.embarkationName} antipode<br />${this.formatLatLng(i.longitude, i.latitude)}`, 
        A.kvPairs.distance = `${Math.round(this.distance32)} km from ${this.destinationName}<br />40030 km from ${this.embarkationName}`, 
        this.longIntermediates.push(A);
        var N = new PointFeature;
        N.setPoint(new ProjectedPoint(a.latitude, a.longitude)), N.kvPairs.type = 'destination antipode', 
        N.kvPairs.id = `${this.destinationName} antipode<br />${this.formatLatLng(a.longitude, a.latitude)}`, 
        N.kvPairs.distance = `${Math.round(this.distance14)} km from ${this.embarkationName}<br />40030 km from ${this.destinationName}`, 
        this.longIntermediates.push(N);
    }
    formatLatLng(t, e) {
        var i = Math.abs(t.toFixed(2)), a = t < 0 ? i + '° W' : i + '° E', n = Math.abs(e.toFixed(2));
        return `longitude: ${a}<br />latitude: ${e < 0 ? n + '° S' : n + '° N'}`;
    }
    recomputeStyles(t, e, i, a) {
        expect(t, 'RenderClock'), expect(e, 'vssStyleSheet'), expect(i, 'Layer'), expect(a, 'Number'), 
        super.recomputeStyles(t, e, i, (() => {
            this.shortArc.computeFeatureStyle(t, e, i.vssClassname, i.vssIdentifier, 0, a), 
            this.longArc.computeFeatureStyle(t, e, i.vssClassname, i.vssIdentifier, 0, a);
            for (let n = 0; n < this.shortIntermediates.length; n++) this.shortIntermediates[n].computeFeatureStyle(t, e, i.vssClassname, i.vssIdentifier, n, a);
            for (let n = 0; n < this.longIntermediates.length; n++) this.longIntermediates[n].computeFeatureStyle(t, e, i.vssClassname, i.vssIdentifier, n, a);
        }));
    }
    runCourtesyValidator(t, e, i) {
        expect(t, 'vssStyleSheet'), expect(e, 'Layer'), expect(i, 'Number'), super.runCourtesyValidator((() => {
            this.shortArc.runCourtesyValidator(t, e.vssClassname, e.vssIdentifier, 0, i), this.longArc.runCourtesyValidator(t, e.vssClassname, e.vssIdentifier, 0, i);
            for (let a = 0; a < this.shortIntermediates.length; a++) this.shortIntermediates[a].runCourtesyValidator(t, e.vssClassname, e.vssIdentifier, a, i);
            for (let a = 0; a < this.longIntermediates.length; a++) this.longIntermediates[a].runCourtesyValidator(t, e.vssClassname, e.vssIdentifier, a, i);
        }));
    }
    rotation(t, e) {
        expect(t, 'RenderClock'), expect(e, 'GeocentricCoordinates'), super.rotation(t, e, (() => {
            this.shortArc.toGeoCoords(t, e), this.longArc.toGeoCoords(t, e);
            for (let i = 0; i < this.shortIntermediates.length; i++) this.shortIntermediates[i].toGeoCoords(t, e);
            for (let i = 0; i < this.longIntermediates.length; i++) this.longIntermediates[i].toGeoCoords(t, e);
        }));
    }
    projection(t, e) {
        expect(t, 'RenderClock'), expect(e, 'OrthographicProjection'), super.projection(t, e, (() => {
            this.shortArc.toPlane(t, e), this.longArc.toPlane(t, e);
            for (let i = 0; i < this.shortIntermediates.length; i++) this.shortIntermediates[i].toPlane(t, e);
            for (let i = 0; i < this.longIntermediates.length; i++) this.longIntermediates[i].toPlane(t, e);
        }));
    }
    transformation(t, e) {
        expect(t, 'RenderClock'), expect(e, 'CartesianTransformation'), super.transformation(t, e, (() => {
            this.shortArc.toPixels(t, e), this.longArc.toPixels(t, e);
            for (let i = 0; i < this.shortIntermediates.length; i++) this.shortIntermediates[i].toPixels(t, e);
            for (let i = 0; i < this.longIntermediates.length; i++) this.longIntermediates[i].toPixels(t, e);
        }));
    }
    placement(t, e) {
        expect(t, 'RenderClock'), expect(e, 'Viewport'), super.placement(t, e, (() => {
            this.shortArc.toViewportCanvas(t, e), this.longArc.toViewportCanvas(t, e);
            for (let i = 0; i < this.shortIntermediates.length; i++) this.shortIntermediates[i].toViewportCanvas(t, e);
            for (let i = 0; i < this.longIntermediates.length; i++) this.longIntermediates[i].toViewportCanvas(t, e);
        }));
    }
    drawLayer(t, e, i) {
        expect(t, 'RenderClock'), expect(e, 'Earth'), expect(i, 'Number'), super.drawLayer(t, (() => {
            this.shortArc.drawFeature(t, e, i), this.longArc.drawFeature(t, e, i);
            for (let a = 0; a < this.shortIntermediates.length; a++) this.shortIntermediates[a].drawFeature(t, e, i);
            for (let a = 0; a < this.longIntermediates.length; a++) this.longIntermediates[a].drawFeature(t, e, i);
        }));
    }
    discoverFeatures(t, e) {
        var i = this.discoverPoint(t, e);
        return null == i && (i = this.discoverLine(t, e)), i;
    }
    discoverLine(t, e) {
        return 1 == this.shortArc.isPointerOnLine(t, e) ? this.shortArc : 1 == this.longArc.isPointerOnLine(t, e) ? this.longArc : null;
    }
    discoverPoint(t, e) {
        for (let a = 0; a < this.shortIntermediates.length; a++) {
            if (1 == (i = this.shortIntermediates[a]).isPointerAtPoint(t, e)) return i;
        }
        for (let a = 0; a < this.longIntermediates.length; a++) {
            var i;
            if (1 == (i = this.longIntermediates[a]).isPointerAtPoint(t, e)) return i;
        }
        return null;
    }
}