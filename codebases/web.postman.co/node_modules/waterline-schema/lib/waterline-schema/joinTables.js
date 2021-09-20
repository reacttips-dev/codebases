//  ██████╗ ██╗   ██╗██╗██╗     ██████╗
//  ██╔══██╗██║   ██║██║██║     ██╔══██╗
//  ██████╔╝██║   ██║██║██║     ██║  ██║
//  ██╔══██╗██║   ██║██║██║     ██║  ██║
//  ██████╔╝╚██████╔╝██║███████╗██████╔╝
//  ╚═════╝  ╚═════╝ ╚═╝╚══════╝╚═════╝
//
//       ██╗ ██████╗ ██╗███╗   ██╗    ████████╗ █████╗ ██████╗ ██╗     ███████╗███████╗
//       ██║██╔═══██╗██║████╗  ██║    ╚══██╔══╝██╔══██╗██╔══██╗██║     ██╔════╝██╔════╝
//       ██║██║   ██║██║██╔██╗ ██║       ██║   ███████║██████╔╝██║     █████╗  ███████╗
//  ██   ██║██║   ██║██║██║╚██╗██║       ██║   ██╔══██║██╔══██╗██║     ██╔══╝  ╚════██║
//  ╚█████╔╝╚██████╔╝██║██║ ╚████║       ██║   ██║  ██║██████╔╝███████╗███████╗███████║
//   ╚════╝  ╚═════╝ ╚═╝╚═╝  ╚═══╝       ╚═╝   ╚═╝  ╚═╝╚═════╝ ╚══════╝╚══════╝╚══════╝
//
// Insert Join Tables where needed whenever two collections
// point to each other. Also replaces the references to point to the new join table.

var _ = require('@sailshq/lodash');
var flaverr = require('flaverr');
var buildJoinTableSchema = require('./helpers/build-join-table-schema');
var flagThroughTable = require('./helpers/flag-through-table');
var linkCollectionAttributes = require('./helpers/link-collection-attributes');

module.exports = function buildJoinTables(schema, modelDefaults) {
  // Validate that collections exists and is an array
  if (_.isUndefined(schema) || !_.isPlainObject(schema)) {
    throw new Error('Invalid schema argument to foreign key mapper.');
  }

  // Hold a reference to any join tables that span multiple collections
  var joinTables = [];

  // Process each collection in the schema
  _.each(schema, function parseCollectionAttributes(collection, collectionName) {
    //  ╦  ╔═╗╔═╗╦╔═  ┌─┐┌─┐┬─┐  ┌─┐┌─┐┬  ┬  ┌─┐┌─┐┌┬┐┬┌─┐┌┐┌
    //  ║  ║ ║║ ║╠╩╗  ├┤ │ │├┬┘  │  │ ││  │  ├┤ │   │ ││ ││││
    //  ╩═╝╚═╝╚═╝╩ ╩  └  └─┘┴└─  └─┘└─┘┴─┘┴─┘└─┘└─┘ ┴ ┴└─┘┘└┘
    //  ┌─┐┌┬┐┌┬┐┬─┐┬┌┐ ┬ ┬┌┬┐┌─┐┌─┐
    //  ├─┤ │  │ ├┬┘│├┴┐│ │ │ ├┤ └─┐
    //  ┴ ┴ ┴  ┴ ┴└─┴└─┘└─┘ ┴ └─┘└─┘
    _.each(collection.schema, function parseAttributes(attributeVal, attributeName) {
      // Only attributes with a collection attribute are used here
      if (!_.has(attributeVal, 'collection')) {
        return;
      }

      // Check if this is a hasManyThrough attribute, if so a join table
      // doesn't need to be created.
      if (_.has(attributeVal, 'through')) {
        return;
      }

      // Find the model being referenced by the attribute
      var relatedModelName = attributeVal.collection;
      var relatedModel = schema[relatedModelName];
      if (!relatedModel) {
        throw flaverr({ name: 'userError' }, new Error('The collection association defined for attribute `' + attributeName + '` on the `' + collection.identity + '` model points to a model that doesn\'t exist.'));
      }

      // If a `via` is used, be sure that the attribute it's pointing to actually
      // exists on the other model.
      if (_.has(attributeVal, 'via')) {
        if (!relatedModel.schema[attributeVal.via]) {
          throw flaverr({ name: 'userError' }, new Error('The collection association defined for attribute `' + attributeName + '` on the `' + collection.identity + '` model points to an attribute using `via` on the `' + relatedModel.identity + '` model that doesn\'t exist.'));
        }
        // Check if it's a foreign key. If so this is a one-to-many relationship and no join table is needed.
        if (_.has(relatedModel.schema[attributeVal.via], 'foreignKey')) {
          return;
        }
        // Otherwise check that it points back to this model.
        if (!relatedModel.schema[attributeVal.via].collection || relatedModel.schema[attributeVal.via].collection !== collectionName) {
          throw flaverr({ name: 'userError' }, new Error('The collection association defined for attribute `' + attributeName + '` on the `' + collection.identity + '` model points to an attribute using `via` on the `' + relatedModel.identity + '` model that doesn\'t point back to `' + relatedModel.identity + '`.'));
        }
      }

      // If no via is specified, a name needs to be created for the other column
      // in the join table. Use the attribute key and the associated collection name
      // which will be unique.
      if (!_.has(attributeVal, 'via')) {
        attributeVal.via = attributeName + '_' + relatedModelName;
      }

      // Build up an object that can be used to build a join table
      var tableAttributes = {
        // This represents the current collection
        columnOne: {
          collection: collection.identity,
          attribute: attributeName,
          via: attributeVal.via
        },

        // This represents the related collection
        columnTwo: {
          collection: relatedModelName,
          attribute: attributeVal.via,
          via: attributeName
        }
      };

      // Build a schema for the join table
      var joinTableSchema = buildJoinTableSchema(tableAttributes, schema, modelDefaults);

      // Map the reference on the attribute
      collection.schema[attributeName] = {
        collection: attributeVal.collection,
        references: joinTableSchema.tableName,
        referenceIdentity: joinTableSchema.identity,
        on: joinTableSchema.attributes[collection.identity + '_' + attributeName].columnName,
        onKey: joinTableSchema.attributes[collection.identity + '_' + attributeName].columnName
      };


      //  ╔═╗╔╗╔╔═╗╦ ╦╦═╗╔═╗  ┌┐┌┌─┐  ┌┬┐┬ ┬┌─┐┬  ┬┌─┐┌─┐┌┬┐┌─┐
      //  ║╣ ║║║╚═╗║ ║╠╦╝║╣   ││││ │   │││ │├─┘│  ││  ├─┤ │ ├┤
      //  ╚═╝╝╚╝╚═╝╚═╝╩╚═╚═╝  ┘└┘└─┘  ─┴┘└─┘┴  ┴─┘┴└─┘┴ ┴ ┴ └─┘
      //   ┬┌─┐┬┌┐┌  ┌┬┐┌─┐┌┐ ┬  ┌─┐┌─┐
      //   ││ │││││   │ ├─┤├┴┐│  ├┤ └─┐
      //  └┘└─┘┴┘└┘   ┴ ┴ ┴└─┘┴─┘└─┘└─┘
      // Create a flag to remove or add the item from the array
      var add = true;

      // Check if any tables are already joining these attributes together
      _.each(joinTables, function searchJoinTables(table) {
        if (_.indexOf(table.joinedAttributes, _.first(joinTableSchema.joinedAttributes)) < 0) {
          return;
        }

        if (_.indexOf(table.joinedAttributes, _.last(joinTableSchema.joinedAttributes)) < 0) {
          return;
        }

        // Set the add flag to false
        add = false;
      });

      // Add the table if needed
      if (add) {
        joinTables.push(joinTableSchema);
      }

      // Ensure two tables with the same identity doen't accidentally get put in
      joinTables = _.uniq(joinTables, 'identity');
    }); // </ .each(schema)


    //  ╔═╗═╗ ╦╔═╗╔═╗╔╗╔╔╦╗  ┌─┐┌┐┌┬ ┬  ┌┬┐┬ ┬┬─┐┌─┐┬ ┬┌─┐┬ ┬
    //  ║╣ ╔╩╦╝╠═╝╠═╣║║║ ║║  ├─┤│││└┬┘   │ ├─┤├┬┘│ ││ ││ ┬├─┤
    //  ╚═╝╩ ╚═╩  ╩ ╩╝╚╝═╩╝  ┴ ┴┘└┘ ┴    ┴ ┴ ┴┴└─└─┘└─┘└─┘┴ ┴
    //  ┌─┐┌─┐┌─┐┌─┐┌─┐┬┌─┐┌┬┐┬┌─┐┌┐┌┌─┐
    //  ├─┤└─┐└─┐│ ││  │├─┤ │ ││ ││││└─┐
    //  ┴ ┴└─┘└─┘└─┘└─┘┴┴ ┴ ┴ ┴└─┘┘└┘└─┘
    flagThroughTable(collectionName, schema);
  }); // </ .each(collections)


  //  ╦  ╦╔╗╔╦╔═  ┌─┐┌─┐┬  ┬  ┌─┐┌─┐┌┬┐┬┌─┐┌┐┌  ┌─┐┌┬┐┌┬┐┬─┐┬┌┐ ┬ ┬┌┬┐┌─┐┌─┐
  //  ║  ║║║║╠╩╗  │  │ ││  │  ├┤ │   │ ││ ││││  ├─┤ │  │ ├┬┘│├┴┐│ │ │ ├┤ └─┐
  //  ╩═╝╩╝╚╝╩ ╩  └─┘└─┘┴─┘┴─┘└─┘└─┘ ┴ ┴└─┘┘└┘  ┴ ┴ ┴  ┴ ┴└─┴└─┘└─┘ ┴ └─┘└─┘
  linkCollectionAttributes(schema, joinTables);


  //  ╔═╗╔╦╗╔╦╗  ┌─┐┌─┐┬  ┬  ┌─┐┌─┐┌┬┐┬┌─┐┌┐┌  ┌┬┐┌─┐
  //  ╠═╣ ║║ ║║  │  │ ││  │  ├┤ │   │ ││ ││││   │ │ │
  //  ╩ ╩═╩╝═╩╝  └─┘└─┘┴─┘┴─┘└─┘└─┘ ┴ ┴└─┘┘└┘   ┴ └─┘
  //  ┌─┐┌─┐┌─┐┬ ┬┌─┐
  //  │  ├─┤│  ├─┤├┤
  //  └─┘┴ ┴└─┘┴ ┴└─┘
  // Add the join tables to the schema cache
  _.each(joinTables, function buildTable(table) {
    schema[table.identity] = {
      primaryKey: table.primaryKey,
      hasSchema: true,
      identity: table.identity,
      tableName: table.tableName,
      datastore: table.datastore,
      junctionTable: true,
      attributes: _.merge({}, table.attributes),
      schema: _.merge({}, table.attributes),
      meta: table.meta || {}
    };
  });
};
