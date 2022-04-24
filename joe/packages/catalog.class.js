/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import GreatCircles from '../packages/great-circles.class.js';

import Layer from '../layers/layer.class.js';

import expect from '../dev/expect.js';

import terminal from 'softlib/terminal.js';

class OrderedPair {
    constructor(e, a) {
        this.zOrder = e, this.layerId = a;
    }
}

export default class Catalog {
    static nextPackageId=0;
    static nextLayerId=0;
    constructor(e) {
        this.rwtOrthographicEarth = e, this.packages = new Map, this.layers = new Map, this.paintSequence = [], 
        this.distancePackage = null, this.distanceLayer = null;
    }
    addPackage(e) {
        expect(e, [ 'Space', 'Sphere', 'Night', 'Crosshairs', 'Crosshairs', 'Graticule', 'NamedMeridians', 'NamedParallels', 'GreatCircles', 'PlaceOfInterest', 'TopojsonPackage', 'GcsPackage' ]);
        var a = Catalog.nextPackageId++;
        return this.packages.set(a, e), a;
    }
    addLayer(e) {
        expect(e, 'Layer');
        var a = Catalog.nextLayerId++;
        return this.layers.set(a, e), expect(e.zOrder, 'Number'), this.paintSequence.push(new OrderedPair(e.zOrder, a)), 
        this.paintSequence.sort(((e, a) => e.zOrder < a.zOrder ? -1 : e.zOrder > a.zOrder ? 1 : 0)), 
        e.layerNeedsRestyling = !0, this.rwtOrthographicEarth.broadcastMessage('catalog/layerAdded', {
            layerId: a,
            zOrder: e.zOrder,
            layerName: e.layerName,
            identifiable: e.identifiable,
            selectable: e.selectable
        }), a;
    }
    getPackage(e) {
        return expect(e, 'Number'), this.packages.has(e) ? this.packages.get(e) : null;
    }
    getLayer(e) {
        return expect(e, 'Number'), this.layers.has(e) ? this.layers.get(e) : null;
    }
    getDistancePackage() {
        if (null == this.distancePackage) {
            this.distancePackage = new GreatCircles(this.rwtOrthographicEarth, []);
            var e = this.addPackage(this.distancePackage);
            this.distanceLayer = new Layer(this.rwtOrthographicEarth, e, 1e3, 'Distances', 'distances', 'great-circles', 'id', 'yes', null, 'yes'), 
            this.addLayer(this.distanceLayer);
        }
        return this.distancePackage;
    }
    getDistanceLayer() {
        return this.getDistancePackage(), this.distanceLayer;
    }
    renderAllInOne(e, a) {
        expect(e, 'Earth'), expect(a, 'RenderClock'), this.cleanSlate(e);
        for (let s = 0; s < this.paintSequence.length; s++) {
            var t = this.paintSequence[s].layerId, r = this.layers.get(t);
            if (expect(r, 'Layer'), r.isVisible() && a.isRenderTimeAvailable()) {
                var i = this.packages.get(r.packageId);
                i.rotation(a, e.coords), i.projection(a, e.ortho), i.transformation(a, e.carte), 
                i.placement(a, e.viewport), i.recomputeStyles(a, e.visual, r, t), i.drawLayer(a, e, t);
            }
        }
    }
    cleanSlate(e) {
        var a = !1;
        for (let e = 0; e < this.paintSequence.length; e++) {
            var t = this.paintSequence[e].layerId, r = this.layers.get(t);
            if (expect(r, 'Layer'), 'Space' == this.packages.get(r.packageId).constructor.name && 1 == (a = r.isVisible())) break;
        }
        if (0 == a) {
            var i = rgbaHexFromCSS(window.getComputedStyle(this.rwtOrthographicEarth).getPropertyValue('background-color')), s = e.canvas.getContext('2d');
            s.fillStyle = i, s.fillRect(0, 0, e.canvas.width, e.canvas.height);
        }
    }
    runCourtesyValidator(e) {
        expect(e, 'vssStyleSheet');
        for (let [t, r] of this.layers) if (r.isVisible()) {
            var a = this.packages.get(r.packageId);
            expect(a, [ 'Space', 'Sphere', 'Night', 'Crosshairs', 'Graticule', 'NamedMeridians', 'NamedParallels', 'GreatCircles', 'PlaceOfInterest', 'TopojsonPackage', 'GcsPackage' ]), 
            a.runCourtesyValidator(e, r, t);
        }
    }
    discoverFeatures(e, a) {
        var t = [];
        for (let d = this.paintSequence.length - 1; d >= 0; d--) {
            var r = this.paintSequence[d].layerId, i = this.layers.get(r);
            if (i.isIdentifiable()) {
                var s = this.packages.get(i.packageId).discoverFeatures(e, a, r);
                if (null != s) {
                    var n = i.featureKey, c = s.kvPairs.hasOwnProperty(n) ? s.kvPairs[n] : '';
                    if (i.identifyCallback) l = i.identifyCallback(s.kvPairs); else var l = `<tr><td>${i.layerName}</td><td>${c}</td></tr>`;
                    t.push({
                        layerName: i.layerName,
                        featureId: s.featureId,
                        featureType: s.featureType,
                        featureName: s.featureName,
                        featureKey: n,
                        featureValue: c,
                        featureData: Object.assign(s.kvPairs),
                        identifyHTML: l
                    });
                }
            }
        }
        return t;
    }
    selectFeatures(e, a) {
        var t = [];
        for (let o = this.paintSequence.length - 1; o >= 0; o--) {
            var r = this.paintSequence[o].layerId, i = this.layers.get(r);
            if (i.isSelectable()) {
                var s = this.packages.get(i.packageId).discoverFeatures(e, a, r);
                if (null != s) {
                    s.toggleSelectedState(), i.layerNeedsRestyling = !0, this.rwtOrthographicEarth.invalidateCanvas();
                    var n = i.featureKey, c = s.kvPairs.hasOwnProperty(n) ? s.kvPairs[n] : '';
                    if (i.identifyCallback) l = i.identifyCallback(s.kvPairs); else var l = `<tr><td>${i.layerName}</td><td>${c}</td></tr>`;
                    var d = s.roughAndReadyPoint();
                    t.push({
                        layerName: i.layerName,
                        featureId: s.featureId,
                        featureType: s.featureType,
                        featureName: s.featureName,
                        featureKey: n,
                        featureValue: c,
                        featureData: Object.assign(s.kvPairs),
                        identifyHTML: l,
                        isSelected: s.isSelected,
                        latitude: d.latitude,
                        longitude: d.longitude
                    });
                }
            }
        }
        return t;
    }
}

function rgbaHexFromCSS(e) {
    if (expect(e, 'String'), 'rgb(' == e.substr(0, 4)) {
        let a = e.match(/^rgb\(([^)]+)\)/);
        if (2 == a.length) {
            let e = a[1].split(',');
            if (3 == e.length) {
                return `#${convertIntegerToHex(e[0])}${convertIntegerToHex(e[1])}${convertIntegerToHex(e[2])}`;
            }
        }
    }
    if ('rgba(' == e.substr(0, 5)) {
        let a = e.match(/^rgba\(([^)]+)\)/);
        if (2 == a.length) {
            let e = a[1].split(',');
            if (4 == e.length) {
                return `#${convertIntegerToHex(e[0])}${convertIntegerToHex(e[1])}${convertIntegerToHex(e[2])}${Math.round(255 * Number(e[3].trim()), 0).toString(16).padStart(2, '0').toUpperCase()}`;
            }
        }
    }
    return e;
}

function convertIntegerToHex(e) {
    expect(e, 'String');
    var a = Number(e.trim());
    return isNaN(a) || a < 0 || a > 255 ? '00' : a.toString(16).padStart(2, '0').toUpperCase();
}

function monitorPerformance(e) {
    var a = performance.now();
    e();
    var t = performance.now() - a;
    terminal.trace(`${e} ${t.toFixed(2)} ms`);
}