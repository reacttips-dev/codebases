import Completion from 'core/src/models/completion';
import SessionNotesCollection from 'core/src/collections/session-notes';

const VideoSessionModel = Backbone.Model.extend({

  playbackStates: {
    PAUSED: 0,
    PLAYING: 1,
    ENDED: 3,
  },

  constructor: function(attributes, options = {}) {

    this.unit = options.unit;
    this.completion = new Completion();

    this.notes = new SessionNotesCollection([], {
      session: this,
    });

    Backbone.Model.apply(this, arguments);
  },

  initialize: function(attributes, options = {}) {

    // Eager load the Notes collection
    if (options.fetchNotes) {
      this.notes.fetchSet();
    }
  },

  parse: function(resp) {
    const response = _.clone(resp);

    // Always ensure the completion model is set with defaults for this session
    this.completion.set({
      target_type: 'Session',
      target_id: response.id,
      parent_id: response.parent_id,
    });

    // Update the completion model with the unit completion data
    if (response.sessionCompletion) {
      this.completion.set(response.sessionCompletion, {
        parse: true,
      });

      this.completion.set({
        completed: true,
      });
    }

    return response;
  },

  setVideoId: function(callback) {
    if (this.get('videoId')) {
      return callback();
    }

    const _this = this;

    $.ajax({
      url: '/sessions/' + this.get('id') + '/video',
      dataType: 'json',
      success: function(data = {}) {
        if (data.video_hashed_id) {
          _this.set('videoId', data.video_hashed_id);
        }

        callback();
      },
      error: function() {
        callback();
      },
    });
  },

  isFirstOverall: function() {
    return this.get('overallRank') === 0;
  },

  isFirstInUnit: function() {
    return this.get('rank') === 0;
  },

  isCompleted: function() {
    return this.completion.get('completed');
  },

  getThumbnailForVideoPlayer: function() {
    const thumbnails = this.get('thumbnails');
    let thumbnail;

    if (!thumbnails) {
      return null;
    }

    if (_.has(thumbnails, 'large')) {
      thumbnail = thumbnails.large;
    } else if (_.has(thumbnails, 'huge')) {
      thumbnail = thumbnails.huge;
    } else if (_.has(thumbnails, 'medium')) {
      thumbnail = thumbnails.medium;
    } else if (_.has(thumbnails, 'small')) {
      thumbnail = thumbnails.small;
    } else {
      return null;
    }

    return thumbnail;
  },

  setPaused: function() {
    this.set('playbackState', this.playbackStates.PAUSED);
  },

  setPlaying: function() {
    this.set('playbackState', this.playbackStates.PLAYING);
  },

  setEnded: function() {
    this.set('playbackState', this.playbackStates.ENDED);
  },

  isPaused: function() {
    return this.get('playbackState') === this.playbackStates.PAUSED;
  },

  isPlaying: function() {
    return this.get('playbackState') === this.playbackStates.PLAYING;
  },

  isEnded: function() {
    return this.get('playbackState') === this.playbackStates.ENDED;
  },
});

export default VideoSessionModel;
