import Completion from 'core/src/models/completion';
import CreatorBaseModel from 'core/src/models/creator-base-model';
import AttachmentsCollection from 'core/src/collections/attachments';

const SessionModel = CreatorBaseModel.extend({
  constructor: function() {
    this.attachments = new AttachmentsCollection([], {
      session: this,
    });

    this.completion = new Completion();

    Backbone.Model.prototype.constructor.apply(this, arguments);
  },

  initialize: function(attributes, options = {}) {
    this.parentClass = options.parentClass || options.collection.parentClass;

    this.set('cid', this.cid);

    // keep a flag to decide between 'add session' vs 'edit session' copy
    if (!this.id) {
      this.set('isNew', true);
    }

    CreatorBaseModel.prototype.initialize.apply(this, arguments);
  },

  getPreviewUrl() {
    return this.parentClass.getPreviewUrl(this.id);
  },

  parse: function(resp) {
    const response = _.clone(resp);

    response.rank = parseInt(response.rank, 10);

    // Always ensure the completion model is set with defaults for this session
    this.completion.set({
      target_type: 'Session',
      target_id: response.id,
      parent_id: response.parent_id,
    });
    // Update the completion model with the unit completion data
    if (!_.isUndefined(response.sessionCompletion)) {
      this.completion.set(response.sessionCompletion, { parse: true });
      this.completion.set({ completed: true });
    }
    // Set an index on the session so we can pick it up in the template
    response.index = (parseInt(response.rank, 10) + 1).toString();

    response.attachments = this.convertCids(response.attachments);

    this.attachments.set(response.attachments, { parse: true });
    delete response.attachments;

    return response;
  },


  // update attachments with the newly returned id
  // n.b.: this step isn't necessary in BB 0.9.10,
  // since `existing` and `get` have been refactored
  convertCids: function(attachments) {

    return _.map(attachments, function(attrs) {

      // set the session's id based on its response cid. we have to
      // do this because id has higher precidence than cid in `Collection#update`.
      const attachment = this.attachments.get(attrs.id || attrs.cid);
      if (attachment) {attachment.set(attachment.parse(attrs));}

      return attachment || attrs;
    }, this);
  },

  filterCompletions: function(completions) {
    const _this = this;
    _.each(completions, function(completion) {
      if (_this.get('id') === completion.target_id
          && completion.target_type === 'Session') {
        _this.updateCompletion(completion);
      }
    });
  },

  // Can be called externally from this model
  // E.g. By completing a Unit
  updateCompletion: function(completion) {
    this.completion.set(completion);
    // Remember to handle completed state
    if (!_.isUndefined(completion.id)) {
      this.completion.set('completed', true);
    }
  },

  toJSON: function() {
    const response = _.clone(this.attributes);
    response.attachments = this.attachments.toJSON();
    return response;
  },
});

export default SessionModel;

