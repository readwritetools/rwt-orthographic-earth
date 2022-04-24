/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import ExternalPackage from './external-package.class.js';

import PointFeature from '../features/point-feature.class.js';

import LineFeature from '../features/line-feature.class.js';

import PolygonFeature from '../features/polygon-feature.class.js';

import ProjectedPoint from '../projection/projected-point.class.js';

import GcsHoldingArea from 'gcsio/gcs/gcs-holding-area.class.js';

import * as GcsParser from 'gcsio/api/gcs-parser.js';

import expect from '../dev/expect.js';

import terminal from 'softlib/terminal.js';

import aver from 'softlib/aver.js';

export default class GcsPackage extends ExternalPackage {
    constructor(e) {
        super(e), this.format = '', Object.seal(this);
    }
    async retrieveData(e, t, r) {
        expect(e, 'String'), expect(t, 'String'), expect(r, 'Object'), this.replaceAppend = e, 
        this.url = t, this.featureKey = r.featureKey || '', this.format = r.format || this.impliedFormat(t), 
        'replace' == this.replaceAppend && (this.featurePolygons = [], this.featureLines = [], 
        this.featurePoints = []);
        try {
            var a = await fetch(t, {
                cache: 'no-cache',
                referrerPolicy: 'no-referrer'
            });
            if (200 != a.status && 304 != a.status) throw new Error(`Request for ${t} returned with ${a.status}`);
            if ([ 'geojson', 'gfe', 'ice', 'tae' ].includes(this.format)) {
                const e = await a.text();
                this.handleTextData(e, r);
            } else if ([ 'gfebin', 'icebin', 'taebin' ].includes(this.format)) {
                const e = await a.arrayBuffer();
                this.handleBinaryData(e, r);
            } else terminal.abnormal('format must be one of \'geojson\', \'gfe\', \'gfebin\', \'ice\', \'icebin\', \'tae\', \'taebin\'');
        } catch (e) {
            terminal.caught(e);
        }
        this.packagePointsNeedGeoCoords = !0, this.packagePointsNeedProjection = !0, this.packagePointsNeedTransformation = !0, 
        this.packagePointsNeedPlacement = !0, this.rwtOrthographicEarth.broadcastMessage('package/gcs-package', this.url);
    }
    impliedFormat(e) {
        return expect(e, 'String'), -1 != e.indexOf('.geojson') ? 'geojson' : -1 != e.indexOf('.gfebin') ? 'gfebin' : -1 != e.indexOf('.gfe') ? 'gfe' : -1 != e.indexOf('.icebin') ? 'icebin' : -1 != e.indexOf('.ice') ? 'ice' : -1 != e.indexOf('.taebin') ? 'taebin' : -1 != e.indexOf('.tae') ? 'tae' : '';
    }
    handleTextData(e, t) {
        expect(e, 'String'), expect(t, 'Object');
        var r = new GcsHoldingArea;
        'geojson' == this.format ? GcsParser.parseGeojson(r, e, t) : 'gfe' == this.format ? GcsParser.parseGfe(r, e, t) : 'ice' == this.format ? GcsParser.parseIce(r, e, t) : 'tae' == this.format && GcsParser.parseTae(r, e, t), 
        this.bridgeGcsioToFeatures(r, t.featureKey);
    }
    handleBinaryData(e, t) {
        expect(e, 'ArrayBuffer'), expect(t, 'Object');
        var r = new GcsHoldingArea;
        'gfebin' == this.format ? GcsParser.parseGfeBinary(r, e, t) : 'icebin' == this.format ? GcsParser.parseIceBinary(r, e, t) : 'taebin' == this.format && GcsParser.parseTaeBinary(r, e, t), 
        this.bridgeGcsioToFeatures(r, t.featureKey);
    }
    bridgeGcsioToFeatures(e, t) {
        expect(e, 'GcsHoldingArea'), this.bridgePolygons(e.gcsFeaturePolygons), this.bridgeLines(e.gcsFeatureLines), 
        this.bridgePoints(e.gcsFeaturePoints);
    }
    bridgePolygons(e, t) {
        expect(e, 'Array');
        for (let n = 0; n < e.length; n++) {
            var r = e[n], a = new PolygonFeature;
            for (let e = 0; e < r.outerRing.length; e++) a.outerRing.push(new ProjectedPoint(r.outerRing[e].latitude, r.outerRing[e].longitude));
            for (let e = 0; e < r.innerRings.length; e++) {
                var i = r.innerRings[e], s = new PolygonFeature;
                for (let e = 0; e < i.length; e++) s.outerRing.push(new ProjectedPoint(i[e].latitude, i[e].longitude));
                a.innerRings.push(s);
            }
            Object.assign(a.kvPairs, r.kvPairs), t && null != a.kvPairs[t] && (a.featureName = a.kvPairs[t]), 
            this.featurePolygons.push(a);
        }
    }
    bridgeLines(e, t) {
        expect(e, 'Array');
        for (let i = 0; i < e.length; i++) {
            var r = e[i], a = new LineFeature;
            for (let e = 0; e < r.lineSegment.length; e++) a.lineSegment.push(new ProjectedPoint(r.lineSegment[e].latitude, r.lineSegment[e].longitude));
            Object.assign(a.kvPairs, r.kvPairs), t && null != a.kvPairs[t] && (a.featureName = a.kvPairs[t]), 
            this.featureLines.push(a);
        }
    }
    bridgePoints(e, t) {
        expect(e, 'Array');
        for (let i = 0; i < e.length; i++) {
            var r = e[i], a = new PointFeature;
            a.discretePoint = new ProjectedPoint(r.discretePoint.latitude, r.discretePoint.longitude), 
            Object.assign(a.kvPairs, r.kvPairs), t && null != a.kvPairs[t] && (a.featureName = a.kvPairs[t]), 
            this.featurePoints.push(a);
        }
    }
}