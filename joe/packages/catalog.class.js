/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import expect from '../joezone/expect.js';

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
        expect(e, [ 'Space', 'Sphere', 'Night', 'Graticule', 'NamedMeridians', 'NamedParallels', 'PlaceOfInterest', 'TopojsonPackage' ]);
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
    recomputeStyles(e) {
        expect(e, 'vssStyleSheet');
        for (let [a, r] of this.layers) if (r.isVisible()) {
            var t = this.packages.get(r.packageId);
            expect(t, [ 'Space', 'Sphere', 'Night', 'Graticule', 'NamedMeridians', 'NamedParallels', 'PlaceOfInterest', 'TopojsonPackage' ]), 
            (e.allFeaturesNeedRestyling || r.layerNeedsRestyling) && t.recomputeStyles(e, r, a);
        }
        e.allFeaturesNeedRestyling = !1;
    }
    runCourtesyValidator(e) {
        expect(e, 'vssStyleSheet');
        for (let [a, r] of this.layers) if (r.isVisible()) {
            var t = this.packages.get(r.packageId);
            expect(t, [ 'Space', 'Sphere', 'Night', 'Graticule', 'NamedMeridians', 'NamedParallels', 'PlaceOfInterest', 'TopojsonPackage' ]), 
            t.runCourtesyValidator(e, r, a);
        }
    }
    rotation(e) {
        for (let [a, r] of this.layers) if (r.isVisible()) {
            var t = this.packages.get(r.packageId);
            (e.allPointsNeedGeoCoords || t.packagePointsNeedGeoCoords) && t.rotation(e);
        }
        e.allPointsNeedGeoCoords = !1;
    }
    projection(e) {
        for (let [a, r] of this.layers) if (r.isVisible()) {
            var t = this.packages.get(r.packageId);
            (e.allPointsNeedProjection || t.packagePointsNeedProjection) && t.projection(e);
        }
        e.allPointsNeedProjection = !1;
    }
    transformation(e) {
        for (let [a, r] of this.layers) if (r.isVisible()) {
            var t = this.packages.get(r.packageId);
            (e.allPointsNeedTransformation || t.packagePointsNeedTransformation) && t.transformation(e);
        }
        e.allPointsNeedTransformation = !1;
    }
    placement(e) {
        for (let [a, r] of this.layers) if (r.isVisible()) {
            var t = this.packages.get(r.packageId);
            (e.allPointsNeedPlacement || t.packagePointsNeedPlacement) && t.placement(e);
        }
        e.allPointsNeedPlacement = !1;
    }
    render(e) {
        this.cleanSlate(e);
        for (let r = 0; r < this.paintSequence.length; r++) {
            var t = this.paintSequence[r].layerId, a = this.layers.get(t);
            if (expect(a, 'Layer'), a.isVisible()) this.packages.get(a.packageId).renderLayer(e, t);
        }
    }
    cleanSlate(e) {
        var t = !1;
        for (let e = 0; e < this.paintSequence.length; e++) {
            var a = this.paintSequence[e].layerId, r = this.layers.get(a);
            if (expect(r, 'Layer'), 'Space' == this.packages.get(r.packageId).constructor.name && 1 == (t = r.isVisible())) break;
        }
        if (0 == t) {
            var i = window.getComputedStyle(this.rwtOrthographicEarth).getPropertyValue('background-color'), s = this.rgbaHexFromCSS(i), l = e.canvas.getContext('2d');
            l.fillStyle = s, l.fillRect(0, 0, e.canvas.width, e.canvas.height);
        }
    }
    discoverFeatures(e, t) {
        var a = [];
        for (let c = this.paintSequence.length - 1; c >= 0; c--) {
            var r = this.paintSequence[c].layerId, i = this.layers.get(r);
            if (i.isIdentifiable()) {
                var s = this.packages.get(i.packageId).discoverFeatures(e, t);
                if (null != s) {
                    var l = i.featureKey, n = s.kvPairs.hasOwnProperty(l) ? s.kvPairs[l] : '';
                    if (i.identifyCallback) o = i.identifyCallback(s.kvPairs); else var o = `<tr><td>${i.layerName}</td><td>${n}</td></tr>`;
                    a.push({
                        layerName: i.layerName,
                        featureType: s.featureType,
                        featureName: s.featureName,
                        featureKey: l,
                        featureValue: n,
                        featureData: Object.assign(s.kvPairs),
                        identifyHTML: o
                    });
                }
            }
        }
        return a;
    }
    rgbaHexFromCSS(e) {
        if (expect(e, 'String'), 'rgb(' == e.substr(0, 4)) {
            let t = e.match(/^rgb\(([^)]+)\)/);
            if (2 == t.length) {
                let e = t[1].split(',');
                if (3 == e.length) {
                    return `#${this.convertIntegerToHex(e[0])}${this.convertIntegerToHex(e[1])}${this.convertIntegerToHex(e[2])}`;
                }
            }
        }
        if ('rgba(' == e.substr(0, 5)) {
            let t = e.match(/^rgba\(([^)]+)\)/);
            if (2 == t.length) {
                let e = t[1].split(',');
                if (4 == e.length) {
                    return `#${this.convertIntegerToHex(e[0])}${this.convertIntegerToHex(e[1])}${this.convertIntegerToHex(e[2])}${Math.round(255 * Number(e[3].trim()), 0).toString(16).padStart(2, '0').toUpperCase()}`;
                }
            }
        }
        return e;
    }
    convertIntegerToHex(e) {
        expect(e, 'String');
        var t = Number(e.trim());
        return isNaN(t) || t < 0 || t > 255 ? '00' : t.toString(16).padStart(2, '0').toUpperCase();
    }
}