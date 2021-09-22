import SessionsCollection from 'core/src/collections/sessions';
import Completion from 'core/src/models/completion';
import CreatorBaseModel from 'core/src/models/creator-base-model';

const UnitModel = CreatorBaseModel.extend({

  constructor: function(attributes, options) {
    this.parentClass = options.collection.parentClass;
    this.lectures = this.sessions = new SessionsCollection(null, {
      parentClass: this.parentClass,
      unit: this,
    });

    this.completion = new Completion();

    Backbone.Model.apply(this, arguments);
  },

  defaults: {
    destroyable: true,
  },

  initialize: function() {
    // store our cid as model attr for temporary server persistance
    this.set('cid', this.cid);

    this.on('request', function(model, xhr, options) {
      this.sessions.each(function(session) {
        session.trigger('request', session, xhr, options);
      });
    });

    this.on('destroy', function() {
      this.sessions.each(function(session) {
        session.trigger('destroy', session);
      });
    });

    CreatorBaseModel.prototype.initialize.apply(this, arguments);
  },

  parse: function(resp) {
    const response = _.clone(resp);

    response.rank = parseInt(response.rank, 10);
    response.sessions = this.convertCids(response.sessions);

    this.sessions.set(response.sessions, { parse: true });
    delete response.sessions;

    // Always ensure the completion model is set with defauls for this unit
    this.completion.set({
      target_type: 'Unit',
      target_id: response.id,
      parent_id: response.parent_id,
    });
    // Update the completion model with the unit completion data
    if (!_.isUndefined(response.unitCompletion)) {
      this.completion.set(response.unitCompletion, { parse: true });
      this.completion.set({ completed: true });
    }

    return response;
  },

  toJSON: function() {
    const response = _.omit(this.attributes, 'destroyable');
    response.sessions = this.sessions.toJSON();
    return response;
  },

  // update sessions with the newly returned session id
  // n.b.: this step isn't necessary in BB 0.9.10,
  // since `existing` and `get` have been refactored
  convertCids: function(sessions) {

    return _.map(sessions, function(sessionAttrs) {

      // set the session's id based on its response cid. we have to
      // do this because id has higher precidence than cid in `Collection#update`.
      let session = this.sessions.get(sessionAttrs.id);
      if (!session) {
        session = this.sessions.get(sessionAttrs.cid);
      }
      if (session) {
        session.set(session.parse(sessionAttrs));
      }

      return session || sessionAttrs;
    }, this);
  },

  toggleDestroyable: function(destroyable) {
    this.set('destroyable', destroyable);
  },
});

export default UnitModel;

