/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import expect from '../dev/expect.js';

import terminal from 'softlib/terminal.js';

class OrderedPair {
    constructor(e, t) {
        this.zOrder = e, this.layerId = t;
    }
}

export default class Catalog {
    static nextPackageId=0;
    static nextLayerId=0;
    constructor(e) {
        this.rwtOrthographicEarth = e, this.packages = new Map, this.layers = new Map, this.paintSequence = [];
    }
    addPackage(e) {
        expect(e, [ 'Space', 'Sphere', 'Night', 'Crosshairs', 'Crosshairs', 'Graticule', 'NamedMeridians', 'NamedParallels', 'GreatCircle', 'PlaceOfInterest', 'TopojsonPackage', 'GcsPackage' ]);
        var t = Catalog.nextPackageId++;
        return this.packages.set(t, e), t;
    }
    addLayer(e) {
        expect(e, 'Layer');
        var t = Catalog.nextLayerId++;
        return this.layers.set(t, e), expect(e.zOrder, 'Number'), this.paintSequence.push(new OrderedPair(e.zOrder, t)), 
        this.paintSequence.sort(((e, t) => e.zOrder < t.zOrder ? -1 : e.zOrder > t.zOrder ? 1 : 0)), 
        this.rwtOrthographicEarth.broadcastMessage('catalog/layerAdded', {
            layerId: t,
            zOrder: e.zOrder,
            layerName: e.layerName,
            identifiable: e.identifiable
        }), t;
    }
    getPackage(e) {
        return expect(e, 'Number'), this.packages.has(e) ? this.packages.get(e) : null;
    }
    getLayer(e) {
        return expect(e, 'Number'), this.layers.has(e) ? this.layers.get(e) : null;
    }
    runCourtesyValidator(e) {
        expect(e, 'vssStyleSheet');
        for (let [a, r] of this.layers) if (r.isVisible()) {
            var t = this.packages.get(r.packageId);
            expect(t, [ 'Space', 'Sphere', 'Night', 'Crosshairs', 'Graticule', 'NamedMeridians', 'NamedParallels', 'GreatCircle', 'PlaceOfInterest', 'TopojsonPackage', 'GcsPackage' ]), 
            t.runCourtesyValidator(e, r, a);
        }
    }
    renderAllInOne(e, t) {
        expect(e, 'Earth'), expect(t, 'RenderClock'), this.cleanSlate(e);
        for (let s = 0; s < this.paintSequence.length; s++) {
            var a = this.paintSequence[s].layerId, r = this.layers.get(a);
            if (expect(r, 'Layer'), r.isVisible() && t.isRenderTimeAvailable()) {
                var i = this.packages.get(r.packageId);
                i.rotation(t, e.coords), i.projection(t, e.ortho), i.transformation(t, e.carte), 
                i.placement(t, e.viewport), i.recomputeStyles(t, e.visual, r, a), i.drawLayer(t, e, a);
            }
        }
    }
    cleanSlate(e) {
        var t = !1;
        for (let e = 0; e < this.paintSequence.length; e++) {
            var a = this.paintSequence[e].layerId, r = this.layers.get(a);
            if (expect(r, 'Layer'), 'Space' == this.packages.get(r.packageId).constructor.name && 1 == (t = r.isVisible())) break;
        }
        if (0 == t) {
            var i = rgbaHexFromCSS(window.getComputedStyle(this.rwtOrthographicEarth).getPropertyValue('background-color')), s = e.canvas.getContext('2d');
            s.fillStyle = i, s.fillRect(0, 0, e.canvas.width, e.canvas.height);
        }
    }
    discoverFeatures(e, t) {
        var a = [];
        for (let o = this.paintSequence.length - 1; o >= 0; o--) {
            var r = this.paintSequence[o].layerId, i = this.layers.get(r);
            if (i.isIdentifiable()) {
                var s = this.packages.get(i.packageId).discoverFeatures(e, t);
                if (null != s) {
                    var n = i.featureKey, l = s.kvPairs.hasOwnProperty(n) ? s.kvPairs[n] : '';
                    if (i.identifyCallback) c = i.identifyCallback(s.kvPairs); else var c = `<tr><td>${i.layerName}</td><td>${l}</td></tr>`;
                    a.push({
                        layerName: i.layerName,
                        featureType: s.featureType,
                        featureName: s.featureName,
                        featureKey: n,
                        featureValue: l,
                        featureData: Object.assign(s.kvPairs),
                        identifyHTML: c
                    });
                }
            }
        }
        return a;
    }
    requestFeatureIdentification(e, t) {
        var a = [];
        for (let o = this.paintSequence.length - 1; o >= 0; o--) {
            var r = this.paintSequence[o].layerId, i = this.layers.get(r);
            if (i.isIdentifiable()) {
                var s = this.packages.get(i.packageId).discoverFeatures(e, t);
                if (null != s) {
                    var n = i.featureKey, l = s.kvPairs.hasOwnProperty(n) ? s.kvPairs[n] : '';
                    if (i.identifyCallback) c = i.identifyCallback(s.kvPairs); else var c = `<tr><td>${i.layerName}</td><td>${l}</td></tr>`;
                    a.push({
                        layerName: i.layerName,
                        featureType: s.featureType,
                        featureName: s.featureName,
                        featureKey: n,
                        featureValue: l,
                        featureData: Object.assign(s.kvPairs),
                        identifyHTML: c
                    });
                }
            }
        }
        return a;
    }
}

function rgbaHexFromCSS(e) {
    if (expect(e, 'String'), 'rgb(' == e.substr(0, 4)) {
        let t = e.match(/^rgb\(([^)]+)\)/);
        if (2 == t.length) {
            let e = t[1].split(',');
            if (3 == e.length) {
                return `#${convertIntegerToHex(e[0])}${convertIntegerToHex(e[1])}${convertIntegerToHex(e[2])}`;
            }
        }
    }
    if ('rgba(' == e.substr(0, 5)) {
        let t = e.match(/^rgba\(([^)]+)\)/);
        if (2 == t.length) {
            let e = t[1].split(',');
            if (4 == e.length) {
                return `#${convertIntegerToHex(e[0])}${convertIntegerToHex(e[1])}${convertIntegerToHex(e[2])}${Math.round(255 * Number(e[3].trim()), 0).toString(16).padStart(2, '0').toUpperCase()}`;
            }
        }
    }
    return e;
}

function convertIntegerToHex(e) {
    expect(e, 'String');
    var t = Number(e.trim());
    return isNaN(t) || t < 0 || t > 255 ? '00' : t.toString(16).padStart(2, '0').toUpperCase();
}

function monitorPerformance(e) {
    var t = performance.now();
    e();
    var a = performance.now() - t;
    terminal.trace(`${e} ${a.toFixed(2)} ms`);
}