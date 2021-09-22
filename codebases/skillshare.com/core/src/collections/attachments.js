import Attachment from 'core/src/models/attachment';

const AttachmentsCollection = Backbone.Collection.extend({
  model: Attachment,

  comparator: function(model) {
    return parseInt(model.get('rank'), 10);
  },

  initialize: function(models, options) {
    this.session = options.session;
  },

  updateAttachmentWithResponse: function(response) {
    const model = _.first(this.where(_.pick(response, 'title')));
    if (model) {
      model.set(response);
    }
    return this;
  },

  deleteWhere: function(attrs) {
    const models = this.where(attrs);
    if (models) {
      this.remove(models);
      _.each(models, function(m) {
        m.trigger('destroy');
      });
    }
    return this;
  },
});

export default AttachmentsCollection;

