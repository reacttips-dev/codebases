import UnitsCollection from 'core/src/collections/units';
import TagCollection from 'core/src/collections/tags';
import ChildClass from 'core/src/models/child-class';
import CreatorBaseModel from 'core/src/models/creator-base-model';
import AttachmentsCollection from 'core/src/collections/attachments';

const ParentClassModel = CreatorBaseModel.extend({

  urlRoot: '/listings',

  // not a backbone attr; facilitates determining if model is dirty
  lastServerState: null,

  // store relations as instance variables
  units: null,
  currentClass: null,
  dontOverWriteModels: 0,
  constructor: function(attributes) {
    // the instance variables need to be set up before `parse` is called
    // in the constructor
    this.units = new UnitsCollection(null, { parentClass: this });
    this.attachments = new AttachmentsCollection([], { parentClass: this });

    if (attributes.parentClass) {
      this.tags = new TagCollection(attributes.parentClass.tags);
    } else {
      this.tags = new TagCollection(attributes.tags);
    }
    // Set up a reference to the current class for this parent class,
    // This is in case the parent class model has one, which is not always the case
    // If it does have one, we'll populate it in parse below
    this.currentClass = new ChildClass(null, { parentClass: this });

    Backbone.Model.prototype.constructor.apply(this, arguments);
  },

  initialize: function() {
    const _this = this;

    // Store initial bootstrap state for "dirty" checking. We have to
    // wait until the current stack clears before checking state, because
    // we update the model on page creation (after this model has been created)
    _.defer(function() {
      _this.lastServerState = _this.toJSON();
    });

    // store the last sever sync state for "dirty" checking
    this.on('sync', function() {
      this.lastServerState = this.toJSON();
    });

    this.on('request', function(model, xhr, options) {
      this.units.each(function(unit) {
        unit.trigger('request', unit, xhr, options);
      });
    });

    CreatorBaseModel.prototype.initialize.apply(this, arguments);
  },

  // ParentClass can have errors on 'syllabus' and 'units', these errors
  // need to be delegated to the units collection, so they can be handled
  // by the syllabus view
  onErrorChange: function(model, value, options) {
    if (value.syllabus || value.units) {
      this.units.trigger('invalid', model, { syllabus: value.syllabus }, options);
      delete value.syllabus;
    } else {
      this.units.trigger('valid', model, { syllabus: value.syllabus }, options);
    }

    this.trigger('invalid', model, value, options);
    CreatorBaseModel.prototype.onErrorChange.apply(this, arguments);
  },

  // determines if the model tree has changed since last server sync state
  treeHasChanged: function() {
    return !_.isEqual(this.toJSON(), this.lastServerState);
  },

  revertToLastSyncState: function() {
    this.set(this.parse(this.lastServerState));
  },

  isPublished: function() {
    return this.get('status_id') === '1' || this.get('status_id') === 1;
  },

  isDraft: function() {
    return this.get('status_id') === '2' || this.get('status_id') === 2;
  },

  isPendingReview: function() {
    return this.get('status_id') === '3' || this.get('status_id') === 3;
  },

  isMembershipClass: function() {
    return this.get('enrollment_type') === '1' || this.get('enrollment_type') === '2';
  },

  getPreviewUrl: function(sessionId) {
    let title = this.get('title') || 'untitled-class';

    // Kill extra spaces and replace them with dashes
    title = title.trim().replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');

    if (this.get('sku')) {
      let url = '/' + title + '/' + this.get('sku');
      if (sessionId) {
        url += '?videoId=' + sessionId;
      }
      return url;
    }

    return '#';
  },

  parse: function(resp) {
    // don sync if wanted
    if (this.dontOverWriteModels > 0) {
      this.dontOverWriteModels--;
      this.setSessionIds(resp.parentClass);
      // only update the errors
      this.set('errors', resp.parentClass.errors);
      return;
    }

    const response = _.clone(resp);
    // Parse the current (child) class if one exists as part of our parentClass
    if (!_.isUndefined(response.currentClass)) {
      this.currentClass.set(this.currentClass.parse(response.currentClass));
      delete response.currentClass;
    }

    const parentClass = _.isUndefined(response.parentClass) ? response : response.parentClass;

    // we have to ensure the id is properly set for these models before Backbone continues
    // with `update` so it can determine the model exists (id has a higher precidence than cid)
    // this is fixed in Backbone 0.9.10.
    parentClass.units = this.convertCids(parentClass.units);

    // update the nested units and models with response data
    this.units.set(parentClass.units, { parse: true });
    delete response.units;

    this.attachments.set(parentClass.attachments, { parse: true });
    delete parentClass.attachments;


    // we only want the response to contain the parentClass attributes, hence
    // previous deletions
    return parentClass;
  },

  // Loop through the session data from the sync response and update the
  // local sessions with any returned ids. This prevents duplication
  // errors on subsequent save, where the backend can't tell that these
  // sessions have already been saved to the database
  setSessionIds: function(parentClass) {
    const _this = this;
    if (parentClass.units) {
      _.each(parentClass.units, function(unit) {
        _.each(unit.sessions, function(session) {
          if (session.id && session.cid) {
            const sessionModel = _this.findSessionByCid(session.cid);
            sessionModel.set('id', session.id);
          }
        });
      });
    }
  },

  findSessionByCid: function(cid) {
    let session;
    this.units.each(function(unit) {
      const result = unit.sessions.get({ cid: cid });
      if (result) {
        session = result;
      }
    });
    return session;
  },

  // in reverse, when syncing to the server, copy the instance properties
  // back to the response object JSON
  toJSON: function(options) {
    const attrs = _.clone(this.attributes);

    // the individual models are responsible for their own JSON serialization response
    attrs.units = this.units.toJSON(options);
    attrs.attachments = this.attachments.toJSON(options);

    attrs.tags = this.tags.toJSON(options);

    // finally, return the full nested attributes as the response object
    return {
      parentClass: attrs,
      currentClass: this.currentClass.toJSON(options),
    };
  },

  // We override the portion of Backbone.sync that determines the data
  // to be sent, so as to include the action param. Note that this
  // snippet is pulled directly out of Backbone.sync
  sync: function(method, model, options) {
    if (_.isUndefined(options.data) && model && (method === 'create' || method === 'update' || method === 'patch')) {
      options.contentType = 'application/json';
      const data = (options.attrs || model.toJSON(options));

      // Actually include the action
      data.action = options.action || 'save';

      // Stringify the data
      options.data = JSON.stringify(data);
    }
    return Backbone.sync.apply(this, arguments);
  },

  deleteDraft: function(success) {
    const postData = {
      YII_CSRF_TOKEN: $.cookie('YII_CSRF_TOKEN'),
      sku: this.get('sku'),
    };
      // Submit ajax
    $.ajax({
      type: 'POST',
      url: '/listings/deletedraft',
      data: postData,
      success: success,
    });
  },

  // n.b.: this step isn't necessary in BB 0.9.10, since `existing`
  // and `get` have been refactored
  convertCids: function(units) {

    return _.map(units, function(unitAttrs) {

      // set the unit's id based on its response cid. we have to do
      // this because id has higher precidence than cid in `Collection#update`.
      const unit = this.units.get(unitAttrs.cid);
      if (unit) {unit.set(unit.parse(unitAttrs));}

      return unit || unitAttrs;
    }, this);

  },
});

export default ParentClassModel;
