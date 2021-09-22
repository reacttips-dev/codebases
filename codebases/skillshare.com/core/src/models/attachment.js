import CreatorBaseModel from 'core/src/models/creator-base-model';

const AttachmentModel = CreatorBaseModel.extend({

  defaults: {
    url: '#',
  },

  initialize: function() {
    // store cid in model attrs so we can associate this model with
    // returned server data
    this.set('cid', this.cid);
    CreatorBaseModel.prototype.initialize.apply(this, arguments);
  },

  // The url gets updated once the file is finished uploading
  isComplete: function() {
    return this.get('url') !== this.defaults.url;
  },

});

export default AttachmentModel;

