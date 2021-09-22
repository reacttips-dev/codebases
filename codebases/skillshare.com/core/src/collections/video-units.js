import VideoUnit from 'core/src/models/video-unit';

const VideoUnitsCollection = Backbone.Collection.extend({

  model: VideoUnit,

  comparator: function(model) {
    return model.get('rank');
  },

  getFlattenedSessions: function() {
    if (this.flattenedSessions) {
      return this.flattenedSessions;
    }

    this.flattenedSessions = _.flatten(this.map(function(unit) {
      return unit.sessions.models;
    }));
    return this.flattenedSessions;
  },

  getSessionById: function(id) {
    const filtered = _.filter(this.getFlattenedSessions(), function(session) {
      return session.get('id') === id;
    });
    return filtered[0];
  },

  getSessionAtIndex: function(index) {
    const flattenedSessions = this.getFlattenedSessions();
    return flattenedSessions[index];
  },

  nextSession: function(session) {
    const index = session.get('overallRank');
    return this.getSessionAtIndex(index + 1);
  },

  previousSession: function(session) {
    const index = session.get('overallRank');
    return this.getSessionAtIndex(index - 1);
  },

});

export default VideoUnitsCollection;

