/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BaseFeature from './base-feature.class.js';

import PointFeature from '../features/point-feature.class.js';

import LineFeature from '../features/line-feature.class.js';

import ProjectedPoint from '../projection/projected-point.class.js';

import * as st from '../spherical-earth/spherical-trigonometry.js';

import * as CB from '../menu/panel-callbacks.js';

import RS from '../enum/rendering-state.enum.js';

import expect from '../dev/expect.js';

import terminal from 'softlib/terminal.js';

export default class GreatCircleFeature extends BaseFeature {
    constructor() {
        super(), this.embarkationName = '', this.embarkationLatitude = null, this.embarkationLongitude = null, 
        this.destinationName = '', this.destinationLatitude = null, this.destinationLongitude = null, 
        this.shortArc = new LineFeature, this.longArc = new LineFeature, this.shortIntermediates = [], 
        this.longIntermediates = [], this.distance12 = 0, this.distance14 = 0, this.distance43 = 0, 
        this.distance32 = 0;
    }
    setEmbarkationPoint(t, e, i) {
        expect(t, 'String'), expect(e, [ 'Number', 'String' ]), expect(i, [ 'Number', 'String' ]), 
        this.embarkationName = t ?? 'A', this.embarkationLatitude = Number(e), Number.isNaN(this.embarkationLatitude) && (this.embarkationLatitude = 0), 
        this.embarkationLatitude > 90 && (this.embarkationLatitude = 90), this.embarkationLatitude < -90 && (this.embarkationLatitude = -90), 
        this.embarkationLongitude = Number(i), Number.isNaN(this.embarkationLongitude) && (this.embarkationLongitude = 0), 
        this.embarkationLongitude > 180 && (this.embarkationLongitude -= 360), this.embarkationLongitude < -180 && (this.embarkationLongitude += 360), 
        this.resetArcsAndWaypoints();
        var n = new PointFeature;
        n.setPoint(new ProjectedPoint(this.embarkationLatitude, this.embarkationLongitude)), 
        n.kvPairs.type = 'embarkation', this.shortIntermediates.push(n);
    }
    setDestinationPoint(t, e, i) {
        expect(t, 'String'), expect(e, [ 'Number', 'String' ]), expect(i, [ 'Number', 'String' ]), 
        this.destinationName = t ?? 'B', this.destinationLatitude = Number(e), Number.isNaN(this.destinationLatitude) && (this.destinationLatitude = 0), 
        this.destinationLatitude > 90 && (this.destinationLatitude = 90), this.destinationLatitude < -90 && (this.destinationLatitude = -90), 
        this.destinationLongitude = Number(i), Number.isNaN(this.destinationLongitude) && (this.destinationLongitude = 0), 
        this.destinationLongitude > 180 && (this.destinationLongitude -= 360), this.destinationLongitude < -180 && (this.destinationLongitude += 360), 
        this.resetArcsAndWaypoints();
        var n = new PointFeature;
        n.setPoint(new ProjectedPoint(this.destinationLatitude, this.destinationLongitude)), 
        n.kvPairs.type = 'destination', this.shortIntermediates.push(n);
    }
    resetArcsAndWaypoints() {
        this.shortArc = new LineFeature, this.longArc = new LineFeature, this.shortIntermediates = [], 
        this.longIntermediates = [];
    }
    determineArcsAndWaypoints() {
        const t = {
            latitude: this.embarkationLatitude,
            longitude: this.embarkationLongitude
        }, e = {
            latitude: this.destinationLatitude,
            longitude: this.destinationLongitude
        };
        var i = st.antipode(t.latitude, t.longitude), n = st.antipode(e.latitude, e.longitude);
        e.latitude == i.latitude && e.longitude == i.longitude && (terminal.abnormal('Great Circle starting and ending points are precise antipodes. Offseting longitude by 0.1 degree.'), 
        e.longitude += .1, n = st.antipode(e.latitude, e.longitude));
        const a = st.lengthOfArc(t.latitude, t.longitude, e.latitude, e.longitude) / Math.PI, s = Math.round(40 * a), r = 40 - s;
        this.resetArcsAndWaypoints(), this.determineShortArc(t, e, s), this.determineLongArc(t, e, i, n, s, r), 
        this.determineShortIntermediates(t, e), this.determineLongIntermediates(t, e, i, n);
    }
    determineShortArc(t, e, i) {
        var n = st.greatCircleArc(t.latitude, t.longitude, e.latitude, e.longitude, i, !0);
        for (let t = 0; t < n.length; t++) this.shortArc.addPoint(new ProjectedPoint(n[t].latitude, n[t].longitude));
        this.distance12 = st.haversine(t.latitude, t.longitude, e.latitude, e.longitude);
        var a = this.distance12;
        this.shortArc.kvPairs.type = 'short route', this.shortArc.kvPairs.id = `Shortest route from ${this.embarkationName} to ${this.destinationName}`, 
        this.shortArc.kvPairs.distance = `${Math.round(a)} km`, this.shortArc.kvPairs.embarkation = this.formatLatLng(t.longitude, t.latitude), 
        this.shortArc.kvPairs.destination = this.formatLatLng(e.longitude, e.latitude);
    }
    determineLongArc(t, e, i, n, a, s) {
        var r = st.greatCircleArc(t.latitude, t.longitude, n.latitude, n.longitude, s, !1);
        for (let t = 0; t < r.length; t++) this.longArc.addPoint(new ProjectedPoint(r[t].latitude, r[t].longitude));
        r = st.greatCircleArc(n.latitude, n.longitude, i.latitude, i.longitude, a, !1);
        for (let t = 0; t < r.length; t++) this.longArc.addPoint(new ProjectedPoint(r[t].latitude, r[t].longitude));
        r = st.greatCircleArc(i.latitude, i.longitude, e.latitude, e.longitude, s, !0);
        for (let t = 0; t < r.length; t++) this.longArc.addPoint(new ProjectedPoint(r[t].latitude, r[t].longitude));
        this.distance14 = st.haversine(t.latitude, t.longitude, n.latitude, n.longitude), 
        this.distance43 = st.haversine(n.latitude, n.longitude, i.latitude, i.longitude), 
        this.distance32 = st.haversine(i.latitude, i.longitude, e.latitude, e.longitude);
        var o = this.distance14 + this.distance43 + this.distance32;
        this.longArc.kvPairs.type = 'long route', this.longArc.kvPairs.id = `Long way around from ${this.embarkationName} to ${this.destinationName}`, 
        this.longArc.kvPairs.distance = `${Math.round(o)} km`, this.longArc.kvPairs.embarkation = this.formatLatLng(t.longitude, t.latitude), 
        this.longArc.kvPairs.destination = this.formatLatLng(e.longitude, e.latitude);
    }
    determineShortIntermediates(t, e) {
        var i = Math.floor(this.distance12 / 1e3), n = 1 / i, a = 1e3 * i / this.distance12, s = st.sphericalIntermediatePoint(t.latitude, t.longitude, e.latitude, e.longitude, a);
        if (null != s) for (let e = 1; e <= i; e++) {
            var r = st.sphericalIntermediatePoint(t.latitude, t.longitude, s.latitude, s.longitude, n * e), o = new PointFeature;
            o.setPoint(new ProjectedPoint(r.latitude, r.longitude)), o.kvPairs.type = 'short waypoint', 
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
    determineLongIntermediates(t, e, i, n) {
        var a = null, s = null, r = null, o = Math.floor(this.distance14 / 1e3), d = 1 / o, l = 1e3 * o / this.distance14, h = this.distance14 - 1e3 * o;
        if (null != (a = st.sphericalIntermediatePoint(t.latitude, t.longitude, n.latitude, n.longitude, l))) for (let e = 1; e <= o; e++) {
            var u = st.sphericalIntermediatePoint(t.latitude, t.longitude, a.latitude, a.longitude, d * e);
            (v = new PointFeature).setPoint(new ProjectedPoint(u.latitude, u.longitude)), v.kvPairs.type = 'long waypoint', 
            v.kvPairs.id = `${1e3 * e} km from ${this.embarkationName}`, this.longIntermediates.push(v);
        }
        var m = this.distance43 + h, g = Math.floor(m / 1e3), c = 1 / g, P = 1e3 * g / m, p = m - 1e3 * g;
        if (null != a && null != (s = st.sphericalIntermediatePoint(a.latitude, a.longitude, i.latitude, i.longitude, P))) for (let t = 1; t < g; t++) {
            u = st.sphericalIntermediatePoint(a.latitude, a.longitude, s.latitude, s.longitude, c * t);
            (v = new PointFeature).setPoint(new ProjectedPoint(u.latitude, u.longitude)), v.kvPairs.type = 'long waypoint', 
            v.kvPairs.id = `${1e3 * (t + o)} km from ${this.embarkationName}`, this.longIntermediates.push(v);
        }
        var k = this.distance32 + p, f = Math.floor(k / 1e3), b = 1 / f, L = 1e3 * f / k;
        if (null != s && null != (r = st.sphericalIntermediatePoint(s.latitude, s.longitude, e.latitude, e.longitude, L))) for (let t = 1; t <= f; t++) {
            var v;
            u = st.sphericalIntermediatePoint(s.latitude, s.longitude, r.latitude, r.longitude, b * t);
            (v = new PointFeature).setPoint(new ProjectedPoint(u.latitude, u.longitude)), v.kvPairs.type = 'long waypoint', 
            v.kvPairs.id = `${1e3 * (t + o + g)} km from ${this.embarkationName}`, this.longIntermediates.push(v);
        }
        var I = new PointFeature;
        I.setPoint(new ProjectedPoint(i.latitude, i.longitude)), I.kvPairs.type = 'embarkation antipode', 
        I.kvPairs.id = `${this.embarkationName} antipode<br />${this.formatLatLng(i.longitude, i.latitude)}`, 
        I.kvPairs.distance = `${Math.round(this.distance32)} km from ${this.destinationName}<br />40030 km from ${this.embarkationName}`, 
        this.longIntermediates.push(I);
        var A = new PointFeature;
        A.setPoint(new ProjectedPoint(n.latitude, n.longitude)), A.kvPairs.type = 'destination antipode', 
        A.kvPairs.id = `${this.destinationName} antipode<br />${this.formatLatLng(n.longitude, n.latitude)}`, 
        A.kvPairs.distance = `${Math.round(this.distance14)} km from ${this.embarkationName}<br />40030 km from ${this.destinationName}`, 
        this.longIntermediates.push(A);
    }
    formatLatLng(t, e) {
        var i = Math.abs(t.toFixed(2)), n = t < 0 ? i + '° W' : i + '° E', a = Math.abs(e.toFixed(2));
        return `longitude: ${n}<br />latitude: ${e < 0 ? a + '° S' : a + '° N'}`;
    }
    computeFeatureStyle(t, e, i, n, a, s) {
        expect(t, 'RenderClock'), expect(e, 'vssStyleSheet'), expect(i, 'String'), expect(n, 'String'), 
        expect(a, 'Number'), expect(s, 'Number'), this.shortArc.computeFeatureStyle(t, e, i, n, 0, s), 
        this.longArc.computeFeatureStyle(t, e, i, n, 0, s);
        for (let a = 0; a < this.shortIntermediates.length; a++) this.shortIntermediates[a].computeFeatureStyle(t, e, i, n, a, s);
        for (let a = 0; a < this.longIntermediates.length; a++) this.longIntermediates[a].computeFeatureStyle(t, e, i, n, a, s);
    }
    runCourtesyValidator(t, e, i, n, a) {
        this.shortArc.runCourtesyValidator(t, e, i, 0, a), this.longArc.runCourtesyValidator(t, e, i, 0, a);
        for (let n = 0; n < this.shortIntermediates.length; n++) this.shortIntermediates[n].runCourtesyValidator(t, e, i, n, a);
        for (let n = 0; n < this.longIntermediates.length; n++) this.longIntermediates[n].runCourtesyValidator(t, e, i, n, a);
    }
    toGeoCoords(t, e) {
        this.shortArc.toGeoCoords(t, e), this.longArc.toGeoCoords(t, e);
        for (let i = 0; i < this.shortIntermediates.length; i++) this.shortIntermediates[i].toGeoCoords(t, e);
        for (let i = 0; i < this.longIntermediates.length; i++) this.longIntermediates[i].toGeoCoords(t, e);
    }
    toPlane(t, e) {
        this.shortArc.toPlane(t, e), this.longArc.toPlane(t, e);
        for (let i = 0; i < this.shortIntermediates.length; i++) this.shortIntermediates[i].toPlane(t, e);
        for (let i = 0; i < this.longIntermediates.length; i++) this.longIntermediates[i].toPlane(t, e);
    }
    toPixels(t, e) {
        this.shortArc.toPixels(t, e), this.longArc.toPixels(t, e);
        for (let i = 0; i < this.shortIntermediates.length; i++) this.shortIntermediates[i].toPixels(t, e);
        for (let i = 0; i < this.longIntermediates.length; i++) this.longIntermediates[i].toPixels(t, e);
    }
    toViewportCanvas(t, e) {
        this.shortArc.toViewportCanvas(t, e), this.longArc.toViewportCanvas(t, e);
        for (let i = 0; i < this.shortIntermediates.length; i++) this.shortIntermediates[i].toViewportCanvas(t, e);
        for (let i = 0; i < this.longIntermediates.length; i++) this.longIntermediates[i].toViewportCanvas(t, e);
    }
    drawFeature(t, e, i) {
        expect(t, 'RenderClock'), expect(e, 'Earth'), expect(i, 'Number'), this.shortArc.drawFeature(t, e, i), 
        this.longArc.drawFeature(t, e, i);
        for (let n = 0; n < this.shortIntermediates.length; n++) this.shortIntermediates[n].drawFeature(t, e, i);
        for (let n = 0; n < this.longIntermediates.length; n++) this.longIntermediates[n].drawFeature(t, e, i);
    }
    discoverFeatures(t, e, i) {
        var n = this.discoverPoint(t, e, i);
        return null == n && (n = this.discoverLine(t, e, i)), n;
    }
    discoverPoint(t, e, i) {
        for (let a = 0; a < this.shortIntermediates.length; a++) {
            if ((n = this.shortIntermediates[a]).featureIsVisible(i) && n.isPointerAtPoint(t, e)) return n;
        }
        for (let a = 0; a < this.longIntermediates.length; a++) {
            var n;
            if ((n = this.longIntermediates[a]).featureIsVisible(i) && n.isPointerAtPoint(t, e)) return n;
        }
        return null;
    }
    discoverLine(t, e, i) {
        return this.shortArc.featureIsVisible(i) && this.shortArc.isPointerOnLine(t, e) ? this.shortArc : this.longArc.featureIsVisible(i) && this.longArc.isPointerOnLine(t, e) ? this.longArc : null;
    }
}