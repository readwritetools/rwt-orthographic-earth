/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import EnumProxyHandler from './enum-proxy-handler.class.js';

var FeatureType = {
    POINT: 1,
    LINE: 2,
    POLYGON: 3
};

Object.freeze(FeatureType);

export default new Proxy(FeatureType, new EnumProxyHandler('FeatureType'));