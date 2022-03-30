/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BasePackage from './base-package.class.js';

import GeneralFeature from '../features/general-feature.class.js';

import expect from '../dev/expect.js';

export default class Sphere extends BasePackage {
    constructor(e) {
        super(e);
        var t = new Object;
        t['stroke-width'] = 'none', t['stroke-color'] = '#777777', t['fill-color'] = '#777777', 
        t['fill-type'] = 'source-over', this.properties = new GeneralFeature(t, 'sphere'), 
        this.packagePointsNeedGeoCoords = !0, this.packagePointsNeedProjection = !0, this.packagePointsNeedTransformation = !0, 
        this.packagePointsNeedPlacement = !0, this.rwtOrthographicEarth.broadcastMessage('package/sphere', null), 
        Object.seal(this);
    }
    recomputeStyles(e, t, r, a) {
        expect(e, 'RenderClock'), expect(t, 'vssStyleSheet'), expect(r, 'Layer'), expect(a, 'Number'), 
        super.recomputeStyles(e, t, r, (() => {
            this.properties.computeFeatureStyle(e, t, r.vssClassname, r.vssIdentifier, 0, a);
        }));
    }
    runCourtesyValidator(e, t, r) {
        expect(e, 'vssStyleSheet'), expect(t, 'Layer'), expect(r, 'Number'), super.runCourtesyValidator((() => {
            this.properties.runCourtesyValidator(e, t.vssClassname, t.vssIdentifier, 0, r);
        }));
    }
    static courtesyValidator(e) {
        switch (e) {
          case 'visibility':
          case 'transparency':
          case 'stroke-width':
          case 'stroke-color':
          case 'fill-color':
          case 'fill-type':
            return !0;

          default:
            return !1;
        }
    }
    rotation(e, t) {
        expect(e, 'RenderClock'), expect(t, 'GeocentricCoordinates'), super.rotation(e, t, (() => {}));
    }
    projection(e, t) {
        expect(e, 'RenderClock'), expect(t, 'OrthographicProjection'), super.projection(e, t, (() => {}));
    }
    transformation(e, t) {
        expect(e, 'RenderClock'), expect(t, 'CartesianTransformation'), super.transformation(e, t, (() => {}));
    }
    placement(e, t) {
        expect(e, 'RenderClock'), expect(t, 'Viewport'), super.placement(e, t, (() => {}));
    }
    drawLayer(e, t, r) {
        expect(e, 'RenderClock'), expect(t, 'Earth'), expect(r, 'Number'), super.drawLayer(e, (() => {
            let e = this.properties.canvasParams.get(r);
            'hidden' != e.visibility && this.drawSphere(t, e);
        }));
    }
    drawSphere(e, t) {
        expect(e, 'Earth'), expect(t, 'vssCanvasParameters');
        var r = e.canvas.getContext('2d'), a = e.carte.translate.a * e.carte.multiplier, s = e.carte.translate.b * e.carte.multiplier, o = e.viewport.centerPoint.x + a, c = e.viewport.centerPoint.y + s, i = e.getVisualizedRadius();
        r.beginPath(), r.arc(o, c, i, 0, 2 * Math.PI, !1), r.closePath(), r.fillStyle = t.computeFillPlusTransparency(), 
        r.strokeStyle = t['stroke-color'], r.lineWidth = t['stroke-width'], 'none' != t['stroke-width'] && r.stroke(), 
        r.globalCompositeOperation = t['fill-type'], 'none' != t['fill-color'] && r.fill(), 
        r.globalCompositeOperation = 'source-over';
    }
}