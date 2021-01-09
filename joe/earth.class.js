/* Copyright (c) 2021 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import RenderLoop from './projection/render-loop.class.js';

import GeocentricCoordinates from './projection/geocentric-coordinates.class.js';

import OrthographicProjection from './projection/orthographic-projection.class.js';

import CartesianTransformation from './projection/cartesian-transformation.class.js';

import Viewport from './projection/viewport.class.js';

import ProjectedPoint from './projection/projected-point.class.js';

import Catalog from './packages/catalog.class.js';

import vssStyleSheet from './visualization/vss-style-sheet.class.js';

import EarthPosition from './astronomy/earth-position.class.js';

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
        }, this.canvasCoordsPending = !1, this.pendingUpdates = !1, this.currentlyPainting = !1, 
        this.renderLoop = new RenderLoop(t, this);
    }
    reflectValues() {
        this.coords.reflectValues(), this.ortho.reflectValues(), this.carte.reflectValues(), 
        this.viewport.reflectValues(), this.earthPosition.reflectValues();
    }
    addVisualizationStyleSheet(t) {
        this.visual.addVisualizationStyleSheet(t), this.invalidateCanvas();
    }
    addVisualizationRule(t) {
        this.visual.addVisualizationRule(t);
    }
    visualization() {
        this.catalog.recomputeStyles(this.visual);
    }
    getDeclination() {
        return this.coords.getDeclination();
    }
    reflectDeclination(t) {
        this.coords.setDeclination(t), this.invalidateCanvas();
    }
    rotation() {
        this.catalog.rotation(this.coords);
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
        t < -180 && (t += 360), t > 210 && (t -= 360), this.ortho.setTangentLongitude(t), 
        this.invalidateCanvas();
    }
    getTangentLongitude() {
        return this.ortho.longitude0;
    }
    projection() {
        this.catalog.projection(this.ortho);
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
        this.ortho.toPlane(t), this.carte.toPixels(t, !0, !0, !0), this.viewport.toCanvas(t);
        var e = t.latitude, a = t.longitude;
        t.earthX += 1, t.earthY += 1, t.easting = t.earthX / this.carte.multiplier, t.northing = t.earthY / this.carte.multiplier, 
        this.ortho.inverseProjection(t);
        var i = t.latitude, s = t.longitude;
        return (Math.abs(s - a) + Math.abs(i - e)) / 2;
    }
    transformation() {
        this.catalog.transformation(this.carte);
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
    placement() {
        this.catalog.placement(this.viewport);
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
        this.catalog.addPackage(t);
    }
    removePackage(t) {
        this.catalog.removePackage(t);
    }
    getPackage(t) {
        return this.catalog.getPackage(t);
    }
    invalidateCanvas() {
        this.pendingUpdates = !0;
    }
    paintCanvas(t) {
        this.currentlyPainting = !0, this.visualization(), this.rotation(), this.projection(), 
        this.transformation(), this.placement(), this.catalog.render(this), this.currentlyPainting = !1, 
        this.pendingUpdates = !1;
    }
    changeCanvasCoords(t, e) {
        this.canvasCoords.x = t, this.canvasCoords.y = e, this.canvasCoordsPending = !0;
    }
    supressCanvasCoords(t, e) {
        this.canvasCoords.x = null, this.canvasCoords.y = null, this.canvasCoordsPending = !1;
    }
    changePlaceOfInterest(t, e) {
        var a = this.getCoordinatesFromCanvasXY(t, e);
        this.earthPosition.setPlaceOfInterest(a.longitude, a.latitude);
    }
    setPlaceOfInterest(t, e) {
        this.earthPosition.setPlaceOfInterest(t, e);
    }
    canvasCoordsToProjectedPoint() {
        return this.getCoordinatesFromCanvasXY(this.canvasCoords.x, this.canvasCoords.y);
    }
    getCoordinatesFromCanvasXY(t, e) {
        var a = new ProjectedPoint(0, 0);
        return a.canvasX = t, a.canvasY = e, this.viewport.inverseViewport(a), this.carte.inverseTransformation(a), 
        this.ortho.inverseProjection(a), this.coords.inverse(a), a;
    }
    discoverFeatures() {
        return this.getCoordinatesFromCanvasXY(this.canvasCoords.x, this.canvasCoords.y).isOnEarth ? this.catalog.discoverFeatures(this.canvasCoords.x, this.canvasCoords.y) : [];
    }
    getVisualizedRadius() {
        return Math.round(this.ortho.radius * this.carte.multiplier);
    }
};