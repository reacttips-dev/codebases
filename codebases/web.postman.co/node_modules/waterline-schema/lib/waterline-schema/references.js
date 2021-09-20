//  ███╗   ███╗ █████╗ ██████╗
//  ████╗ ████║██╔══██╗██╔══██╗
//  ██╔████╔██║███████║██████╔╝
//  ██║╚██╔╝██║██╔══██║██╔═══╝
//  ██║ ╚═╝ ██║██║  ██║██║
//  ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝
//
//  ██████╗ ███████╗███████╗███████╗██████╗ ███████╗███╗   ██╗ ██████╗███████╗███████╗
//  ██╔══██╗██╔════╝██╔════╝██╔════╝██╔══██╗██╔════╝████╗  ██║██╔════╝██╔════╝██╔════╝
//  ██████╔╝█████╗  █████╗  █████╗  ██████╔╝█████╗  ██╔██╗ ██║██║     █████╗  ███████╗
//  ██╔══██╗██╔══╝  ██╔══╝  ██╔══╝  ██╔══██╗██╔══╝  ██║╚██╗██║██║     ██╔══╝  ╚════██║
//  ██║  ██║███████╗██║     ███████╗██║  ██║███████╗██║ ╚████║╚██████╗███████╗███████║
//  ╚═╝  ╚═╝╚══════╝╚═╝     ╚══════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝ ╚═════╝╚══════╝╚══════╝
//
// Map References for hasMany attributes. Not necessarily used for most schemas
// but used internally in Waterline. It could also be helpful for key/value datastores.

var _ = require('@sailshq/lodash');
var flaverr = require('flaverr');

module.exports = function mapReferences(schema) {
  _.each(schema, function parseCollections(collection, collectionName) {
    _.each(collection.schema, function parseAttributes(attributeVal, attributeName) {
      // If there isn't a collection attribute property, nothing to update
      if (!_.has(attributeVal, 'collection')) {
        return;
      }

      // If a reference has been mapped out previously, nothing to do
      if (_.has(attributeVal, 'references') && _.has(attributeVal, 'on')) {
        return;
      }


      // Check For hasManyThrough
      // (these should have already been handled in the join tables processor)
      if (_.has(attributeVal, 'through')) {
        return;
      }

      // Find the collection that is being pointed to
      var linkedCollection = attributeVal.collection;
      var linkedAttrs = schema[linkedCollection].schema;

      // Build up proper reference on the attribute
      attributeVal.references = schema[linkedCollection].tableName;
      attributeVal.referenceIdentity = linkedCollection;

      // Find Reference Key
      var via = attributeVal.via;
      var reference;

      _.each(linkedAttrs, function searchForLinkedAttribute(linkedAttrVal, linkedAttrName) {
        // If the reference was already found, stop processing
        if (reference) {
          return;
        }

        if (!_.has(linkedAttrVal, 'foreignKey')) {
          return;
        }

        if (!_.has(linkedAttrVal, 'references')) {
          return;
        }

        if (linkedAttrVal.references !== collection.tableName) {
          return;
        }

        if (via !== linkedAttrName) {
          return;
        }

        reference = linkedAttrVal.columnName;
      });

      if (!reference) {
        throw flaverr({ name: 'userError' }, new Error('A `collection` property was set on the attribute `' + attributeName + '` on the ' + collectionName + ' model that points to the ' + linkedCollection + ' model but no reference was found matching that model.'));
      }

      // Set the reference
      attributeVal.on = reference;
      attributeVal.onKey = reference;
    });
  });
};
