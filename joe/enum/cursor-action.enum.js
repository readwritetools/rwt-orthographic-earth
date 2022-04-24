/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import EnumProxyHandler from './enum-proxy-handler.class.js';

var CursorAction = {
    RESTING_STATE: 0,
    FEATURE_DISCOVER: 101,
    FEATURE_IDENTIFY: 102,
    FEATURE_SELECT: 103,
    INDETERMINATE_ACTION: 201,
    NSEW_ANY: 301,
    NSEW_FROM_CURSOR: 302,
    NSEW_NORTH: 303,
    NSEW_SOUTH: 304,
    NSEW_EAST: 305,
    NSEW_WEST: 306,
    NSEW_NORTH_POLE: 307,
    NSEW_SOUTH_POLE: 308,
    NSEW_PRIME_MERIDIAN: 309,
    NSEW_DATELINE: 310,
    ZOOM_ANY: 401,
    ZOOM_IN: 402,
    ZOOM_OUT: 403,
    ZOOM_FIT: 404,
    PAN_SPACE_ANY: 501,
    PAN_SPACE_NORTH: 502,
    PAN_SPACE_SOUTH: 503,
    PAN_SPACE_EAST: 504,
    PAN_SPACE_WEST: 505,
    PAN_SPACE_RECENTER: 506,
    PAN_CANVAS_ANY: 601,
    PAN_CANVAS_NORTH: 602,
    PAN_CANVAS_SOUTH: 603,
    PAN_CANVAS_EAST: 604,
    PAN_CANVAS_WEST: 605,
    PAN_CANVAS_RECENTER: 606,
    SET_POINT_A: 701,
    SET_POINT_B: 702,
    SET_PLACE_OF_INTEREST: 703
};

Object.freeze(CursorAction);

export default new Proxy(CursorAction, new EnumProxyHandler('CursorAction'));