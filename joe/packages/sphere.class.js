/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BasePackage from './base-package.class.js';

import GeneralFeature from '../features/general-feature.class.js';

export default class Sphere extends BasePackage {
    constructor(e, t, a, s, r) {
        super(e, t, a, s, r);
        var i = new Object;
        i['stroke-width'] = 'none', i['stroke-color'] = '#777777', i['fill-color'] = '#777777', 
        i['fill-type'] = 'source-over', this.properties = new GeneralFeature(i), this.packageNeedsRestyling = !0, 
        this.packagePointsNeedGeoCoords = !0, this.packagePointsNeedProjection = !0, this.packagePointsNeedTransformation = !0, 
        this.packagePointsNeedPlacement = !0, this.rwtOrthographicEarth.broadcastMessage('package/sphere', null);
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
            var t = e.canvas.getContext('2d'), a = e.carte.translate.a * e.carte.multiplier, s = e.carte.translate.b * e.carte.multiplier, r = e.viewport.centerPoint.x + a, i = e.viewport.centerPoint.y + s, o = e.getVisualizedRadius();
            t.beginPath(), t.arc(r, i, o, 0, 2 * Math.PI, !1), t.closePath(), t.fillStyle = this.properties.canvasParams.computeFillPlusTransparency(), 
            t.strokeStyle = this.properties.canvasParams['stroke-color'], t.lineWidth = this.properties.canvasParams['stroke-width'], 
            'none' != this.properties.canvasParams['stroke-width'] && t.stroke(), t.globalCompositeOperation = this.properties.canvasParams['fill-type'], 
            'none' != this.properties.canvasParams['fill-color'] && t.fill(), t.globalCompositeOperation = 'source-over';
        }
    }
}