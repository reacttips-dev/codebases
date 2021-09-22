

const Video = Backbone.Model.extend({

  urlRoot: '/raw-videos',

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

  toJSON: function() {
    let response = _.clone(this.attributes);
    response = _.pick(response, 'id', 'external_storage_key', 'name', 'processing_state');
    return response;
  },

  parse: function(response) {
    const data = _.pick(response, 'id', 'external_storage_key', 'name', 'processing_state', 'image_thumbnail', 'platform_video_id');
    data.title = this.createTitle(data.name);
    return data;
  },

  createTitle: function(name) {
    if (!name) {
      return name;
    }
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/[_\-]/gi, ' ')
      .replace(/\.(.*)/gi, '');
  },
});

export default Video;

