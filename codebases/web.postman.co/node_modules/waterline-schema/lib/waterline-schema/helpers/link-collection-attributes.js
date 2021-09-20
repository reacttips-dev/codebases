//  ██╗     ██╗███╗   ██╗██╗  ██╗     ██████╗ ██████╗ ██╗     ██╗     ███████╗ ██████╗████████╗██╗ ██████╗ ███╗   ██╗
//  ██║     ██║████╗  ██║██║ ██╔╝    ██╔════╝██╔═══██╗██║     ██║     ██╔════╝██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║
//  ██║     ██║██╔██╗ ██║█████╔╝     ██║     ██║   ██║██║     ██║     █████╗  ██║        ██║   ██║██║   ██║██╔██╗ ██║
//  ██║     ██║██║╚██╗██║██╔═██╗     ██║     ██║   ██║██║     ██║     ██╔══╝  ██║        ██║   ██║██║   ██║██║╚██╗██║
//  ███████╗██║██║ ╚████║██║  ██╗    ╚██████╗╚██████╔╝███████╗███████╗███████╗╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║
//  ╚══════╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝     ╚═════╝ ╚═════╝ ╚══════╝╚══════╝╚══════╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
//
//   █████╗ ████████╗████████╗██████╗ ██╗██████╗ ██╗   ██╗████████╗███████╗███████╗
//  ██╔══██╗╚══██╔══╝╚══██╔══╝██╔══██╗██║██╔══██╗██║   ██║╚══██╔══╝██╔════╝██╔════╝
//  ███████║   ██║      ██║   ██████╔╝██║██████╔╝██║   ██║   ██║   █████╗  ███████╗
//  ██╔══██║   ██║      ██║   ██╔══██╗██║██╔══██╗██║   ██║   ██║   ██╔══╝  ╚════██║
//  ██║  ██║   ██║      ██║   ██║  ██║██║██████╔╝╚██████╔╝   ██║   ███████╗███████║
//  ╚═╝  ╚═╝   ╚═╝      ╚═╝   ╚═╝  ╚═╝╚═╝╚═════╝  ╚═════╝    ╚═╝   ╚══════╝╚══════╝
//
// For many-to-many associations where a join table needs to be created,
// link the two attributes to point to the join table.

var _ = require('@sailshq/lodash');

module.exports = function linkCollectionAttributes(schema, joinTables) {
  // Process each collection, linking join tables along the way to
  // attributes that will use them
  _.each(schema, function processCollection(collection, collectionName) {
    _.each(collection.schema, function processCollectionAttribute(attributeVal, attributeName) {
      // Only attributes that could possibly use the join table should be
      // considered
      if (!_.has(attributeVal, 'collection')) {
        return;
      }

      // Determine if there is a join table that uses this association
      var join = false;
      var tableCollection;

      _.each(joinTables, function lookThroughJoinTables(table) {
        // Look into the `tables` property of the join table to determine if the
        // association collections are involved.
        var tablesInUse = table.tables;

        // Check if the tables in use contains both the related collections
        if (_.indexOf(tablesInUse, collectionName) > -1 || _.indexOf(tablesInUse, attributeVal.collection) > -1) {
          // Build a column name to check for. There could be multiple join tables
          // used between two collections so check for something that actually
          // points to the attribute.
          var column = attributeVal.collection + '_' + attributeVal.via;
          if (!_.has(table.attributes, column)) {
            return;
          }

          // Flag the join to true
          join = true;

          // Set the table collection value
          tableCollection = table;
        }
      });

      // If no join was found return
      if (!join || !tableCollection) {
        return;
      }

      // If the table doesn't know about the other side, ignore updating anything
      if (!_.has(tableCollection.attributes, collectionName + '_' + attributeName)) {
        return;
      }

      collection.schema[attributeName] = {
        collection: tableCollection.identity,
        references: tableCollection.tableName,
        referenceIdentity: tableCollection.identity,
        on: tableCollection.attributes[collectionName + '_' + attributeName].columnName,
        onKey: tableCollection.attributes[collectionName + '_' + attributeName].columnName
      };
    });
  });
};
