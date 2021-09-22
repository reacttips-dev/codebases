export const MUTED_COOKIE_NAME = 'muted';

const Volume = Backbone.Model.extend({
  currentVolume: null,
  muted: false,

  constants: {
    FULL: 1.0,
  },

  initialize: function() {
    Backbone.Model.prototype.initialize.apply(this, arguments);
    if (SS.currentUser.isGuest()) {
      this.setCurrentVolume(this.constants.FULL);
    }
  },

  getCurrentVolume: function() {
    this.currentVolume = localStorage.getItem('volume_level');
    if(!this.currentVolume) {
      this.currentVolume = this.constants.FULL;
      this.setCurrentVolume(this.currentVolume);
    }
    return this.currentVolume;
  },

  getMuted: function() {
    return JSON.parse(localStorage.getItem(MUTED_COOKIE_NAME));
  },

  setMuted: function(muted) {
    const stringValue = JSON.stringify(muted);

    // Store the value of 'muted' in cookies so it can be read in the php app. (PHP app can't
    // read directly from localStorage). Currently this is necessary for our tracking events (Mixpanel).
    $.cookie(MUTED_COOKIE_NAME, stringValue);

    localStorage.setItem(MUTED_COOKIE_NAME, stringValue);
  },

  setCurrentVolume: function(volume) {
    localStorage.setItem('volume_level', volume);
  }
});

export default Volume;
