/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BasePackage from './base-package.class.js';

import GeneralFeature from '../features/general-feature.class.js';

import expect from '../joezone/expect.js';

export default class Sphere extends BasePackage {
    constructor(e) {
        super(e);
        var t = new Object;
        t['stroke-width'] = 'none', t['stroke-color'] = '#777777', t['fill-color'] = '#777777', 
        t['fill-type'] = 'source-over', this.properties = new GeneralFeature(t), this.packagePointsNeedGeoCoords = !0, 
        this.packagePointsNeedProjection = !0, this.packagePointsNeedTransformation = !0, 
        this.packagePointsNeedPlacement = !0, this.rwtOrthographicEarth.broadcastMessage('package/sphere', null), 
        Object.seal(this);
    }
    recomputeStyles(e, t, a) {
        expect(e, 'vssStyleSheet'), expect(t, 'Layer'), expect(a, 'Number'), this.properties.computeFeatureStyle(e, t.vssClassname, t.vssIdentifier, 0, a), 
        t.layerNeedsRestyling = !1;
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
    renderLayer(e, t) {
        expect(e, 'Earth'), expect(t, 'Number');
        let a = this.properties.canvasParams.get(t);
        if (expect(a, 'vssCanvasParameters'), 'hidden' != a.visibility) {
            var s = e.canvas.getContext('2d'), r = e.carte.translate.a * e.carte.multiplier, o = e.carte.translate.b * e.carte.multiplier, i = e.viewport.centerPoint.x + r, n = e.viewport.centerPoint.y + o, c = e.getVisualizedRadius();
            s.beginPath(), s.arc(i, n, c, 0, 2 * Math.PI, !1), s.closePath(), s.fillStyle = a.computeFillPlusTransparency(), 
            s.strokeStyle = a['stroke-color'], s.lineWidth = a['stroke-width'], 'none' != a['stroke-width'] && s.stroke(), 
            s.globalCompositeOperation = a['fill-type'], 'none' != a['fill-color'] && s.fill(), 
            s.globalCompositeOperation = 'source-over';
        }
    }
}