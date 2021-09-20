//  ███╗   ███╗ █████╗ ██████╗     ███████╗ ██████╗ ██████╗ ███████╗██╗ ██████╗ ███╗   ██╗
//  ████╗ ████║██╔══██╗██╔══██╗    ██╔════╝██╔═══██╗██╔══██╗██╔════╝██║██╔════╝ ████╗  ██║
//  ██╔████╔██║███████║██████╔╝    █████╗  ██║   ██║██████╔╝█████╗  ██║██║  ███╗██╔██╗ ██║
//  ██║╚██╔╝██║██╔══██║██╔═══╝     ██╔══╝  ██║   ██║██╔══██╗██╔══╝  ██║██║   ██║██║╚██╗██║
//  ██║ ╚═╝ ██║██║  ██║██║         ██║     ╚██████╔╝██║  ██║███████╗██║╚██████╔╝██║ ╚████║
//  ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝         ╚═╝      ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝
//
//  ██╗  ██╗███████╗██╗   ██╗███████╗
//  ██║ ██╔╝██╔════╝╚██╗ ██╔╝██╔════╝
//  █████╔╝ █████╗   ╚████╔╝ ███████╗
//  ██╔═██╗ ██╔══╝    ╚██╔╝  ╚════██║
//  ██║  ██╗███████╗   ██║   ███████║
//  ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚══════╝
//
// Adds foreign keys to a Collection where needed for belongsTo associations.

var _ = require('@sailshq/lodash');
var flaverr = require('flaverr');

module.exports = function foreignKeysMapper(schema) {
  // Validate that collections exists and is an array
  if (_.isUndefined(schema) || !_.isPlainObject(schema)) {
    throw new Error('Invalid schema argument to foreign key mapper.');
  }

  // Process each collection in the schema
  _.each(schema, function parseForeignKeys(collection) {
    //  ╦═╗╔═╗╔═╗╦  ╔═╗╔═╗╔═╗  ┌┬┐┌─┐┌┬┐┌─┐┬
    //  ╠╦╝║╣ ╠═╝║  ╠═╣║  ║╣   ││││ │ ││├┤ │
    //  ╩╚═╚═╝╩  ╩═╝╩ ╩╚═╝╚═╝  ┴ ┴└─┘─┴┘└─┘┴─┘
    //  ┌─┐┌─┐┌─┐┌─┐┌─┐┬┌─┐┌┬┐┬┌─┐┌┐┌┌─┐
    //  ├─┤└─┐└─┐│ ││  │├─┤ │ ││ ││││└─┐
    //  ┴ ┴└─┘└─┘└─┘└─┘┴┴ ┴ ┴ ┴└─┘┘└┘└─┘
    _.each(collection.schema, function parseAttributes(attributeVal, attributeName) {
      // We only care about adding foreign key values to attributes
      // with a `model` key
      if (!_.has(attributeVal, 'model')) {
        return;
      }

      // Find the model being referenced by the attribute
      var relatedModelName = attributeVal.model;
      var relatedModel = schema[relatedModelName];
      if (!relatedModel) {
        throw flaverr({ name: 'userError' }, new Error('The model association defined for attribute `' + attributeName + '` on the `' + collection.identity + '` model points to a model that doesn\'t exist.'));
      }

      // Find the primary key of the referenced model. This will be used to set
      // the rules regarding how the association is built. For a `model` type
      // association the foreign key will the value of the related model's
      // primary key unless a value is specifically defined.
      var relatedPrimaryKeyField = relatedModel.primaryKey;
      var relatedPrimaryKey = relatedModel.schema[relatedPrimaryKeyField];
      if (!relatedPrimaryKey) {
        throw flaverr({ name: 'userError' }, new Error('The model association defined for attribute `' + attributeName + '` on the `' + collection.identity + '` model points to a model that doesn\'t have a primary key field.'));
      }

      // Set the type of the attribute to either the inferred value or the
      // specified value.
      var autoMigrations = attributeVal.autoMigrations || {};
      var columnType = autoMigrations.columnType || relatedPrimaryKey.type;

      // Expand the attribute value to include information on the association.
      var foreignKey = {
        model: relatedModel.identity,
        columnName: attributeVal.columnName,
        type: columnType,
        foreignKey: true,
        references: relatedModel.tableName,
        referenceIdentity: relatedModelName,
        on: relatedPrimaryKey.columnName,
        onKey: relatedPrimaryKeyField,
        autoMigrations: attributeVal.autoMigrations || {}
      };

      // Remove the attribute and replace it with the foreign key
      delete collection.schema[attributeName];
      collection.schema[attributeName] = foreignKey;
    });
  });
};
