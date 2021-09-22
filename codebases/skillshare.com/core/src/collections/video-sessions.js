import VideoSession from 'core/src/models/video-session';

const VideoSessionsCollection = Backbone.Collection.extend({
  model: VideoSession,

  comparator: function(model) {
    return model.get('rank');
  },

  initialize: function(models, options = {}) {
    this.unit = options.unit;
  },
});

export default VideoSessionsCollection;

