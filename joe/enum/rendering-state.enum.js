/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import EnumProxyHandler from './enum-proxy-handler.class.js';

var RenderingState = {
    NOT_RENDERING: 0,
    SKETCHING: 1,
    PAINTING: 2
};

Object.freeze(RenderingState);

export default new Proxy(RenderingState, new EnumProxyHandler('RenderingState'));