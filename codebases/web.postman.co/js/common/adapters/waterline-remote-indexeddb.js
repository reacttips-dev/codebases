/**
 * Module dependencies
 */

var _ = require('lodash'),

    // dexie.default = dexie;
    // see https://github.com/dfahlander/Dexie.js/blob/e956de3b74cf3ac5f1ed2fa2b97b53e4fe60a3e1/src/classes/dexie/dexie-static-props.ts#L222
    // we do this because some bundlers load the es module version of dexie
    // which makes require('dexie') return a compat for es module of dexie
    Dexie = require('dexie').default,
    dexieCollectionForQuery = require('./utils/dexie-query').dexieCollectionForQuery;

/**
 * Build dexie schema for a waterline definitions
 *
 * @param {any} model
 * @returns
 */
function getModelSchema (model) {
  let modelDefs = model.definition,
      primaryKey = model.primaryKey;

  let indexedAttributes = _.filter(_.values(modelDefs), (def) => {
    return _.get(def, 'meta.index');
  });

  let dexieIndices = _.map(indexedAttributes, (attribute) => {
    let columnName = attribute.columnName;

    if (_.get(attribute, 'meta.unique')) {
      return ('&' + columnName);
    }
    else {
      return (columnName);
    }
  });

  return _.chain([primaryKey])
          .concat(dexieIndices)
          .join(',')
          .value();
}

/**
 * Construct entire
 *
 * @param {any} models
 * @returns
 */
function getSchemaDefinition (models) {
  let schemaDef = {};
  _.forEach(models, (model) => {
    schemaDef[model.tableName] = getModelSchema(model);
  });

  return schemaDef;
}

module.exports = (function adapterIdb () {

  // Private var to track of all the datastores that use this adapter.  In order for your adapter
  // to support advanced features like transactions and native queries, you'll need
  // to expose this var publicly as well.  See the `registerDatastore` method for more info.
  //
  var datastores = {};


  // delegate to master adapter
  var delegateToMaster = function (datastore, method, params, cb) {
    var requestId = Math.random();

    datastore.pendingCbs.set(requestId, cb);

    datastore.config.send({
      type: 'request',
      id: requestId,
      method: method,
      data: params
    });

    return;
  };

  // The main adapter object.
  var adapter = {

    // The identity of this adapter, to be referenced by datastore configurations in a Sails app.
    identity: 'waterline-remote-indexeddb',

    // Waterline Adapter API Version
    adapterApiVersion: 1,

    // Default configuration for connections
    defaults: { schema: false },

    //  ╔═╗═╗ ╦╔═╗╔═╗╔═╗╔═╗  ┌─┐┬─┐┬┬  ┬┌─┐┌┬┐┌─┐
    //  ║╣ ╔╩╦╝╠═╝║ ║╚═╗║╣   ├─┘├┬┘│└┐┌┘├─┤ │ ├┤
    //  ╚═╝╩ ╚═╩  ╚═╝╚═╝╚═╝  ┴  ┴└─┴ └┘ ┴ ┴ ┴ └─┘
    //  ┌┬┐┌─┐┌┬┐┌─┐┌─┐┌┬┐┌─┐┬─┐┌─┐┌─┐
    //   ││├─┤ │ ├─┤└─┐ │ │ │├┬┘├┤ └─┐
    //  ─┴┘┴ ┴ ┴ ┴ ┴└─┘ ┴ └─┘┴└─└─┘└─┘
    // This allows outside access to the datastores, for use in advanced ORM methods like `.runTransaction()`.
    datastores: datastores,

    //  ╦═╗╔═╗╔═╗╦╔═╗╔╦╗╔═╗╦═╗  ┌┬┐┌─┐┌┬┐┌─┐┌─┐┌┬┐┌─┐┬─┐┌─┐
    //  ╠╦╝║╣ ║ ╦║╚═╗ ║ ║╣ ╠╦╝   ││├─┤ │ ├─┤└─┐ │ │ │├┬┘├┤
    //  ╩╚═╚═╝╚═╝╩╚═╝ ╩ ╚═╝╩╚═  ─┴┘┴ ┴ ┴ ┴ ┴└─┘ ┴ └─┘┴└─└─┘
    /**
     * Register a new datastore with this adapter.  This often involves creating a new connection
     * to the underlying database layer (e.g. MySQL, mongo, or a local file).
     *
     * Waterline calls this method once for every datastore that is configured to use this adapter.
     * This method is optional but strongly recommended.
     *
     * @param  {Dictionary}   datastoreConfig  Dictionary of configuration options for this datastore (e.g. host, port, etc.)
     * @param  {Dictionary}   models           Dictionary of model schemas using this datastore.
     * @param  {Function}     cb               Callback after successfully registering the datastore.
     */

    registerDatastore: function registerDatastore (datastoreConfig, models, cb) {

      // Get the unique identity for this datastore.
      var identity = datastoreConfig.identity;
      if (!identity) {
        return cb(new Error('Invalid datastore config. A datastore should contain a unique identity property.'));
      }

      // Validate that the datastore isn't already initialized
      if (datastores[identity]) {
        throw new Error('Datastore `' + identity + '` is already registered.');
      }

      // Create a new datastore dictionary.
      var datastore = {
        config: datastoreConfig,

        // hold dexie instance
        db: {},

        // We'll keep track of the primary keys of each model in this datastore in this dictionary,
        // indexed by table name..
        primaryKeyCols: {},

        pendingCbs: new Map()
      };

      // attach listeners
      datastoreConfig.listen(function (data) {
        var type = data.type,
            id = data.id,
            method = data.method,
            args = data.data;

        if (datastore.config.master && type === 'request') {
          args.push(function () {
            datastore.config.send({
              type: 'response',
              id: id,
              method: method,
              data: Array.from(arguments)
            });
          });

          adapter[method].apply(adapter, args);
          return;
        }

        if (!datastore.config.master && type === 'response') {
          cb = datastore.pendingCbs.get(id);
          if (cb) {
            cb.apply(null, args);
            datastore.pendingCbs.delete(id);
          }
        }
      });

      // Add the datastore to the `datastores` dictionary.
      datastores[identity] = datastore;

      // skip loading databases for slaves
      if (!datastoreConfig.master) {
        return cb();
      }

      // Create a new NeDB instance for each model (an NeDB instance is like one MongoDB collection),
      // and load the instance from disk.  The `loadDatabase` NeDB method is asynchronous, hence the async.each.

      if (!datastoreConfig.database) {
        throw new Error('database key should be set in datastore config');
      }

      // validate primaryKey definition
      _.each(_.keys(models), function (modelIdentity) {
        // Get the model definition.
        var modelDef = models[modelIdentity];

        var primaryKeyAttr = modelDef.definition[modelDef.primaryKey];

        // Ensure that the model's primary key is `required`
        if (primaryKeyAttr.required !== true) {
            throw new Error('In model `' + modelIdentity + '`, primary key `' + modelDef.primaryKey + '` must have `required` set.');
        }

        // Get the model's primary key column.
        var primaryKeyCol = modelDef.definition[modelDef.primaryKey].columnName;

        // Store the primary key column in the datastore's primary key columns hash.
        datastore.primaryKeyCols[modelDef.tableName] = primaryKeyCol;
      });

      // call cb on success
      var db = new Dexie(datastoreConfig.database);

      datastore.db = db;

      db.version(datastoreConfig.version).stores(getSchemaDefinition(models));

      cb && cb();
    },

    //  ╔╦╗╔═╗╔═╗╦═╗╔╦╗╔═╗╦ ╦╔╗╔  ┌─┐┌─┐┌┐┌┌┐┌┌─┐┌─┐┌┬┐┬┌─┐┌┐┌
    //   ║ ║╣ ╠═╣╠╦╝ ║║║ ║║║║║║║  │  │ │││││││├┤ │   │ ││ ││││
    //   ╩ ╚═╝╩ ╩╩╚══╩╝╚═╝╚╩╝╝╚╝  └─┘└─┘┘└┘┘└┘└─┘└─┘ ┴ ┴└─┘┘└┘
    /**
     * Fired when a datastore is unregistered, typically when the server
     * is killed. Useful for tearing-down remaining open connections,
     * etc.
     *
     * @param  {String} identity  (optional) The datastore to teardown.  If not provided, all datastores will be torn down.
     * @param  {Function} cb     Callback
     */
    teardown: function (identity, cb) {

      var datastoreIdentities = [];

      // If no specific identity was sent, teardown all the datastores
      if (!identity || identity === null) {
        datastoreIdentities = datastoreIdentities.concat(_.keys(datastores));
      } else {
        datastoreIdentities.push(identity);
      }

      // Teardown each datastore
      _.each(datastoreIdentities, function teardownDatastore (datastoreIdentity) {

        // close connection
        var datastore = datastores[datastoreIdentity],
            db = datastore.db;

        db.isOpen() && db.close();

        // Remove the datastore entry.
        delete datastores[datastoreIdentity];
      });

      return cb();

    },


    //  ██████╗  ██████╗ ██╗
    //  ██╔══██╗██╔═══██╗██║
    //  ██║  ██║██║   ██║██║
    //  ██║  ██║██║▄▄ ██║██║
    //  ██████╔╝╚██████╔╝███████╗
    //  ╚═════╝  ╚══▀▀═╝ ╚══════╝
    //
    // Methods related to manipulating data stored in the database.


    //  ╔═╗╦═╗╔═╗╔═╗╔╦╗╔═╗  ┬─┐┌─┐┌─┐┌─┐┬─┐┌┬┐
    //  ║  ╠╦╝║╣ ╠═╣ ║ ║╣   ├┬┘├┤ │  │ │├┬┘ ││
    //  ╚═╝╩╚═╚═╝╩ ╩ ╩ ╚═╝  ┴└─└─┘└─┘└─┘┴└──┴┘
    /**
     * Add a new row to the table
     * @param  {String}       datastoreName The name of the datastore to perform the query on.
     * @param  {Dictionary}   query         The stage-3 query to perform.
     * @param  {Function}     cb            Callback
     */
    create: function create (datastoreName, query, cb) {

      // Get a reference to the datastore.
      var datastore = datastores[datastoreName];

      // delegate to master if this adapter is a slave
      if (!datastore.config.master) {
        return delegateToMaster(datastore, 'create', [datastoreName, query], cb);
      }

      // Get the dexie instance
      var db = datastore.db;

      // insert record
      db[query.using]
        .add(query.newRecord)
        .then(function () {
          _.get(query, 'meta.fetch') ? cb(null, query.newRecord) : cb(null);
        })
        .catch(function (e) { cb(e); });
    },


    //  ╔═╗╦═╗╔═╗╔═╗╔╦╗╔═╗  ╔═╗╔═╗╔═╗╦ ╦  ┬─┐┌─┐┌─┐┌─┐┬─┐┌┬┐
    //  ║  ╠╦╝║╣ ╠═╣ ║ ║╣   ║╣ ╠═╣║  ╠═╣  ├┬┘├┤ │  │ │├┬┘ ││
    //  ╚═╝╩╚═╚═╝╩ ╩ ╩ ╚═╝  ╚═╝╩ ╩╚═╝╩ ╩  ┴└─└─┘└─┘└─┘┴└──┴┘
    /**
     * Add multiple new rows to the table
     * @param  {String}       datastoreName The name of the datastore to perform the query on.
     * @param  {Dictionary}   query         The stage-3 query to perform.
     * @param  {Function}     cb            Callback
     */
    createEach: function createEach (datastoreName, query, cb) {

      // Get a reference to the datastore.
      var datastore = datastores[datastoreName];


      // delegate to master if this adapter is a slave
      if (!datastore.config.master) {
        return delegateToMaster(datastore, 'createEach', [datastoreName, query], cb);
      }

      // Get the dexie instance
      var db = datastore.db;

      // Insert record
      db[query.using]
        .bulkAdd(query.newRecords)
        .then(function () {
          _.get(query, 'meta.fetch') ? cb(null, query.newRecords) : cb(null);
        })
        .catch(function (e) { cb(e); });
    },


    //  ╔═╗╔═╗╦  ╔═╗╔═╗╔╦╗  ┌─┐ ┬ ┬┌─┐┬─┐┬ ┬
    //  ╚═╗║╣ ║  ║╣ ║   ║   │─┼┐│ │├┤ ├┬┘└┬┘
    //  ╚═╝╚═╝╩═╝╚═╝╚═╝ ╩   └─┘└└─┘└─┘┴└─ ┴
    /**
     * Select Query Logic
     * @param  {String}       datastoreName The name of the datastore to perform
     *                                      the query on.
     * @param  {Dictionary}   query         The stage-3 query to perform.
     * @param  {Function}     cb            Callback
     */
    find: function find (datastoreName, query, cb) {

      // Get a reference to the datastore.
      var datastore = datastores[datastoreName];


      // delegate to master if this adapter is a slave
      if (!datastore.config.master) {
        return delegateToMaster(datastore, 'find', [datastoreName, query], cb);
      }

      var dexieCollection = dexieCollectionForQuery(query, datastore.db),
          records = [];

      dexieCollection
        .each(function (record) {
          records.push(record);
        })
        .then(function () { cb(null, records); })
        .catch(function (e) { cb(e); });
    },


    //  ╦ ╦╔═╗╔╦╗╔═╗╔╦╗╔═╗  ┌─┐ ┬ ┬┌─┐┬─┐┬ ┬
    //  ║ ║╠═╝ ║║╠═╣ ║ ║╣   │─┼┐│ │├┤ ├┬┘└┬┘
    //  ╚═╝╩  ═╩╝╩ ╩ ╩ ╚═╝  └─┘└└─┘└─┘┴└─ ┴
    /**
     * Update one or more models in the table
     * @param  {String}       datastoreName The name of the datastore to perform the query on.
     * @param  {Dictionary}   query         The stage-3 query to perform.
     * @param  {Function}     cb            Callback
     */
    update: function update (datastoreName, query, cb) {

      // Get a reference to the datastore.
      var datastore = datastores[datastoreName];

      // delegate to master if this adapter is a slave
      if (!datastore.config.master) {
        return delegateToMaster(datastore, 'update', [datastoreName, query], cb);
      }

      var dexieCollection = dexieCollectionForQuery(query, datastore.db);

      dexieCollection
        .modify(query.valuesToSet)
        .then(function () {
          if (_.get(query, 'meta.fetch')) {
            // IndexedDB does not return the records that was updated, so find the records
            return adapter.find(datastoreName, query, cb);
          }

          return cb(null);
        })
        .catch(function (e) { cb(e); });
    },


    //  ╔╦╗╔═╗╔═╗╔╦╗╦═╗╔═╗╦ ╦  ┌─┐ ┬ ┬┌─┐┬─┐┬ ┬
    //   ║║║╣ ╚═╗ ║ ╠╦╝║ ║╚╦╝  │─┼┐│ │├┤ ├┬┘└┬┘
    //  ═╩╝╚═╝╚═╝ ╩ ╩╚═╚═╝ ╩   └─┘└└─┘└─┘┴└─ ┴
    /**
     * Delete one or more records in a table
     * @param  {String}       datastoreName The name of the datastore to perform the query on.
     * @param  {Dictionary}   query         The stage-3 query to perform.
     * @param  {Function}     cb            Callback
     */
    destroy: function destroy (datastoreName, query, cb) {

      // Get a reference to the datastore.
      var datastore = datastores[datastoreName];

      // delegate to master if this adapter is a slave
      if (!datastore.config.master) {
        return delegateToMaster(datastore, 'destroy', [datastoreName, query], cb);
      }

      // Get the dexie instance
      var db = datastore.db,
          primaryKeys = datastore.primaryKeyCols,
          idsToDelete,
          primaryKey = primaryKeys[query.using];

      // We find the records first according to the criteria and then we get the
      // array of ids to be deleted. We need the actual records as we need to
      // return the list of records deleted if the query has 'meta.fetch' set as true
      adapter.find(datastoreName, query, function (err, records) {
        if (err) {
          return cb(err);
        }

        // Getting the ids of the records to be deleted
        idsToDelete = _.map(records, primaryKey);

        db[query.using].bulkDelete(idsToDelete)
          .then(function () {
            _.get(query, 'meta.fetch')
              ? cb(null, records)
              : cb(null);
          })
          .catch(function (e) { cb(e); });
      });
    },

    //  ╔═╗╔═╗╦ ╦╔╗╔╔╦╗  ┌─┐ ┬ ┬┌─┐┬─┐┬ ┬
    //  ║  ║ ║║ ║║║║ ║   │─┼┐│ │├┤ ├┬┘└┬┘
    //  ╚═╝╚═╝╚═╝╝╚╝ ╩   └─┘└└─┘└─┘┴└─ ┴
    /**
     * Return the number of matching records.
     * @param  {String}       datastoreName The name of the datastore to perform the query on.
     * @param  {Dictionary}   query         The stage-3 query to perform.
     * @param  {Function}     cb            Callback
     */
    count: function count (datastoreName, query, cb) {

      // Get a reference to the datastore.
      var datastore = datastores[datastoreName];

      // delegate to master if this adapter is a slave
      if (!datastore.config.master) {
        return delegateToMaster(datastore, 'count', [datastoreName, query], cb);
      }

      var dexieCollection = dexieCollectionForQuery(query, datastore.db);

      dexieCollection
        .count()
        .then(function (recordCount) { cb(null, recordCount); })
        .catch(function (e) { cb(e); });
    },

    //  ╔╦╗╦═╗╔═╗╔═╗  ┌┬┐┌─┐┌┐ ┬  ┌─┐
    //   ║║╠╦╝║ ║╠═╝   │ ├─┤├┴┐│  ├┤
    //  ═╩╝╩╚═╚═╝╩     ┴ ┴ ┴└─┘┴─┘└─┘
    /**
     * Remove a table from the database.
     *
     * @param  {String}       datastoreName The name of the datastore containing the table to create.
     * @param  {String}       tableName     The name of the table to create.
     * @param  {undefined}    relations     Currently unused
     * @param  {Function}     cb            Callback
     */
    drop: function drop (datastoreName, tableName, relations, cb) {
      // Get a reference to the datastore.
      var datastore = datastores[datastoreName];

      if (!datastore) { return cb(new Error('Unrecognized datastore: `' + datastoreName + '`,  It doesn\'t seem to have been registered with this adapter (waterline-nedb).')); }

      // delegate to master if this adapter is a slave
      if (!datastore.config.master) {
        return delegateToMaster(datastore, 'drop', [datastoreName, tableName, relations], cb);
      }

      // remove the reference to the nedb for the collection.
      var db = datastore.db,
          dexieTable = db[tableName];

      dexieTable
        .clear()
        .then(function (recordCount) { cb(null, recordCount); })
        .catch(function (e) { cb(e); });
    }
  };

  // Expose adapter definition
  return adapter;

})();
