import { fabric } from "fabric";

export default class VideoEventHandler {
  constructor(fVideoObj, handler) {
    this.fVideoObj = fVideoObj;
    this.element = fVideoObj.getElement();
    this.handler = handler;
    this.shouldRender = false;
    this.requestFrameId = 0;
    this.initialize();
  }

  initialize = () => {
    this.element.onloadeddata = this.onLoadedData;

    this.element.ontimeupdate = this.onTimeUpdate;

    this.element.onplay = this.onPlay;

    this.element.onpause = this.onPause;

    this.element.onended = this.onEnded;
  };

  onLoadedData = () => {
    this.handler.canvas.renderAll();
  };

  onTimeUpdate = () => {
    if (this.element.currentTime >= this.fVideoObj.endTime) {
      this.fVideoObj.stop();
      this.stopRequestAnimFrame();
      if (this.handler.onVideoPlayingStatusChange) {
        this.handler.onVideoPlayingStatusChange(false);
      }
    }
  };

  onPlay = () => {
    this.shouldRender = true;
    this.startRequestAnimFrame();
    if (this.handler.onVideoPlayingStatusChange) {
      this.handler.onVideoPlayingStatusChange(true);
    }
  };

  onPause = () => {
    this.stopRequestAnimFrame();
    if (this.handler.onVideoPlayingStatusChange) {
      this.handler.onVideoPlayingStatusChange(false);
    }
  };

  onEnded = () => {
    this.stopRequestAnimFrame();
    if (this.handler.onVideoPlayingStatusChange) {
      this.handler.onVideoPlayingStatusChange(false);
    }
  };

  startRequestAnimFrame = () => {
    this.requestFrameId = fabric.util.requestAnimFrame(this.render);
  };

  stopRequestAnimFrame = () => {
    this.shouldRender = false;
    fabric.util.cancelAnimFrame(this.requestFrameId);
    this.requestFrameId = 0;
  };

  render = () => {
    if (!this.shouldRender) {
      return;
    }
    this.handler.canvas.requestRenderAll();
    this.requestFrameId = fabric.util.requestAnimFrame(this.render);
  };
}
