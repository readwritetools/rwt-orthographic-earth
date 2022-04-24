/* Copyright (c) 2022 Read Write Tools. Legal use subject to the JavaScript Orthographic Earth Software License Agreement. */
import terminal from 'softlib/terminal.js';

import RS from '../enum/rendering-state.enum.js';

import PS from '../enum/projection-stage.enum.js';

export default class RenderClock {
    constructor() {
        this.mostRecentRender = performance.now(), this.renderTimeRemaining = 0, this.renderingState = RS.NOT_RENDERING, 
        Object.seal(this);
    }
    consumeRenderTime(e) {
        this.renderTimeRemaining = this.renderTimeRemaining - e;
    }
    getTimeAllotment(e) {
        if (this.renderingState == RS.PAINTING) return this.renderTimeRemaining;
        switch (e) {
          case PS.ROTATION:
          case PS.PROJECTION:
          case PS.TRANSFORMATION:
          case PS.PLACEMENT:
          case PS.STYLING:
          case PS.DRAWING:
            return Math.min(this.renderTimeRemaining, 25);

          default:
            return terminal.logic(`Unrecognized projectionStage ${e}`), 0;
        }
    }
    isRenderTimeAvailable() {
        return this.renderTimeRemaining > 0;
    }
}