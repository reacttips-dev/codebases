

const PlaybackState = Backbone.Model.extend({

  constants: {
    PAUSED: 0,
    PLAYING: 1,
    ENDED: 2,
  },

  setPaused: function() {
    this.set('state', this.constants.PAUSED);
  },

  setPlaying: function() {
    this.set('state', this.constants.PLAYING);
  },

  setEnded: function() {
    this.set('state', this.constants.ENDED);
  },

  isPaused: function() {
    return this.get('state') === this.constants.PAUSED;
  },

  isPlaying: function() {
    return this.get('state') === this.constants.PLAYING;
  },

  isEnded: function() {
    return this.get('state') === this.constants.ENDED;
  },

});

export default PlaybackState;

