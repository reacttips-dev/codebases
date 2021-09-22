

const TimeTracker = Backbone.Model.extend({
  timestamp: null,
  currentlySaving: false, // Mutex to prevent multiple recording of time watched

  defaults: {
    timeWatched: 0,
  },

  url: function() {
    return '/sessions/' + this.get('session_id') + '/trackTime';
  },

  initialize: function(data, options) {
    const interval = _.result(options, 'interval') || 15;
    this.interval = 1000 * interval;

    this.on('change:timeWatched', this._onTimeChange, this);
    _.bindAll(this, '_trackTime');
  },

  parse: function() {
    return {};
  },

  toJSON: function() {
    return _.pick(this.attributes, 'elapsed', 'time');
  },

  start: function() {
    this.timestamp = (new Date()).getTime();
  },

  stop: function(time) {
    this.markProgress(time);
    this._trackTime();
    this.timestamp = null;
  },

  markProgress: function(time) {
    if (!this.timestamp) {
      return;
    }
    const newTimestamp = (new Date()).getTime();
    const timeElapsed = newTimestamp - this.timestamp;
    this.timestamp = newTimestamp;
    this.set('time', Math.floor(time));

    // We experienced issues with users having a wildly high amount of seconds watched.
    // This was added as a defense against a bug were suspending the computer caused the video player
    // to freeze and restart when you unsuspended it, creating unexpected timeElapsed values.
    // We bind markProgress to the updateTime event from video.js, which fires at an interval of 15ms -250ms.
    // So timeElapsed should always be close to that range, but we'll provide a buffer of 1000 ms.
    // timeElapsed should never be above 1000 ms or it indicates the video player is in a frozen state.
    // https://github.com/Skillshare/tech-specs/blob/master/freemium-usage-tracker-bug.md)
    if (timeElapsed > 1000) {
      return;
    }

    this.incrementTimeWatched(timeElapsed);
  },

  incrementTimeWatched: function(milliseconds, options) {
    this.set('timeWatched', this.get('timeWatched') + milliseconds, options);
  },

  _onTimeChange: function(model, timeWatched) {
    if (timeWatched >= this.interval) {
      this._trackTime();
    }
  },

  _trackTime: function() {
    const elapsed = Math.floor(this.get('timeWatched') / 1000);
    const msWatched = elapsed * 1000;

    if (elapsed <= 0) {
      return;
    }
    if (this.currentlySaving) {
      // eslint-disable-next-line consistent-return
      return this.currentlySaving.always(this._trackTime);
    }

    const sessionId = this.get('session_id');

    this.incrementTimeWatched(-msWatched);
    this.currentlySaving = this.save({elapsed})
      .always(() => {
        this.currentlySaving = false;
      })
      .done(({shouldComplete = false, canUserCreateDiscussion = false}) => {
        this.trigger('saved', {
          sessionId,
          shouldComplete,
        });
        if (canUserCreateDiscussion) {
          SS.events.trigger('userCanCreateDiscussion', {canUserCreateDiscussion});
        }
      })
      .error(() => {
        this.incrementTimeWatched(msWatched, { silent: true });
      });
  },
});

export default TimeTracker;

