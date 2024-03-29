/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import RenderLoop from './render/render-loop.class.js';

import GeocentricCoordinates from './projection/geocentric-coordinates.class.js';

import OrthographicProjection from './projection/orthographic-projection.class.js';

import CartesianTransformation from './projection/cartesian-transformation.class.js';

import Viewport from './projection/viewport.class.js';

import ProjectedPoint from './projection/projected-point.class.js';

import Catalog from './packages/catalog.class.js';

import vssStyleSheet from './visualization/vss-style-sheet.class.js';

import EarthPosition from './astronomy/earth-position.class.js';

import expect from './dev/expect.js';

import terminal from 'softlib/terminal.js';

export default class Earth {
    constructor(t) {
        this.rwtOrthographicEarth = t, this.canvas = t.canvas;
        this.visual = new vssStyleSheet(t, 10);
        this.coords = new GeocentricCoordinates(t, this, 0);
        this.ortho = new OrthographicProjection(t, this, 0, 0, 6371);
        this.carte = new CartesianTransformation(t, this, 0, 0, 10), this.viewport = new Viewport(t, this, {
            x: 0,
            y: 0
        }), this.earthPosition = new EarthPosition(t), this.catalog = new Catalog(t), this.epsilon = 4, 
        this.canvasCoords = {
            x: 0,
            y: 0
        }, this.canvasCoordsPending = !1, this.renderLoop = new RenderLoop(t, this);
    }
    reflectValues() {
        this.coords.reflectValues(), this.ortho.reflectValues(), this.carte.reflectValues(), 
        this.viewport.reflectValues(), this.earthPosition.reflectValues();
    }
    addVisualizationStyleSheet(t) {
        this.visual.addVisualizationStyleSheet(t);
    }
    addVisualizationRule(t) {
        this.visual.addVisualizationRule(t);
    }
    runCourtesyValidator() {
        this.catalog.runCourtesyValidator(this.visual);
    }
    getDeclination() {
        return this.coords.getDeclination();
    }
    reflectDeclination(t) {
        this.coords.setDeclination(t), this.invalidateCanvas();
    }
    getEarthRadius() {
        return this.ortho.radius;
    }
    setTangentLatitude(t) {
        this.ortho.setTangentLatitude(t), this.invalidateCanvas();
    }
    getTangentLatitude() {
        return this.ortho.latitude0;
    }
    setTangentLongitude(t) {
        t < -180 && (t += 360), t > 180 && (t -= 360), this.ortho.setTangentLongitude(t), 
        this.invalidateCanvas();
    }
    getTangentLongitude() {
        return this.ortho.longitude0;
    }
    setTranslation(t, e) {
        this.carte.setTranslation(t, e), this.invalidateCanvas();
    }
    setTranslationEastWest(t) {
        this.carte.setTranslationEastWest(t), this.invalidateCanvas();
    }
    setTranslationNorthSouth(t) {
        this.carte.setTranslationNorthSouth(t), this.invalidateCanvas();
    }
    getTranslation() {
        return this.carte.getTranslation();
    }
    getTranslationEastWest() {
        return this.carte.getTranslationEastWest();
    }
    getTranslationNorthSouth() {
        return this.carte.getTranslationNorthSouth();
    }
    setMultiplier(t) {
        this.carte.setMultiplier(t), this.visual.setMapScale(this.carte.getMapScale()), 
        this.invalidateCanvas();
    }
    getMultiplier() {
        return this.carte.getMultiplier();
    }
    setMapScale(t) {
        this.carte.setMapScale(t), this.visual.setMapScale(this.carte.getMapScale()), this.invalidateCanvas();
    }
    getMapScale() {
        return this.carte.getMapScale();
    }
    degreesPerPixelAtTangent() {
        var t = new ProjectedPoint(this.getTangentLatitude(), this.getTangentLongitude());
        this.coords.toPhiLambda(t), this.ortho.toEastingNorthing(t), this.carte.toEarthXY(t, !0, !0, !0), 
        this.viewport.toCanvasXY(t);
        var e = t.latitude, a = t.longitude;
        t.earthX += 1, t.earthY += 1, t.easting = t.earthX / this.carte.multiplier, t.northing = t.earthY / this.carte.multiplier, 
        this.ortho.inverseProjection(t);
        var i = t.latitude, s = t.longitude;
        return (Math.abs(s - a) + Math.abs(i - e)) / 2;
    }
    setCenterPoint(t) {
        this.viewport.setCenterPoint(t), this.invalidateCanvas();
    }
    setCenterPointX(t) {
        this.viewport.setCenterPointX(t), this.invalidateCanvas();
    }
    setCenterPointY(t) {
        this.viewport.setCenterPointY(t), this.invalidateCanvas();
    }
    getCenterPoint() {
        return this.viewport.getCenterPoint();
    }
    getCenterPointX() {
        return this.viewport.getCenterPointX();
    }
    getCenterPointY() {
        return this.viewport.getCenterPointY();
    }
    getCanvasWidth() {
        return this.viewport.canvasWidth;
    }
    getCanvasHeight() {
        return this.viewport.canvasHeight;
    }
    recalculateJulianDateDependants() {
        this.earthPosition.recalculateJulianDateDependants();
    }
    recalculateTimezoneDependants() {
        this.earthPosition.recalculateTimezoneDependants();
    }
    recalculateLongitudeDependants() {
        this.earthPosition.recalculateLongitudeDependants();
    }
    recalculateLatitudeDependants() {
        this.earthPosition.recalculateLatitudeDependants();
    }
    recalculateDeclinationDependants() {
        this.earthPosition.recalculateDeclinationDependants();
    }
    recalculatePlaceOfInterestDependants() {
        this.earthPosition.recalculatePlaceOfInterestDependants();
    }
    changeDayMonthYear(t) {
        this.earthPosition.changeDayMonthYear(t);
    }
    changeSpecialDay(t) {
        this.earthPosition.changeSpecialDay(t);
    }
    changeDayOfYear(t) {
        this.earthPosition.changeDayOfYear(t);
    }
    changeTimezoneOffset(t) {
        this.earthPosition.changeTimezoneOffset(t);
    }
    changeTimeOfDayHMS(t) {
        this.earthPosition.changeTimeOfDayHMS(t), this.invalidateCanvas();
    }
    changeTimezoneOffset(t) {
        this.earthPosition.changeTimezoneOffset(t);
    }
    addPackage(t) {
        return expect(t, [ 'Space', 'Sphere', 'Night', 'Crosshairs', 'Graticule', 'NamedMeridians', 'NamedParallels', 'GreatCircles', 'PlaceOfInterest', 'TopojsonPackage', 'GcsPackage' ]), 
        this.catalog.addPackage(t);
    }
    addLayer(t) {
        return expect(t, 'Layer'), this.catalog.addLayer(t);
    }
    getPackage(t) {
        return expect(t, 'Number'), this.catalog.getPackage(t);
    }
    getLayer(t) {
        return expect(t, 'Number'), this.catalog.getLayer(t);
    }
    invalidateCanvas() {
        this.renderLoop.invalidateCanvas();
    }
    renderAllInOne(t) {
        expect(t, 'RenderClock'), this.catalog.renderAllInOne(this, t);
    }
    changeCanvasCoords(t, e) {
        this.canvasCoords.x = t, this.canvasCoords.y = e, this.canvasCoordsPending = !0;
    }
    supressCanvasCoords(t, e) {
        this.canvasCoords.x = null, this.canvasCoords.y = null, this.canvasCoordsPending = !1;
    }
    canvasCoordsToProjectedPoint() {
        return this.getCoordinatesFromCanvasXY(this.canvasCoords.x, this.canvasCoords.y);
    }
    getCoordinatesFromCanvasXY(t, e) {
        var a = new ProjectedPoint(0, 0);
        return a.canvasX = t, a.canvasY = e, this.viewport.inverseViewport(a), this.carte.inverseTransformation(a), 
        this.ortho.inverseProjection(a), this.coords.inverse(a), a;
    }
    changePlaceOfInterest(t, e) {
        var a = this.getCoordinatesFromCanvasXY(t, e);
        this.earthPosition.setPlaceOfInterest(a.longitude, a.latitude);
    }
    setPlaceOfInterest(t, e) {
        this.earthPosition.setPlaceOfInterest(t, e);
    }
    requestFeatureDiscovery() {
        var t = this.catalog.discoverFeatures(this.canvasCoords.x, this.canvasCoords.y);
        this.rwtOrthographicEarth.broadcastMessage('user/discoveredFeatures', t);
    }
    requestFeatureIdentification(t, e) {
        var a = this.catalog.discoverFeatures(t, e);
        this.rwtOrthographicEarth.broadcastMessage('user/identifiedFeatures', a);
    }
    requestFeatureSelection(t, e) {
        var a = this.catalog.selectFeatures(t, e);
        this.rwtOrthographicEarth.broadcastMessage('user/selectedFeatures', a);
    }
    setPointA(t, e) {
        var a = this.catalog.discoverFeatures(t, e), i = a.length > 0 ? a[0].featureValue : 'A', s = this.getCoordinatesFromCanvasXY(t, e), r = this.catalog.getDistancePackage();
        r.setPointA(i, s.latitude, s.longitude), r.packagePointsNeedGeoCoords = !0, r.packagePointsNeedProjection = !0, 
        r.packagePointsNeedTransformation = !0, r.packagePointsNeedPlacement = !0, this.catalog.getDistanceLayer().layerNeedsRestyling = !0, 
        this.invalidateCanvas();
    }
    setPointB(t, e) {
        var a = this.catalog.discoverFeatures(t, e), i = a.length > 0 ? a[0].featureValue : 'B', s = this.getCoordinatesFromCanvasXY(t, e), r = this.catalog.getDistancePackage();
        r.setPointB(i, s.latitude, s.longitude), r.packagePointsNeedGeoCoords = !0, r.packagePointsNeedProjection = !0, 
        r.packagePointsNeedTransformation = !0, r.packagePointsNeedPlacement = !0, this.catalog.getDistanceLayer().layerNeedsRestyling = !0, 
        this.invalidateCanvas();
    }
    getVisualizedRadius() {
        return Math.round(this.ortho.radius * this.carte.multiplier);
    }
}