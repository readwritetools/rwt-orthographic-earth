/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import EnumProxyHandler from './enum-proxy-handler.class.js';

var ProjectionStage = {
    ROTATION: 1,
    PROJECTION: 2,
    TRANSFORMATION: 3,
    PLACEMENT: 4,
    STYLING: 5,
    DRAWING: 6
};

Object.freeze(ProjectionStage);

export default new Proxy(ProjectionStage, new EnumProxyHandler('ProjectionStage'));