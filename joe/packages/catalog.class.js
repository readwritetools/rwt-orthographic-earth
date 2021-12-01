/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
/* Copyright (c) 2021 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
export default class Catalog {
    constructor(e) {
        this.rwtOrthographicEarth = e, this.packages = [];
    }
    addPackage(e) {
        this.packages.push(e), this.rwtOrthographicEarth.broadcastMessage('catalog/packageAdded', {
            id: e.identifier,
            layerName: e.layerName,
            identifiable: e.identifiable
        });
    }
    removePackage(e) {
        for (var a = 0; a < this.packages.length; a++) this.packages[a].identifier == e && this.packages.splice(a, 1);
        this.rwtOrthographicEarth.broadcastMessage('catalog/packageRemoved', e);
    }
    getPackage(e) {
        for (var a = 0; a < this.packages.length; a++) if (this.packages[a].identifier == e) return this.packages[a];
    }
    recomputeStyles(e) {
        for (var a = 0; a < this.packages.length; a++) (e.allFeaturesNeedRestyling || this.packages[a].packageNeedsRestyling) && this.packages[a].isVisible() && this.packages[a].recomputeStyles(e);
        e.allFeaturesNeedRestyling = !1;
    }
    rotation(e) {
        for (var a = 0; a < this.packages.length; a++) (e.allPointsNeedGeoCoords || this.packages[a].packagePointsNeedGeoCoords) && this.packages[a].isVisible() && this.packages[a].rotation(e);
        e.allPointsNeedGeoCoords = !1;
    }
    projection(e) {
        for (var a = 0; a < this.packages.length; a++) (e.allPointsNeedProjection || this.packages[a].packagePointsNeedProjection) && this.packages[a].isVisible() && this.packages[a].projection(e);
        e.allPointsNeedProjection = !1;
    }
    transformation(e) {
        for (var a = 0; a < this.packages.length; a++) (e.allPointsNeedTransformation || this.packages[a].packagePointsNeedTransformation) && this.packages[a].isVisible() && this.packages[a].transformation(e);
        e.allPointsNeedTransformation = !1;
    }
    placement(e) {
        for (var a = 0; a < this.packages.length; a++) (e.allPointsNeedPlacement || this.packages[a].packagePointsNeedPlacement) && this.packages[a].isVisible() && this.packages[a].placement(e);
        e.allPointsNeedPlacement = !1;
    }
    render(e) {
        this.cleanSlate(e);
        for (var a = 0; a < this.packages.length; a++) this.packages[a].isVisible() && this.packages[a].render(e);
    }
    cleanSlate(e) {
        for (var a = !1, t = 0; t < this.packages.length; t++) if ('Space' == this.packages[t].constructor.name) {
            a = this.packages[t].isVisible();
            break;
        }
        if (0 == a) {
            var s = window.getComputedStyle(this.rwtOrthographicEarth).getPropertyValue('background-color'), i = e.canvas.getContext('2d');
            i.fillStyle = s, i.fillRect(0, 0, e.canvas.width, e.canvas.height);
        }
    }
    discoverFeatures(e, a) {
        for (var t = [], s = this.packages.length - 1; s >= 0; s--) {
            var i = this.packages[s];
            if (i.isIdentifiable()) {
                var r = i.discoverFeatures(e, a);
                if (null != r) {
                    if (i.identifyCallback) c = i.identifyCallback(r.kvPairs); else var c = `<tr><td>${i.layerName}</td><td>${r.featureName}</td></tr>`;
                    t.push({
                        layerName: i.layerName,
                        featureType: r.featureType,
                        featureName: r.featureName,
                        featureData: Object.assign(r.kvPairs),
                        identifyHTML: c
                    });
                }
            }
        }
        return t;
    }
}