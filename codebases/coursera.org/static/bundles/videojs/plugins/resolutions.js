/*
 * Allows selection of sources by resolution for video.js.
 *
 * Usage:
 *
 * player.resolutions({
 *   sourcesByResolution: {
 *     '540p': [
 *       { type: "video/mp4", src: "540p/video.mp4" },
 *       { type: "video/webm", src: "540p/video.webm" }],
 *     ],
 *     '720p': [
 *       { type: "video/mp4", src: "720p/video.mp4" },
 *       { type: "video/webm", src: "720p/video.webm" }
 *     ]
 *   }
 * });
 * player.resolution('720p');  // Set resolution to 720p
 * console.log("Current resolution: " + player.resolution());  // Get current resolution
 *
 */
import videojs from 'video.js';

import _ from 'underscore';
import logger from 'js/app/loggerSingleton';
import config from 'js/app/config';

const ResolutionsHandler = function (player, options) {
  this.player = player;
  this.sourcesByResolution = options.sourcesByResolution;
  this.supportedResolutions = _(this._knownResolutions).intersection(_(options.sourcesByResolution).keys());
  this.resolution = this.isResolutionSupported(options.resolution) ? options.resolution : '540p';
  this.possibleResolutions = this.supportedResolutions;

  this.player.on(
    'error',
    function () {
      const error = this.player.error();
      // code=4 is the error code for a URL not loading the video, try another one
      if (error && error.code === 4 && config.environment !== 'testing') {
        logger.error('Attempted to get source for resolution, but server responded with an error');
        const currentResolution = this.getResolution();
        this.possibleResolutions = _(this.possibleResolutions).without(currentResolution);

        if (this.possibleResolutions.length) {
          this.setResolution(this.possibleResolutions[0]);
        }
      }
    }.bind(this)
  );
};

ResolutionsHandler.prototype.getResolution = function () {
  return this.resolution;
};

ResolutionsHandler.prototype.getResolutionIndex = function () {
  return _(this.supportedResolutions).indexOf(this.resolution);
};

ResolutionsHandler.prototype.isResolutionSupported = function (resolution) {
  return _(this.supportedResolutions).contains(resolution);
};

/**
 * If it is supported, return the mp4 source for the provided resolution.
 * @param {String} A resolution of the form '360p', '540p', etc.
 */
ResolutionsHandler.prototype.getSourceForResolution = function (resolution) {
  if (!this.isResolutionSupported(resolution)) {
    logger.error('Attempted to get source for unsupported resolution');
    return undefined;
  }
  const mp4 = _(this.sourcesByResolution[resolution]).findWhere({
    type: 'video/mp4',
  });
  return mp4 && mp4.src;
};

ResolutionsHandler.prototype.setResolution = function (resolution) {
  if (this.resolution === resolution) return;

  // If the resolution is not supported, do nothing.
  if (!this.isResolutionSupported(resolution)) return;

  const currentTime = this.player.currentTime();
  const playbackRate = this.player.playbackRate();
  const paused = this.player.paused();

  this.player.pause();

  this.player.one(
    'loadedmetadata',
    function () {
      this.player.currentTime(currentTime);
      if (this.player.options().playbackRates) {
        this.player.playbackRate(playbackRate);
      }

      if (paused) {
        this.player.pause();
      } else {
        this.player.play();
      }
    }.bind(this)
  );

  this.player.src(this.sourcesByResolution[resolution]);

  this.resolution = resolution;

  this.player.trigger('resolutionchange');
};

ResolutionsHandler.prototype.decreaseResolution = function () {
  if (!(this.supportedResolutions.length === 0 || this.getResolution === _(this.supportedResolutions).first())) {
    this.setResolution(this.supportedResolutions[this.getResolutionIndex() - 1]);
  }
};

ResolutionsHandler.prototype.increaseResolution = function () {
  if (!(this.supportedResolutions.length === 0 || this.resolution === _(this.supportedResolutions).last())) {
    this.setResolution(this.supportedResolutions[this.getResolutionIndex() + 1]);
  }
};

ResolutionsHandler.prototype._knownResolutions = ['360p', '540p', '720p'];

videojs.registerPlugin('resolutions', function (options) {
  if (!this.resolutionsHandler_) {
    const resolutionsHandler = new ResolutionsHandler(this, options);
    this.resolutionsHandler_ = resolutionsHandler;
    this.resolution = function (newResolution) {
      if (newResolution) {
        resolutionsHandler.setResolution(newResolution);
        return newResolution;
      } else {
        return resolutionsHandler.getResolution();
      }
    };
    this.increaseResolution = resolutionsHandler.increaseResolution.bind(resolutionsHandler);
    this.decreaseResolution = resolutionsHandler.decreaseResolution.bind(resolutionsHandler);
    this.isResolutionSupported = resolutionsHandler.isResolutionSupported.bind(resolutionsHandler);
    this.getResolutionIndex = resolutionsHandler.getResolutionIndex.bind(resolutionsHandler);
    this.getSourceForResolution = resolutionsHandler.getSourceForResolution.bind(resolutionsHandler);
  }
});
