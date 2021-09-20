/* eslint-disable
    eqeqeq,
    no-prototype-builtins,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { getModelConstructor } = require('./getModelConstructor');
const { ModelName } = require('./ModelName');
const { ApiError } = require('app/scripts/network/api-error');
const Backbone = require('@trello/backbone');
const Promise = require('bluebird');
const { isShortLink } = require('@trello/shortlinks');
const _ = require('underscore');
const f = require('effing');
const { client, syncDeltaToCache } = require('@trello/graphql');

const collections = {
  Action: {
    type: ModelName.ACTION,
    test: f.eq('actions'),
  },
  Highlights: {
    type: ModelName.ACTION,
    test: f.eq('highlights'),
  },
  UpNext: {
    type: ModelName.ACTION,
    test: f.eq('upnext'),
  },
  Card: {
    type: ModelName.CARD,
    test(s) {
      return /^card($|s)/.test(s);
    },
  },
  Checklist: {
    type: ModelName.CHECKLIST,
    test: f.eq('checklists'),
  },
  CustomField: {
    type: ModelName.CUSTOM_FIELD,
    test: f.eq('customFields'),
  },
  CustomFieldItem: {
    type: ModelName.CUSTOM_FIELD_ITEM,
    test: f.eq('customFieldItems'),
  },
  Board: {
    type: ModelName.BOARD,
    test(s) {
      return /^board($|s)/.test(s) && !['boardsCount'].includes(s);
    },
  },
  BoardPlugin: {
    type: ModelName.BOARD_PLUGIN,
    test: f.eq('boardPlugins'),
  },
  Collaborator: {
    type: ModelName.MEMBER,
    test: f.eq('collaborators'),
    shouldPreserve: true,
  },
  Enterprise: {
    type: ModelName.ENTERPRISE,
    shouldPreserve: true,
    test(s) {
      return /^enterprise($|s)/.test(s);
    },
  },
  Label: {
    type: ModelName.LABEL,
    test: f.eq('labels'),
  },
  List: {
    type: ModelName.LIST,
    test(s) {
      return /^lists?$/.test(s);
    },
  },
  PendingOrganization: {
    type: ModelName.PENDING_ORGANIZATION,
    test(s) {
      return /^pendingOrganization/.test(s);
    },
  },
  Member: {
    type: ModelName.MEMBER,
    test(s) {
      return (
        /^member/.test(s) &&
        ![
          'memberships',
          'memberType',
          'membershipCount',
          'membershipCounts',
          'memberEmail',
        ].includes(s)
      );
    },
  },
  Notification: {
    type: ModelName.NOTIFICATION,
    test: f.eq('notifications'),
    shouldPreserve: true,
  },
  NotificationGroup: {
    type: ModelName.NOTIFICATION_GROUP,
    test: f.eq('notificationGroup'),
  },
  Organization: {
    type: ModelName.ORGANIZATION,
    test(s) {
      return /^organization/.test(s) && !['organizationPrefs'].includes(s);
    },
  },
  Plugin: {
    type: ModelName.PLUGIN,
    test(s) {
      return /^plugins?$/.test(s);
    },
  },
  PluginData: {
    type: ModelName.PLUGIN_DATA,
    test: f.eq('pluginData'),
  },
  Reaction: {
    type: ModelName.REACTION,
    test: f.eq('reactions'),
  },
};

class ModelCache {
  static initClass() {
    this.prototype._collectionSpec = _.memoize(function (key) {
      for (const name in collections) {
        const { test, shouldPreserve } = collections[name];
        if (test(key)) {
          return { name, shouldPreserve };
        }
      }
    });
  }
  constructor() {
    this._cache = {};
    this._locked = [];
    this._lockIndex = 0;
    this._deltaQueue = [];
    this.uniqueId = _.uniqueId('mc');

    for (const typeName in collections) {
      this._cache[typeName] = {};
    }
  }

  isValidType(typeName) {
    return collections.hasOwnProperty(typeName);
  }

  allTypes() {
    return Object.keys(collections);
  }

  get(typeOrTypeName, idOrIds) {
    if (
      typeof idOrIds === 'string' &&
      idOrIds.length === 24 &&
      this._cache[typeOrTypeName]
    ) {
      return this._cache[typeOrTypeName][idOrIds];
    } else if (_.isArray(idOrIds)) {
      return idOrIds.map(f(this, 'get', typeOrTypeName));
    } else {
      if (!_.isString(typeOrTypeName)) {
        typeOrTypeName = typeOrTypeName.prototype.typeName;
      }
      if (isShortLink(idOrIds)) {
        return this.findOne(typeOrTypeName, 'shortLink', idOrIds);
      } else {
        return this._cache[typeOrTypeName] != null
          ? this._cache[typeOrTypeName][idOrIds]
          : undefined;
      }
    }
  }

  getOrLoad({ type, id, payload, loader }) {
    const existing = this.get(type, id);
    const hasRequiredFields =
      existing != null &&
      payload.query.fields
        .split(',')
        .every((field) => existing.attributes.hasOwnProperty(field));

    if (hasRequiredFields) {
      return existing;
    } else {
      return loader(id).catch(ApiError, () => null);
    }
  }

  find(modelType, ...args) {
    if (args.length === 1) {
      const [predicate] = Array.from(args);
      return _.filter(this.all(modelType), predicate);
    } else {
      const [attr, value] = Array.from(args);
      return this.find(modelType, (entry) => entry.get(attr) === value);
    }
  }

  findOne(modelType, predicateOrAttr, value) {
    const predicate =
      typeof predicateOrAttr === 'function'
        ? predicateOrAttr
        : (model) => model.get(predicateOrAttr) === value;

    const cache = this._cache[modelType];
    for (const id in cache) {
      const model = cache[id];
      if (predicate(model)) {
        return model;
      }
    }

    return undefined;
  }

  some(...args) {
    return this.findOne(...args) !== undefined;
  }

  waitFor(modelType, id, next) {
    const model = this.get(modelType, id);
    if (model != null) {
      return next(null, model);
    } else {
      // We can wait for the model to show up
      return this.once(`add:${modelType}:${id}`, () => {
        return this.waitFor(modelType, id, next);
      });
    }
  }

  all(typeOrTypeName) {
    if (!_.isString(typeOrTypeName)) {
      typeOrTypeName = typeOrTypeName.prototype.typeName;
    }
    return _.values(this._cache[typeOrTypeName]);
  }

  add(model, param) {
    // Do nothing if the model is already in the model cache
    if (param == null) {
      param = {};
    }
    const { source } = param;
    if (model.id && this.get(model.typeName, model.id) != null) {
      return;
    }

    // Do nothing if we aren't caching this kind of model
    if (collections[model.typeName] == null) {
      return;
    }

    const hashId = model.id ? model.id : model.cid;
    this._cache[model.typeName][hashId] = model;

    // I don't know why this is here. It was here before.
    // I can't see how it does anything. I'm scared to take
    // it out. But we should eventually.
    this.stopListening(model);

    this.listenTo(model, 'change', this.onModelChange);
    this.listenTo(model, 'destroy', this.remove);

    // Send model add events after we've hooked up our own listeners, in case
    // something changes a model in reaction to it being added (e.g. auto
    // marking notifications as read if you're looking at a card)
    this.waitForId(model, (id) => {
      delete this._cache[model.typeName][model.cid];
      this._cache[model.typeName][id] = model;
      if (source != null) {
        this.trigger(`${source}:add:${model.typeName}`, model);
      } else {
        // Sync new models to the Apollo Cache once they have an id
        syncDeltaToCache(client, model.typeName, model.toJSON());
      }

      this.trigger(`add:${model.typeName}:${id}`, model);
      return typeof model.triggerCacheEvents === 'function'
        ? model.triggerCacheEvents(this, 'add', model)
        : undefined;
    });

    this.trigger(`add:${model.typeName}`, model);
  }

  onModelChange(model, param) {
    if (param == null) {
      param = {};
    }
    const { source } = param;
    if (typeof model.triggerCacheEvents === 'function') {
      model.triggerCacheEvents(this, 'change', model);
    }
    this.trigger(`change:${model.typeName}`, model);
    if (source != null) {
      this.trigger(`${source}:change:${model.typeName}`, model);
    }
    const object = model.changedAttributes();
    for (const attr in object) {
      this.trigger(`change:${model.typeName}:${attr}`, model);
    }
  }

  remove(model, param) {
    if (param == null) {
      param = {};
    }
    const { source } = param;
    if (model == null) {
      return;
    }

    if (model.typeName === ModelName.CARD) {
      for (const action of Array.from(model.actionList.models)) {
        this.remove(action, { source });
      }
    }

    delete this._cache[model.typeName][model.id];
    delete this._cache[model.typeName][model.cid];

    this.trigger(`remove:${model.typeName}`, model);
    if (source != null) {
      this.trigger(`${source}:remove:${model.typeName}`, model);
    }
    if (model.id != null) {
      this.trigger(`remove:${model.typeName}:${model.id}`, model);
    }
    if (typeof model.triggerCacheEvents === 'function') {
      model.triggerCacheEvents(this, 'remove', model);
    }
    this.stopListening(model);
    model.trigger('destroy');
    return model.destructor();
  }

  /*
  Take the response to an API call, and add to (or update) our cache
  The response to an API call might look like this:

  {
    name: "Some board"
    desc: "Some desc"
    cards: [
      { name: "Card 1" }
      { name: "Card 2" }
    ]
    actions: [ ... ]
  }

  model can be either the type of a model (e.g. Board) or an actual model
  (the second case is important if you know that the data is meant to
  update a model that was created, but doesn't have an id yet)
  */
  _update(modelOrType, data, mappingRules, { source }) {
    let key, fn, delta;
    if (mappingRules == null) {
      mappingRules = {};
    }
    if (_.isArray(data)) {
      return data.map((delta) => {
        return this._update(modelOrType, delta, mappingRules, { source });
      });
    } else if (data.deleted) {
      this.remove(this.get(modelOrType, data.id), { source });
      return;
    }

    const setData = _.clone(data);

    const mappers = (() => {
      const result = [];
      for (key in mappingRules) {
        fn = mappingRules[key];
        if (key in setData) {
          delta = setData[key];
          delete setData[key];
          result.push(f(fn, delta));
        }
      }
      return result;
    })();

    for (key in data) {
      const spec = this._collectionSpec(key);
      const value = data[key];
      if (spec != null) {
        this._update(spec.name, value, mappingRules, { source });
        if (!spec.shouldPreserve) {
          delete setData[key];
        }
      }
    }

    // At this point, we should have only model attributes left; we need to
    // either create a new model, or update an existing one

    const existingModel = _.isString(modelOrType)
      ? this.get(modelOrType, data.id)
      : modelOrType;

    if (existingModel != null) {
      this.unmarkModel(existingModel);
      if (existingModel.get('dateLastUpdated') && setData.dateLastUpdated) {
        // There is a race condition between updates being applied based on
        // websocket deltas, API responses and local optimistic updates.
        // This is intended to, on models that support it, only apply _newer_
        // updates to the model, and discard any update deltas with stale data.
        //
        // +-------------------------------------------------------+
        // |                                                       |
        // |      Client                                   Server  |
        // |                                                       |
        // |                                                 +     |
        // |  1. Change +----------------------------------> |     |
        // |            ^----------------------------------+ ++    |
        // |                         200 OK                  ||    |
        // |  2. Change +----------------------------------> ||    |
        // |            ^----------------------------------+ ||    |
        // |                         200 OK                  ||    |
        // |            <-------------------------------------+    |
        // |                      Websocket Delta            |     |
        // |                                                 |     |
        // |  3. Change +----------------------------------> |     |
        // |            ^----------------------------------+ |     |
        // |                  412 Precondition Failed        |     |
        // |                                                 |     |
        // |                                                 +     |
        // |                                                       |
        // +-------------------------------------------------------+
        //
        // The above diagram shows the websocket delta for the 1st change being
        // applied to the local model cache state, when the model cache already
        // contains more up-to-date information (2nd change). This condition
        // discards the updates from the websocket delta shown above, and
        // allows the 3rd change to successfully complete, instead of failing
        // the update.
        if (existingModel.get('dateLastUpdated') > setData.dateLastUpdated) {
          return existingModel;
        }
      }
      existingModel.set(setData);
      mappers.forEach((fn) => fn(existingModel));
      return existingModel;
    }

    const typeInfo = collections[modelOrType];
    if (!typeInfo) {
      return data;
    }

    // The TrelloModel constructor adds itself to the cache for us
    const newModel = new (getModelConstructor(typeInfo.type))(setData, {
      modelCache: this,
      source,
    });
    mappers.forEach((fn) => fn(newModel));
    return newModel;
  }

  lock(msg) {
    const lockIndex = this._lockIndex++;
    this._locked.push(lockIndex);
    return lockIndex;
  }

  locked() {
    return !_.isEmpty(this._locked);
  }

  unlock(lockIndex) {
    if (Array.from(this._locked).includes(lockIndex)) {
      this._locked = _.without(this._locked, lockIndex);
      if (!this.locked()) {
        // If anything was waiting on the lock, process it now
        this.processDeltas();
      }
      return true;
    } else {
      return false;
    }
  }

  getLock() {
    return Promise.resolve(this.lock()).disposer((index) => this.unlock(index));
  }

  _enqueueDelta(source, modelOrType, delta, mappingRules, queryParams, next) {
    if (mappingRules == null) {
      mappingRules = {};
    }
    if (queryParams == null) {
      queryParams = {};
    }
    if (next == null) {
      next = function () {};
    }
    if (_.isFunction(mappingRules)) {
      next = mappingRules;
      mappingRules = {};
    }

    const modelName = _.isString(modelOrType)
      ? modelOrType
      : modelOrType.typeName;

    if (Array.isArray(delta)) {
      delta.forEach((deltaItem) =>
        syncDeltaToCache(client, modelName, deltaItem, queryParams),
      );
    } else {
      syncDeltaToCache(client, modelName, delta, queryParams);
    }

    if (this.locked()) {
      this._deltaQueue.push({ modelOrType, delta, mappingRules, source, next });
    } else {
      next(null, this._update(modelOrType, delta, mappingRules, { source }));
    }
  }

  enqueueRpcDelta(modelOrType, delta) {
    this._enqueueDelta('rpc', modelOrType, delta);
  }

  enqueueDelta(modelOrType, delta, mappingRules, queryParams, next) {
    if (mappingRules == null) {
      mappingRules = {};
    }
    if (queryParams == null) {
      queryParams = {};
    }
    if (next == null) {
      next = function () {};
    }
    this._enqueueDelta(
      'ajax',
      modelOrType,
      delta,
      mappingRules,
      queryParams,
      next,
    );
  }

  processDeltas() {
    let delta, mappingRules, modelOrType, next, source;
    const queue = this._deltaQueue;
    this._deltaQueue = [];

    // First, see if we've got any updates that are for models, where the id wasn't
    // set; these always need to go first (to prevent duplicate models being created
    // in cases where we couldn't find the existing model because the id wasn't set
    // yet)
    const updateSetsId = (modelOrType) =>
      !_.isString(modelOrType) && modelOrType.id == null;

    for ({ modelOrType, delta, mappingRules, source, next } of Array.from(
      queue,
    )) {
      if (updateSetsId(modelOrType)) {
        next(null, this._update(modelOrType, delta, mappingRules, { source }));
      }
    }

    // Now, do the rest of the updates, in the order that they came in
    return (() => {
      const result = [];
      for ({ modelOrType, delta, mappingRules, source, next } of Array.from(
        queue,
      )) {
        if (!updateSetsId(modelOrType)) {
          result.push(
            next(
              null,
              this._update(modelOrType, delta, mappingRules, { source }),
            ),
          );
        }
      }
      return result;
    })();
  }

  markModel(model, marker) {
    return (model._marked = marker);
  }

  unmarkModel(model) {
    return delete model._marked;
  }

  isMarked(model, marker) {
    return model._marked === marker;
  }

  forEachModel(fn) {
    for (const typeName in this._cache) {
      for (const id in this._cache[typeName]) {
        const model = this._cache[typeName][id];
        fn(model);
      }
    }
  }

  // Used as part of ModelLoader.replay; mark all the existing models so we
  // know to remove them if we don't get them again as part of reloading all of
  // the data
  mark() {
    const marker = _.uniqueId('mark');

    this.forEachModel((model) => {
      return this.markModel(model, marker);
    });

    return marker;
  }

  // Remove any models that were marked, and haven't had their marker removed
  sweep(marker) {
    this.forEachModel((model) => {
      if (this.isMarked(model, marker)) {
        return this.remove(model);
      }
    });
  }
}
ModelCache.initClass();

_.extend(ModelCache.prototype, Backbone.Events);

module.exports.ModelCache = window.ModelCache = new ModelCache();
