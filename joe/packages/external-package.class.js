/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BasePackage from './base-package.class.js';

import PointFeature from '../features/point-feature.class.js';

import LineFeature from '../features/line-feature.class.js';

import PolygonFeature from '../features/polygon-feature.class.js';

import ProjectedPoint from '../projection/projected-point.class.js';

import RS from '../enum/rendering-state.enum.js';

import PS from '../enum/projection-stage.enum.js';

import FT from '../enum/feature-type.enum.js';

import expect from '../dev/expect.js';

export default class ExternalPackage extends BasePackage {
    constructor(e) {
        super(e), this.featurePolygons = [], this.featureLines = [], this.featurePoints = [], 
        this.replaceAppend = '', this.url = '', this.featureKey = '', this.polygonStopLength = 0, 
        this.lineStopLength = 0, this.pointStopLength = 0;
    }
    runCourtesyValidator(e, t, s) {
        expect(e, 'vssStyleSheet'), expect(t, 'Layer'), expect(s, 'Number'), super.runCourtesyValidator((() => {
            for (var r = 0; r < this.featurePolygons.length; r++) this.featurePolygons[r].runCourtesyValidator(e, t.vssClassname, t.vssIdentifier, r, s);
            for (r = 0; r < this.featureLines.length; r++) this.featureLines[r].runCourtesyValidator(e, t.vssClassname, t.vssIdentifier, r, s);
            for (r = 0; r < this.featurePoints.length; r++) this.featurePoints[r].runCourtesyValidator(e, t.vssClassname, t.vssIdentifier, r, s);
        }));
    }
    rotation(e, t) {
        expect(e, 'RenderClock'), expect(t, 'GeocentricCoordinates'), super.rotation(e, t, (() => {
            this.polygonStopLength = this.featurePolygons.length, this.timeRestrictedLoop(this.featurePolygons, FT.POLYGON, e, PS.ROTATION, (s => {
                s.toGeoCoords(e, t);
            })), this.lineStopLength = this.featureLines.length, this.timeRestrictedLoop(this.featureLines, FT.LINE, e, PS.ROTATION, (s => {
                s.toGeoCoords(e, t);
            })), this.pointStopLength = this.featurePoints.length, this.timeRestrictedLoop(this.featurePoints, FT.POINT, e, PS.ROTATION, (s => {
                s.toGeoCoords(e, t);
            }));
        }));
    }
    projection(e, t) {
        expect(e, 'RenderClock'), expect(t, 'OrthographicProjection'), super.projection(e, t, (() => {
            this.timeRestrictedLoop(this.featurePolygons, FT.POLYGON, e, PS.PROJECTION, (s => {
                s.toPlane(e, t);
            })), this.timeRestrictedLoop(this.featureLines, FT.LINE, e, PS.PROJECTION, (s => {
                s.toPlane(e, t);
            })), this.timeRestrictedLoop(this.featurePoints, FT.POINT, e, PS.PROJECTION, (s => {
                s.toPlane(e, t);
            }));
        }));
    }
    transformation(e, t) {
        expect(e, 'RenderClock'), expect(t, 'CartesianTransformation'), super.transformation(e, t, (() => {
            this.timeRestrictedLoop(this.featurePolygons, FT.POLYGON, e, PS.TRANSFORMATION, (s => {
                s.toPixels(e, t);
            })), this.timeRestrictedLoop(this.featureLines, FT.LINE, e, PS.TRANSFORMATION, (s => {
                s.toPixels(e, t);
            })), this.timeRestrictedLoop(this.featurePoints, FT.POINT, e, PS.TRANSFORMATION, (s => {
                s.toPixels(e, t);
            }));
        }));
    }
    placement(e, t) {
        expect(e, 'RenderClock'), expect(t, 'Viewport'), super.placement(e, t, (() => {
            this.timeRestrictedLoop(this.featurePolygons, FT.POLYGON, e, PS.PLACEMENT, (s => {
                s.toViewportCanvas(e, t);
            })), this.timeRestrictedLoop(this.featureLines, FT.LINE, e, PS.PLACEMENT, (s => {
                s.toViewportCanvas(e, t);
            })), this.timeRestrictedLoop(this.featurePoints, FT.POINT, e, PS.PLACEMENT, (s => {
                s.toViewportCanvas(e, t);
            }));
        }));
    }
    recomputeStyles(e, t, s, r) {
        expect(e, 'RenderClock'), expect(t, 'vssStyleSheet'), expect(s, 'Layer'), expect(r, 'Number'), 
        super.recomputeStyles(e, t, s, (() => {
            this.timeRestrictedLoop(this.featurePolygons, FT.POLYGON, e, PS.STYLING, ((o, i) => {
                o.computeFeatureStyle(e, t, s.vssClassname, s.vssIdentifier, i, r);
            })), this.timeRestrictedLoop(this.featureLines, FT.LINE, e, PS.STYLING, ((o, i) => {
                o.computeFeatureStyle(e, t, s.vssClassname, s.vssIdentifier, i, r);
            })), this.timeRestrictedLoop(this.featurePoints, FT.POINT, e, PS.STYLING, ((o, i) => {
                o.computeFeatureStyle(e, t, s.vssClassname, s.vssIdentifier, i, r);
            }));
        }));
    }
    drawLayer(e, t, s) {
        expect(e, 'RenderClock'), expect(t, 'Earth'), expect(s, 'Number'), super.drawLayer(e, (() => {
            this.timeRestrictedLoop(this.featurePolygons, FT.POLYGON, e, PS.DRAWING, (r => {
                r.drawFeature(e, t, s);
            })), this.timeRestrictedLoop(this.featureLines, FT.LINE, e, PS.DRAWING, (r => {
                r.drawFeature(e, t, s);
            })), this.timeRestrictedLoop(this.featurePoints, FT.POINT, e, PS.DRAWING, (r => {
                r.drawFeature(e, t, s);
            }));
        }));
    }
    timeRestrictedLoop(e, t, s, r, o) {
        expect(e, 'Array'), expect(t, 'Number'), expect(s, 'RenderClock'), expect(r, 'Number'), 
        expect(o, 'Function');
        let i = performance.now(), n = i + s.getTimeAllotment(r);
        var a = 0;
        switch (t) {
          case FT.POINT:
            a = this.pointStopLength;
            break;

          case FT.LINE:
            a = this.lineStopLength;
            break;

          case FT.POLYGON:
            a = this.polygonStopLength;
            break;

          default:
            terminal(`unexpected featureType ${t}`);
        }
        for (var p = 0; p < e.length && !(s.renderingState == RS.SKETCHING && p >= a) && !(performance.now() > n); p++) {
            o(e[p], p);
        }
        switch (t) {
          case FT.POINT:
            this.pointStopLength = p;
            break;

          case FT.LINE:
            this.lineStopLength = p;
            break;

          case FT.POLYGON:
            this.polygonStopLength = p;
            break;

          default:
            terminal(`unexpected featureType ${t}`);
        }
        let u = performance.now();
        s.consumeRenderTime(u - i);
    }
    discoverFeatures(e, t, s) {
        var r = this.discoverPolygon(e, t, s);
        return null == r && (r = this.discoverLine(e, t, s)), null == r && (r = this.discoverPoint(e, t, s)), 
        r;
    }
    discoverPolygon(e, t, s) {
        for (var r = 0; r < this.featurePolygons.length; r++) {
            var o = this.featurePolygons[r];
            if (o.featureIsVisible(s) && o.isPointerInsidePolygon(e, t)) return o;
        }
        return null;
    }
    discoverLine(e, t, s) {
        for (var r = 0; r < this.featureLines.length; r++) {
            var o = this.featureLines[r];
            if (o.featureIsVisible(s) && o.isPointerOnLine(e, t)) return o;
        }
        return null;
    }
    discoverPoint(e, t, s) {
        for (var r = 0; r < this.featurePoints.length; r++) {
            var o = this.featurePoints[r];
            if (o.featureIsVisible(s) && o.isPointerAtPoint(e, t)) return o;
        }
        return null;
    }
}