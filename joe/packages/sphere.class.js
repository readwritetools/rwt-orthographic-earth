/* Copyright (c) 2021 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BasePackage from './base-package.class.js';

import GeneralFeature from '../features/general-feature.class.js';

export default class Sphere extends BasePackage {
    constructor(e, a, t, s) {
        super(e, a, t, s), this.identifiable = 'disallow';
        var r = new Object;
        r.surface = 'hidden', r['surface-background-color'] = '#FFFFFF', r.horizon = 'hidden', 
        r['horizon-stroke-color'] = '#FFFFFF', r['horizon-stroke-width'] = 1, this.properties = new GeneralFeature(r), 
        this.packageNeedsRestyling = !0, this.packagePointsNeedGeoCoords = !0, this.packagePointsNeedProjection = !0, 
        this.packagePointsNeedTransformation = !0, this.packagePointsNeedPlacement = !0, 
        this.rwtOrthographicEarth.broadcastMessage('package/sphere', null);
    }
    recomputeStyles(e) {
        this.properties.computeStyle(e, this.classname, this.identifier, 0), this.packageNeedsRestyling = !1;
    }
    rotation(e) {
        this.packagePointsNeedGeoCoords = !1, this.packagePointsNeedProjection = !0;
    }
    projection(e) {
        this.packagePointsNeedProjection = !1, this.packagePointsNeedTransformation = !0;
    }
    transformation(e) {
        this.packagePointsNeedTransformation = !1, this.packagePointsNeedPlacement = !0;
    }
    placement(e) {
        this.packagePointsNeedPlacement = !1;
    }
    render(e) {
        if ('hidden' != this.properties.canvasParams.visibility) {
            var a = e.canvas.getContext('2d'), t = e.carte.translate.a * e.carte.multiplier, s = e.carte.translate.b * e.carte.multiplier, r = e.viewport.centerPoint.x + t, i = e.viewport.centerPoint.y + s, o = e.getVisualizedRadius();
            if ('visible' == this.properties.canvasParams.surface && (a.beginPath(), a.fillStyle = this.properties.canvasParams['surface-background-color'], 
            a.arc(r, i, o, 0, 2 * Math.PI, !1), a.closePath(), a.fill()), 'visible' == this.properties.canvasParams.horizon) {
                a.beginPath(), a.strokeStyle = this.properties.canvasParams['horizon-stroke-color'];
                var n = parseInt(this.properties.canvasParams['horizon-stroke-width']);
                a.lineWidth = n;
                var c = o + n / 2;
                a.arc(r, i, c, 0, 2 * Math.PI, !1), a.closePath(), a.stroke();
            }
        }
    }
}