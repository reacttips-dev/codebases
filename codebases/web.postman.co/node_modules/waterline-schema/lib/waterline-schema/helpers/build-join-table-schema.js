//  ██████╗ ██╗   ██╗██╗██╗     ██████╗          ██╗ ██████╗ ██╗███╗   ██╗
//  ██╔══██╗██║   ██║██║██║     ██╔══██╗         ██║██╔═══██╗██║████╗  ██║
//  ██████╔╝██║   ██║██║██║     ██║  ██║         ██║██║   ██║██║██╔██╗ ██║
//  ██╔══██╗██║   ██║██║██║     ██║  ██║    ██   ██║██║   ██║██║██║╚██╗██║
//  ██████╔╝╚██████╔╝██║███████╗██████╔╝    ╚█████╔╝╚██████╔╝██║██║ ╚████║
//  ╚═════╝  ╚═════╝ ╚═╝╚══════╝╚═════╝      ╚════╝  ╚═════╝ ╚═╝╚═╝  ╚═══╝
//
//  ████████╗ █████╗ ██████╗ ██╗     ███████╗    ███████╗ ██████╗██╗  ██╗███████╗███╗   ███╗ █████╗
//  ╚══██╔══╝██╔══██╗██╔══██╗██║     ██╔════╝    ██╔════╝██╔════╝██║  ██║██╔════╝████╗ ████║██╔══██╗
//     ██║   ███████║██████╔╝██║     █████╗      ███████╗██║     ███████║█████╗  ██╔████╔██║███████║
//     ██║   ██╔══██║██╔══██╗██║     ██╔══╝      ╚════██║██║     ██╔══██║██╔══╝  ██║╚██╔╝██║██╔══██║
//     ██║   ██║  ██║██████╔╝███████╗███████╗    ███████║╚██████╗██║  ██║███████╗██║ ╚═╝ ██║██║  ██║
//     ╚═╝   ╚═╝  ╚═╝╚═════╝ ╚══════╝╚══════╝    ╚══════╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝
//

var _ = require('@sailshq/lodash');


module.exports = function buildJoinTableSchema(tableDef, schema, modelDefaults) {
  var c1 = tableDef.columnOne;
  var c2 = tableDef.columnTwo;

  // Build a default table name for the collection
  var identity = (function buildIdentity() {
    // Sort the two sides of the assocation so that we always get a consistent join table identity.
    var cols = [c1, c2].sort(function sortAssociations(a, b) {
      // If the two sides refer to the same collection, sort by attribute name.
      if (a.collection === b.collection) {
        return (a.attribute > b.attribute) ? 1 : -1;
      }
      // Otherwise sort by collection name.
      return (a.collection > b.collection) ? 1 : -1;
    });
    return cols[0].collection + '_' + cols[0].attribute + '__' + cols[1].collection + '_' + cols[1].attribute;
  })();


  //  ╔═╗╦╔╗╔╔╦╗  ┌┬┐┌─┐┌┬┐┬┌┐┌┌─┐┌┐┌┌┬┐
  //  ╠╣ ║║║║ ║║   │││ ││││││││├─┤│││ │
  //  ╚  ╩╝╚╝═╩╝  ─┴┘└─┘┴ ┴┴┘└┘┴ ┴┘└┘ ┴
  //  ┌─┐┌─┐┬  ┬  ┌─┐┌─┐┌┬┐┬┌─┐┌┐┌
  //  │  │ ││  │  ├┤ │   │ ││ ││││
  //  └─┘└─┘┴─┘┴─┘└─┘└─┘ ┴ ┴└─┘┘└┘
  // If a dominant side of a many-to-many was defined then use that as the source
  // for connection and metadata details. Otherwise use the C1 collection.
  var dominantCollection;
  var nonDominantCollection;

  // Check if the C2 collection defines the dominant side
  var cTwoSchema = schema[c2.collection].schema;
  if (_.has(cTwoSchema[c2.attribute], 'dominant')) {
    dominantCollection = c2.collection;
    nonDominantCollection = c1.collection;
  } else {
    dominantCollection = c1.collection;
    nonDominantCollection = c2.collection;
  }

  // Append the meta data if defined.
  // To do this, merge the two collection meta objects together with the dominant
  // side taking precedence.
  var metaData = _.merge({}, (schema[nonDominantCollection].meta || {}), (schema[dominantCollection].meta || {}));


  //  ╔╗ ╦ ╦╦╦  ╔╦╗  ┌─┐┌─┐┬ ┬┌─┐┌┬┐┌─┐  ┬┌┬┐┌─┐┌┬┐
  //  ╠╩╗║ ║║║   ║║  └─┐│  ├─┤├┤ │││├─┤  │ │ ├┤ │││
  //  ╚═╝╚═╝╩╩═╝═╩╝  └─┘└─┘┴ ┴└─┘┴ ┴┴ ┴  ┴ ┴ └─┘┴ ┴
  var table = {
    identity: identity.toLowerCase(),
    tableName: identity,
    tables: [c1.collection, c2.collection],
    joinedAttributes: [],
    junctionTable: true,
    meta: metaData,
    datastore: schema[dominantCollection].datastore,
    primaryKey: 'id',
    attributes: {
      id: {
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        // FUTURE: Make this configurable (could pass in an option to wl-schema.
        // In the context of a sails app, maybe pull that option from top level
        // model settings in `sails.config.models`)
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        type: 'number',
        columnName: 'id',
        required: false,
        autoMigrations: {
          columnType: 'integer', // « this too
          unique: true,
          autoIncrement: true
        }
      }
    }
  };

  // Merge in primary key attribute from model defaults, if there are any.
  _.merge(table.attributes.id, _.get(modelDefaults, 'attributes.' + (_.get(modelDefaults, 'primaryKey') || 'id')));

  // Build the two foreign key attributes
  var cOnePrimaryKey = schema[c1.collection].primaryKey;
  var cTwoPrimaryKey = schema[c2.collection].primaryKey;


  // Foreign Key Collection One
  table.attributes[c1.collection + '_' + c1.attribute] = {
    columnName: c1.collection + '_' + c1.attribute,
    type: schema[c1.collection].schema[cOnePrimaryKey].type,
    foreignKey: true,
    model: c1.collection,
    references: schema[c1.collection].tableName,
    referenceIdentity: c1.collection,
    on: schema[c1.collection].schema[cOnePrimaryKey].columnName,
    onKey: schema[c1.collection].schema[cOnePrimaryKey].columnName,
    groupKey: c1.collection,
    required: true,
    autoMigrations: {}
  };

  // Foreign Key Collection Two
  table.attributes[c2.collection + '_' + c2.attribute] = {
    columnName: c2.collection + '_' + c2.attribute,
    type: schema[c2.collection].schema[cTwoPrimaryKey].type,
    foreignKey: true,
    model: c2.collection,
    references: schema[c2.collection].tableName,
    referenceIdentity: c2.collection,
    on: schema[c2.collection].schema[cTwoPrimaryKey].columnName,
    onKey: schema[c2.collection].schema[cTwoPrimaryKey].columnName,
    groupKey: c2.collection,
    required: true,
    autoMigrations: {}
  };

  // Handle auto-migrations if needed
  var cOnePrimaryKeyDef = schema[c1.collection].schema[cOnePrimaryKey];
  var cTwoPrimaryKeyDef = schema[c2.collection].schema[cTwoPrimaryKey];
  if (_.has(cOnePrimaryKeyDef, 'autoMigrations')) {
    var cOneColumnType = cOnePrimaryKeyDef.autoMigrations.columnType;
    table.attributes[c1.collection + '_' + c1.attribute].autoMigrations.columnType = cOneColumnType;
  }

  if (_.has(cTwoPrimaryKeyDef, 'autoMigrations')) {
    var cTwoColumnType = cTwoPrimaryKeyDef.autoMigrations.columnType;
    table.attributes[c2.collection + '_' + c2.attribute].autoMigrations.columnType = cTwoColumnType;
  }

  table.joinedAttributes.push(c1.collection + '_' + c1.attribute);
  table.joinedAttributes.push(c2.collection + '_' + c2.attribute);

  return table;
};
