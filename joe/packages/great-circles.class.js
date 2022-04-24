/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import BasePackage from './base-package.class.js';

import GreatCircleFeature from '../features/great-circle-feature.class.js';

import expect from '../dev/expect.js';

export default class GreatCircles extends BasePackage {
    constructor(e, t) {
        super(e), expect(t, 'Array'), this.greatCircleFeatures = [], this.addFeatures(t), 
        this.workingFeature = null, this.packagePointsNeedGeoCoords = !0, this.packagePointsNeedProjection = !0, 
        this.packagePointsNeedTransformation = !0, this.packagePointsNeedPlacement = !0, 
        this.rwtOrthographicEarth.broadcastMessage('package/great-circles', null), Object.seal(this);
    }
    addFeatures(e) {
        expect(e, 'Array');
        for (let t = 0; t < e.length; t++) this.addFeature(e[t].embarkation, e[t].destination);
    }
    addFeature(e, t) {
        expect(e, 'Object'), expect(t, 'Object');
        var r = new GreatCircleFeature;
        return r.setEmbarkationPoint(e.name, e.latitude, e.longitude), r.setDestinationPoint(t.name, t.latitude, t.longitude), 
        r.determineArcsAndWaypoints(), this.greatCircleFeatures.push(r), this.packagePointsNeedGeoCoords = !0, 
        this.rwtOrthographicEarth.earth.invalidateCanvas(), r;
    }
    removeFeature(e) {
        for (let t = 0; t < this.greatCircleFeatures.length; t++) if (this.greatCircleFeatures[t].featureId == e) return void this.greatCircleFeatures.splice(t, 1);
    }
    setPointA(e, t, r) {
        if (expect(e, 'String'), expect(t, [ 'Number', 'String' ]), expect(r, [ 'Number', 'String' ]), 
        null == this.workingFeature && (this.workingFeature = new GreatCircleFeature, this.greatCircleFeatures.push(this.workingFeature)), 
        e = e || 'A', this.workingFeature.setEmbarkationPoint(e, t, r), null != this.workingFeature.destinationLatitude && null != this.workingFeature.destinationLongitude) {
            this.workingFeature.determineArcsAndWaypoints();
            var a = {
                featureId: this.workingFeature.featureId,
                embarkationName: this.workingFeature.embarkationName,
                destinationName: this.workingFeature.destinationName,
                distance: this.workingFeature.distance12
            };
            this.rwtOrthographicEarth.broadcastMessage('greatCircles/distanceFeatureAdded', a), 
            this.workingFeature = null;
        }
    }
    setPointB(e, t, r) {
        if (expect(e, 'String'), expect(t, [ 'Number', 'String' ]), expect(r, [ 'Number', 'String' ]), 
        null == this.workingFeature && (this.workingFeature = new GreatCircleFeature, this.greatCircleFeatures.push(this.workingFeature)), 
        e = e || 'B', this.workingFeature.setDestinationPoint(e, t, r), null != this.workingFeature.embarkationLatitude && null != this.workingFeature.embarkationLongitude) {
            this.workingFeature.determineArcsAndWaypoints();
            var a = {
                featureId: this.workingFeature.featureId,
                embarkationName: this.workingFeature.embarkationName,
                destinationName: this.workingFeature.destinationName,
                distance: this.workingFeature.distance12
            };
            this.rwtOrthographicEarth.broadcastMessage('greatCircles/distanceFeatureAdded', a), 
            this.workingFeature = null;
        }
    }
    recomputeStyles(e, t, r, a) {
        expect(e, 'RenderClock'), expect(t, 'vssStyleSheet'), expect(r, 'Layer'), expect(a, 'Number'), 
        super.recomputeStyles(e, t, r, (() => {
            for (let i = 0; i < this.greatCircleFeatures.length; i++) {
                this.greatCircleFeatures[i].computeFeatureStyle(e, t, r.vssClassname, r.vssIdentifier, i, a);
            }
        }));
    }
    runCourtesyValidator(e, t, r) {
        expect(e, 'vssStyleSheet'), expect(t, 'Layer'), expect(r, 'Number'), super.runCourtesyValidator((() => {
            for (let a = 0; a < this.greatCircleFeatures.length; a++) {
                this.greatCircleFeatures[a].runCourtesyValidator(e, t.vssClassname, t.vssIdentifier, a, r);
            }
        }));
    }
    rotation(e, t) {
        expect(e, 'RenderClock'), expect(t, 'GeocentricCoordinates'), super.rotation(e, t, (() => {
            for (let r = 0; r < this.greatCircleFeatures.length; r++) {
                this.greatCircleFeatures[r].toGeoCoords(e, t);
            }
        }));
    }
    projection(e, t) {
        expect(e, 'RenderClock'), expect(t, 'OrthographicProjection'), super.projection(e, t, (() => {
            for (let r = 0; r < this.greatCircleFeatures.length; r++) {
                this.greatCircleFeatures[r].toPlane(e, t);
            }
        }));
    }
    transformation(e, t) {
        expect(e, 'RenderClock'), expect(t, 'CartesianTransformation'), super.transformation(e, t, (() => {
            for (let r = 0; r < this.greatCircleFeatures.length; r++) {
                this.greatCircleFeatures[r].toPixels(e, t);
            }
        }));
    }
    placement(e, t) {
        expect(e, 'RenderClock'), expect(t, 'Viewport'), super.placement(e, t, (() => {
            for (let r = 0; r < this.greatCircleFeatures.length; r++) {
                this.greatCircleFeatures[r].toViewportCanvas(e, t);
            }
        }));
    }
    drawLayer(e, t, r) {
        expect(e, 'RenderClock'), expect(t, 'Earth'), expect(r, 'Number'), super.drawLayer(e, (() => {
            for (let a = 0; a < this.greatCircleFeatures.length; a++) {
                this.greatCircleFeatures[a].drawFeature(e, t, r);
            }
        }));
    }
    discoverFeatures(e, t, r) {
        for (let i = 0; i < this.greatCircleFeatures.length; i++) {
            var a = this.greatCircleFeatures[i].discoverFeatures(e, t, r);
            if (null != a) return a;
        }
        return null;
    }
}