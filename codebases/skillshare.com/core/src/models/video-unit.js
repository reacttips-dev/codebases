import VideoSessionsCollection from 'core/src/collections/video-sessions';
import Completion from 'core/src/models/completion';

const VideoUnitModel = Backbone.Model.extend({

  constructor: function() {
    this.sessions = new VideoSessionsCollection();
    this.completion = new Completion();
    Backbone.Model.apply(this, arguments);
  },

  parse: function(resp) {
    const response = _.clone(resp);

    this.sessions.set(response.sessions, { unit: this, parse: true });
    delete response.sessions;

    // Always ensure the completion model is set with defaults for this unit
    this.completion.set({
      target_type: 'Unit',
      target_id: response.id,
      parent_id: response.parent_id,
    });

    // Update the completion model with the unit completion data
    if (response.unitCompletion) {
      this.completion.set(response.unitCompletion, { parse: true });
      this.completion.set({ completed: true });
    }

    return response;
  },

  // A unit is completed if all of the sessions within it are completed
  isCompleted: function() {
    return this.sessions.every(function(session) {
      return session.isCompleted();
    });
  },

});

export default VideoUnitModel;

