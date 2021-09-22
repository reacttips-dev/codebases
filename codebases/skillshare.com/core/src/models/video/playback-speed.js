

const PlaybackSpeedModel = Backbone.Model.extend({

  urlRoot: '/video-settings/playback-speed',

  currentPlaybackSpeed: null,

  playbackSpeeds: [{
    label: '0.5x',
    value: 0.5,
  }, {
    label: '1x',
    value: 1,
  }, {
    label: '1.25x',
    value: 1.25,
  }, {
    label: '1.5x',
    value: 1.5,
  }, {
    label: '2x',
    value: 2,
  }],

  // these should be ordered by speed
  // append new values
  constants: {
    HALF: 0,
    NORMAL: 1,
    TIMEANDAQUARTER: 2,
    TIMEANDAHALF: 3,
    DOUBLE: 4,
  },

  initialize: function() {
    Backbone.Model.prototype.initialize.apply(this, arguments);

    if (SS.currentUser.isGuest()) {
      this.set('playback_speed', this.constants.NORMAL);
      this.currentPlaybackSpeed = this.playbackSpeeds[this.constants.NORMAL];
    }
  },

  getCurrentPlaybackSpeed: function() {
    if (!this.currentPlaybackSpeed) {
      this.currentPlaybackSpeed = this.playbackSpeeds[this.get('playback_speed')];
    }

    return this.currentPlaybackSpeed;
  },

  setCurrentPlaybackSpeed: function(playbackSpeed) {
    this.currentPlaybackSpeed = playbackSpeed;
    this.set('playback_speed', this.getCurrentPlaybackSpeedIndex());
    this.save();

    this.trigger('video:player:playbackSpeedChanged');

    SS.EventTracker.track('Changed Video Playback Speed', null, {
      playbackSpeed: playbackSpeed.value,
    });
  },

  setCurrentPlaybackSpeedByIndex: function(index) {
    this.setCurrentPlaybackSpeed(this.playbackSpeeds[index]);
  },

  getNextPlaybackSpeed: function() {
    const currentPlaybackSpeedIndex = this.getCurrentPlaybackSpeedIndex();
    let nextPlaybackSpeedIndex = _.isNull(currentPlaybackSpeedIndex) ? 0 : currentPlaybackSpeedIndex + 1;

    if (nextPlaybackSpeedIndex > this.playbackSpeeds.length - 1) {
      nextPlaybackSpeedIndex = 0;
    }

    return this.playbackSpeeds[nextPlaybackSpeedIndex];
  },

  getCurrentPlaybackSpeedIndex: function() {
    return _.indexOf(this.playbackSpeeds, this.currentPlaybackSpeed);
  },

  parse: function(response) {
    const data = _.pick(response, 'playback_speed');
    return data;
  },
});

export default PlaybackSpeedModel;

