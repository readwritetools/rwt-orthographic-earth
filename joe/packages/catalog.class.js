/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import expect from 'softlib/expect.js';

class OrderedPair {
    constructor(e, a) {
        this.zOrder = e, this.layerId = a;
    }
}

export default class Catalog {
    static nextPackageId=0;
    static nextLayerId=0;
    constructor(e) {
        this.rwtOrthographicEarth = e, this.packages = new Map, this.layers = new Map, this.paintSequence = [];
    }
    addPackage(e) {
        expect(e, [ 'Space', 'Sphere', 'Night', 'Graticule', 'NamedMeridians', 'NamedParallels', 'PlaceOfInterest', 'TopojsonPackage', 'GcsPackage' ]);
        var a = Catalog.nextPackageId++;
        return this.packages.set(a, e), a;
    }
    addLayer(e) {
        expect(e, 'Layer');
        var a = Catalog.nextLayerId++;
        return this.layers.set(a, e), expect(e.zOrder, 'Number'), this.paintSequence.push(new OrderedPair(e.zOrder, a)), 
        this.paintSequence.sort(((e, a) => e.zOrder < a.zOrder ? -1 : e.zOrder > a.zOrder ? 1 : 0)), 
        this.rwtOrthographicEarth.broadcastMessage('catalog/layerAdded', {
            layerId: a,
            zOrder: e.zOrder,
            layerName: e.layerName,
            identifiable: e.identifiable
        }), a;
    }
    getPackage(e) {
        return expect(e, 'Number'), this.packages.has(e) ? this.packages.get(e) : null;
    }
    getLayer(e) {
        return expect(e, 'Number'), this.layers.has(e) ? this.layers.get(e) : null;
    }
    recomputeStyles(e) {
        expect(e, 'vssStyleSheet');
        for (let [t, r] of this.layers) if (r.isVisible()) {
            var a = this.packages.get(r.packageId);
            expect(a, [ 'Space', 'Sphere', 'Night', 'Graticule', 'NamedMeridians', 'NamedParallels', 'PlaceOfInterest', 'TopojsonPackage', 'GcsPackage' ]), 
            (e.allFeaturesNeedRestyling || r.layerNeedsRestyling) && a.recomputeStyles(e, r, t);
        }
        e.allFeaturesNeedRestyling = !1;
    }
    runCourtesyValidator(e) {
        expect(e, 'vssStyleSheet');
        for (let [t, r] of this.layers) if (r.isVisible()) {
            var a = this.packages.get(r.packageId);
            expect(a, [ 'Space', 'Sphere', 'Night', 'Graticule', 'NamedMeridians', 'NamedParallels', 'PlaceOfInterest', 'TopojsonPackage', 'GcsPackage' ]), 
            a.runCourtesyValidator(e, r, t);
        }
    }
    rotation(e) {
        for (let [t, r] of this.layers) if (r.isVisible()) {
            var a = this.packages.get(r.packageId);
            (e.allPointsNeedGeoCoords || a.packagePointsNeedGeoCoords) && a.rotation(e);
        }
        e.allPointsNeedGeoCoords = !1;
    }
    projection(e) {
        for (let [t, r] of this.layers) if (r.isVisible()) {
            var a = this.packages.get(r.packageId);
            (e.allPointsNeedProjection || a.packagePointsNeedProjection) && a.projection(e);
        }
        e.allPointsNeedProjection = !1;
    }
    transformation(e) {
        for (let [t, r] of this.layers) if (r.isVisible()) {
            var a = this.packages.get(r.packageId);
            (e.allPointsNeedTransformation || a.packagePointsNeedTransformation) && a.transformation(e);
        }
        e.allPointsNeedTransformation = !1;
    }
    placement(e) {
        for (let [t, r] of this.layers) if (r.isVisible()) {
            var a = this.packages.get(r.packageId);
            (e.allPointsNeedPlacement || a.packagePointsNeedPlacement) && a.placement(e);
        }
        e.allPointsNeedPlacement = !1;
    }
    render(e) {
        this.cleanSlate(e);
        for (let r = 0; r < this.paintSequence.length; r++) {
            var a = this.paintSequence[r].layerId, t = this.layers.get(a);
            if (expect(t, 'Layer'), t.isVisible()) this.packages.get(t.packageId).renderLayer(e, a);
        }
    }
    cleanSlate(e) {
        var a = !1;
        for (let e = 0; e < this.paintSequence.length; e++) {
            var t = this.paintSequence[e].layerId, r = this.layers.get(t);
            if (expect(r, 'Layer'), 'Space' == this.packages.get(r.packageId).constructor.name && 1 == (a = r.isVisible())) break;
        }
        if (0 == a) {
            var i = window.getComputedStyle(this.rwtOrthographicEarth).getPropertyValue('background-color'), s = this.rgbaHexFromCSS(i), l = e.canvas.getContext('2d');
            l.fillStyle = s, l.fillRect(0, 0, e.canvas.width, e.canvas.height);
        }
    }
    discoverFeatures(e, a) {
        var t = [];
        for (let o = this.paintSequence.length - 1; o >= 0; o--) {
            var r = this.paintSequence[o].layerId, i = this.layers.get(r);
            if (i.isIdentifiable()) {
                var s = this.packages.get(i.packageId).discoverFeatures(e, a);
                if (null != s) {
                    var l = i.featureKey, n = s.kvPairs.hasOwnProperty(l) ? s.kvPairs[l] : '';
                    if (i.identifyCallback) c = i.identifyCallback(s.kvPairs); else var c = `<tr><td>${i.layerName}</td><td>${n}</td></tr>`;
                    t.push({
                        layerName: i.layerName,
                        featureType: s.featureType,
                        featureName: s.featureName,
                        featureKey: l,
                        featureValue: n,
                        featureData: Object.assign(s.kvPairs),
                        identifyHTML: c
                    });
                }
            }
        }
        return t;
    }
    requestFeatureIdentification(e, a) {
        var t = [];
        for (let o = this.paintSequence.length - 1; o >= 0; o--) {
            var r = this.paintSequence[o].layerId, i = this.layers.get(r);
            if (i.isIdentifiable()) {
                var s = this.packages.get(i.packageId).discoverFeatures(e, a);
                if (null != s) {
                    var l = i.featureKey, n = s.kvPairs.hasOwnProperty(l) ? s.kvPairs[l] : '';
                    if (i.identifyCallback) c = i.identifyCallback(s.kvPairs); else var c = `<tr><td>${i.layerName}</td><td>${n}</td></tr>`;
                    t.push({
                        layerName: i.layerName,
                        featureType: s.featureType,
                        featureName: s.featureName,
                        featureKey: l,
                        featureValue: n,
                        featureData: Object.assign(s.kvPairs),
                        identifyHTML: c
                    });
                }
            }
        }
        return t;
    }
    rgbaHexFromCSS(e) {
        if (expect(e, 'String'), 'rgb(' == e.substr(0, 4)) {
            let a = e.match(/^rgb\(([^)]+)\)/);
            if (2 == a.length) {
                let e = a[1].split(',');
                if (3 == e.length) {
                    return `#${this.convertIntegerToHex(e[0])}${this.convertIntegerToHex(e[1])}${this.convertIntegerToHex(e[2])}`;
                }
            }
        }
        if ('rgba(' == e.substr(0, 5)) {
            let a = e.match(/^rgba\(([^)]+)\)/);
            if (2 == a.length) {
                let e = a[1].split(',');
                if (4 == e.length) {
                    return `#${this.convertIntegerToHex(e[0])}${this.convertIntegerToHex(e[1])}${this.convertIntegerToHex(e[2])}${Math.round(255 * Number(e[3].trim()), 0).toString(16).padStart(2, '0').toUpperCase()}`;
                }
            }
        }
        return e;
    }
    convertIntegerToHex(e) {
        expect(e, 'String');
        var a = Number(e.trim());
        return isNaN(a) || a < 0 || a > 255 ? '00' : a.toString(16).padStart(2, '0').toUpperCase();
    }
}