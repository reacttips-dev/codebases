import { createEvent } from '../model-event';
import getIndices from '../waterline-helpers/get-indices';
import getAutoUpdatedAtKeys from '../waterline-helpers/get-auto-updated-at';
import { isCriteriaDangerous } from '../waterline-helpers/criteria';

const EVENT_CREATE = 'create',
      EVENT_CREATE_EACH = 'createEach',
      EVENT_UPDATE = 'update',
      EVENT_DELETE = 'delete',
      EVENT_CLEAR = 'clear';

let indicesCache = new Map(),
    autoUpdatedKeysCache = new Map();

/**
 * Returns the autoUpdatedAt keys for a model. Caches the results as well.
 *
 * @param {any} Model
 * @param {any} modelName
 * @param {Map} cache
 */
function getAutoUpdatedAtKeysFor (Model, modelName, cache) {
  // cache hit
  if (cache.has(modelName)) {
    return cache.get(modelName);
  }

  // cache miss

  // compute
  let autoUpdatedAtKeys = getAutoUpdatedAtKeys(Model);

  // cache store
  cache.set(modelName, autoUpdatedAtKeys);

  // return
  return autoUpdatedAtKeys;
}

/**
 * Computes the indices for a waterline model definition. Caches the results as well.
 *
 * @param {any} Model
 * @param {any} modelName
 * @param {Map} cache
 */
function getIndicesFor (Model, modelName, cache) {
  // cache hit
  if (cache.has(modelName)) {
    return cache.get(modelName);
  }

  // cache miss

  // compute
  let indices = getIndices(Model);

  // cache store
  cache.set(modelName, indices);

  // return
  return indices;
}

let ModelService = {
  /**
   * used to clear the cache maintained
   */
  _clearIndicesCache () {
    indicesCache.clear();
  },

  /**
   * Resolves with the waterline Model for this service.
   *
   * @returns {Promise<WaterlineModel>}
   */
  getModel (modelName) {
    if (!modelName) {
      return Promise.reject(new Error('Could not get waterline model. Missing model name.'));
    }

    if (!pm || !pm.models) {
      return Promise.reject(new Error(`Could not get waterline model for ${modelName}. ORM not initialized.`));
    }

    let model = pm.models[modelName];

    if (!model) {
      return Promise.reject(new Error(`Could not get waterline model for ${modelName}. Model not defined.`));
    }

    return Promise.resolve(model);
  },


  /**
   * Returns the number of records matching the criteria.
   *
   * @param {String} modelName
   * @param {Object} criteria
   */
  count (modelName, criteria) {
    if (!criteria) {
      return Promise.reject(new Error('ModelService: Missing criteria'));
    }

    return this
      .getModel(modelName)
      .then((Model) => {
        return Model.count(criteria);
      });

  },

  /**
   * Fetches a list of entities with a given criteria.
   *
   * @param {String} modelName
   * @param {Object} criteria
   */
  find (modelName, criteria) {
    if (!criteria) {
      return Promise.reject(new Error('ModelService~find: Missing criteria'));
    }

    return this
      .getModel(modelName)
      .then(function (Model) {
        return Model.find(criteria);
      });
  },

  /**
   * Fetches an entity.
   *
   * @param {String} modelName
   * @param {Object} criteria
   */
  findOne (modelName, criteria) {
    if (!criteria) {
      return Promise.reject(new Error('ModelService~findOne: Missing criteria'));
    }

    return this
      .getModel(modelName)
      .then(function (Model) {
        return Model.findOne(criteria);
      });
  },

  /**
   * Performs a deep create with the given definition. Create also attaches the newly created item to a parent.
   *
   * @param {String} modelName
   * @param {Object} definition
   *
   * @returns {Promise}
   */
  create (modelName, definition) {
    if (!definition) {
      return Promise.reject(new Error('Missing definition for create'));
    }

    let createAction = createEvent(EVENT_CREATE, modelName, definition);

    return this.commitEvents([createAction]).then(([completedAction]) => { return completedAction; });
  },

  /**
   * Creates the list of items given in the definition
   *
   * @param {String} modelName
   * @param {Object} definition
   *
   * @returns {Promise}
   */
  createEach (modelName, definition) {
    if (!definition) {
      return Promise.reject(new Error('Missing definition for createEach'));
    }

    let createEachAction = createEvent(EVENT_CREATE_EACH, modelName, definition);

    return this.commitEvents([createEachAction]).then(([completedAction]) => { return completedAction; });
  },

  /**
   * Performs a shallow update on a Collection entity.
   *
   * @param {String} modelName
   * @param {Object} definition
   *
   * @returns {Promise}
   */
  update (modelName, definition) {
    if (!definition) {
      return Promise.reject(new Error('Missing definition for update'));
    }

    let updateAction = createEvent(EVENT_UPDATE, modelName, definition);

    return this.commitEvents([updateAction]).then(([completedAction]) => { return completedAction; });
  },

  /**
   * Performs a shallow update on a Collection entity.
   *
   * @param {String} modelName
   * @param {Object} definition
   *
   * @returns {Promise}
   */
  delete (modelName, definition) {
    if (!definition) {
      return Promise.reject(new Error('Missing definition for delete'));
    }

    let deleteAction = createEvent(EVENT_DELETE, modelName, definition);

    return this.commitEvents([deleteAction]);
  },

  /**
   * Clears all items in the table for the given model.
   *
   * There's no going back, use this only when you know what you're doing.
   *
   * @param {String} modelName
   */
  clear (modelName) {
    let clearEvent = createEvent(EVENT_CLEAR, modelName);

    return this.commitEvents([clearEvent]).then(([completedAction]) => { return completedAction; });
  },

  /**
   * Persists a set of model events on DB.
   *
   * @param {ModelEvent.[]} events
   *
   * @returns {Promise}
   */
  commitEvents (events) {
    let eventExecutions = _.map(events, (event) => {
      let { namespace, name, data } = event;

      if (!name || !namespace) {
        return Promise.reject(new Error('Invalid event format'));
      }

      return this
        .getModel(namespace)
        .then((Model) => {
          // Delegate Instruction names to ORM Models.
          switch (name) {
            case 'create': {
              return Model
                .create(data)
                .meta({ fetch: true })
                .then((createdModel) => {
                  return createEvent('created', namespace, createdModel);
                });
            }

            case 'createEach': {
              return Model
                .createEach(data)
                .meta({ fetch: true })
                .then((createdModels) => {
                  let subEvents = _.map(createdModels, (createdModel) => {
                    return createEvent('created', namespace, createdModel);
                  });

                  return createEvent('createdEach', namespace, null, subEvents);
                });
            }

            case 'update': {
              let primaryKey = Model.primaryKey,
                  indices = getIndicesFor(Model, namespace, indicesCache),
                  updateCriteria;

              // if update definition has primary key, update through primary key
              if (data[primaryKey]) {
                updateCriteria = { [primaryKey]: data[primaryKey] };

                // We remove the primary key from the data to be updated as it is not actually one of
                // the keys that needs to be updated. If this is passed as part of data, the adapter
                // assumes that we are updating the primary key and enters the flow where it destroys
                // and recreates the entry instead of just updating it.
                delete data[primaryKey];
              }

              // otherwise find using index
              else {
                updateCriteria = _.pick(data, indices);
              }

              // make sure the criteria is not empty
              if (isCriteriaDangerous(updateCriteria)) {
                return Promise.reject(new Error(`Could not apply update on ${namespace}. ` +
                  'Criteria is empty and will update every record in the table.'));
              }

              return Model
                .update(updateCriteria, data)
                .fetch()
                .then(([updatedModel]) => {
                  // @todo:: Return an array of updated events here, instead of swallowing
                  // all except the first update
                  if (!updatedModel) {
                    return;
                  }

                  // extract all updated keys other than primarykey
                  let autoUpdatedAtKeys = getAutoUpdatedAtKeysFor(Model, namespace, autoUpdatedKeysCache),
                      updatedKeys = _.chain(data).omit([primaryKey]).keys().concat(autoUpdatedAtKeys).uniq().value();

                  // attach the updated keys to event meta, some consumers might be interested in what keys got updated
                  return createEvent('updated', namespace, updatedModel, null, { updatedKeys });
                });
            }

            case 'delete': {
              let primaryKey = Model.primaryKey,
                  indices = getIndicesFor(Model, namespace, indicesCache),
                  deleteCriteria;

              // if delete definition has primary key, delete through primary key
              if (data[primaryKey]) {
                deleteCriteria = { [primaryKey]: data[primaryKey] };
              }

              // otherwise find using index
              else {
                deleteCriteria = _.pick(data, indices);
              }

              // make sure the criteria is not empty
              if (isCriteriaDangerous(deleteCriteria)) {
                return Promise.reject(new Error(`Could not apply delete on ${namespace}. ` +
                  'Criteria is empty and will delete every record in the table.'));
              }

              return Model
                .destroy(deleteCriteria)
                .meta({ fetch: true })
                .then((deletedModels) => {
                  return _.map(deletedModels, (deletedModel) => {
                    return createEvent('deleted', namespace, deletedModel);
                  });
                });
            }

            case 'clear': {
              return Model
                .destroy({})
                .then(() => {
                  return createEvent('cleared', namespace);
                });
            }

            default: {
              return Promise.reject(new Error(`Could not find a handler for the name ${name}`));
            }
          }
        });
    });

    return Promise
      .all(eventExecutions)
      .then((successEvents) => {
        return _.flatten(successEvents);
      });
  },

  /**
   * Persists a set of model events on DB.
   *
   * @param {ModelEvent.[]} events
   *
   * @returns {Promise}
   */
  commitWriteEventsBulk (events) {
    const createEvents = _.filter(events, (event) => (event.name === 'create' || event.name === 'createEach')),
      updateEvents = _.filter(events, (event) => event.name === 'update');

    const eventIdsOrder = _.map(events, (event) => _.get(event, 'data.id')),
      createEventsByNamespace = _.groupBy(createEvents, 'namespace'),
      eventExecutions = _.map(createEventsByNamespace, (events, namespace) => {
        const records = events.map((event) => event.data);

        return this
          .getModel(namespace)
          .then((Model) => {
            return Model
              .createEach(records)
              .meta({ fetch: true })
              .then((createdModels) => {
                return _.flatten(createdModels.map((createdModel) => {
                  return createEvent('created', namespace, createdModel);
                }));
              });
          });
      });

    return Promise
      .all(eventExecutions)
      .then(async (successEvents) => {
        const updatedEvents = await this.commitEvents(updateEvents);

        return {
          created: successEvents,
          updated: updatedEvents
        };
      })
      .then((events) => {
        const createdSuccessEvents = events.created,
          updatedSuccessEvents = events.updated,
          flattenedSuccessEvents = _.flatten(createdSuccessEvents),
          allEvents = _.concat(flattenedSuccessEvents, updatedSuccessEvents),

          // Return the success events in the same order as the input events
          sortedEvents = _.map(eventIdsOrder, (id) => {
            return _.find(allEvents, (event) => _.get(event, 'data.id') === id);
          });

        return sortedEvents;
      });
  },

  /**
   * Create or update the given definition
   *
   * @param {String} modelName
   * @param {Object} definition
   *
   */
  createOrUpdate (modelName, definition) {
    if (!modelName) {
      return Promise.reject(new Error('Missing model name.'));
    }
    return this.getModel(modelName).then((Model) => {
      let primaryKey = Model.primaryKey;
      return this.count(modelName, { [primaryKey]: definition[primaryKey] }).then((count) => {
        if (!count) {
          return this.create(modelName, definition);
        }
        return this.update(modelName, definition);
      });
    });
  }
};

export default ModelService;
