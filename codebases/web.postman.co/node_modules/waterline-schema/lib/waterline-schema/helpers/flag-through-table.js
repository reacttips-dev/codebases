//  ███████╗██╗      █████╗  ██████╗     ████████╗██╗  ██╗██████╗  ██████╗ ██╗   ██╗ ██████╗ ██╗  ██╗
//  ██╔════╝██║     ██╔══██╗██╔════╝     ╚══██╔══╝██║  ██║██╔══██╗██╔═══██╗██║   ██║██╔════╝ ██║  ██║
//  █████╗  ██║     ███████║██║  ███╗       ██║   ███████║██████╔╝██║   ██║██║   ██║██║  ███╗███████║
//  ██╔══╝  ██║     ██╔══██║██║   ██║       ██║   ██╔══██║██╔══██╗██║   ██║██║   ██║██║   ██║██╔══██║
//  ██║     ███████╗██║  ██║╚██████╔╝       ██║   ██║  ██║██║  ██║╚██████╔╝╚██████╔╝╚██████╔╝██║  ██║
//  ╚═╝     ╚══════╝╚═╝  ╚═╝ ╚═════╝        ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝  ╚═════╝  ╚═════╝ ╚═╝  ╚═╝
//
//  ████████╗ █████╗ ██████╗ ██╗     ███████╗
//  ╚══██╔══╝██╔══██╗██╔══██╗██║     ██╔════╝
//     ██║   ███████║██████╔╝██║     █████╗
//     ██║   ██╔══██║██╔══██╗██║     ██╔══╝
//     ██║   ██║  ██║██████╔╝███████╗███████╗
//     ╚═╝   ╚═╝  ╚═╝╚═════╝ ╚══════╝╚══════╝
//
// When a many-to-many through table is used, flag the table in the schema
// as a join table.

var _ = require('@sailshq/lodash');
var flaverr = require('flaverr');

module.exports = function flagThroughTable(collectionName, schema) {

  var attributes = schema[collectionName].schema;

  // Look for attributes with "through" properties
  _.each(attributes, function lookForThroughProperty(attributeVal, attributeName) {
    if (!_.has(attributeVal, 'through')) {
      return;
    }

    // Find the "through" collection that is being pointed to
    var linkedCollectionName = attributeVal.through;
    schema[linkedCollectionName].throughTable = schema[linkedCollectionName].throughTable || {};
    var throughPath = collectionName + '.' + attributeName;
    var linkedAttrs = schema[linkedCollectionName].schema;

    // Find the opposite side of this association, which is linked by the through table.
    // e.g. in { collection: 'roles', through: 'userroles', via: 'user_id' }, the opposite collection is `roles`.
    var oppositeCollectionName = attributeVal.collection;

    // Make sure the opposite side has a reference to this collection via the same through table.
    if (!_.any(schema[oppositeCollectionName].schema, function(oppositeAttrVal) {
      return oppositeAttrVal.collection === collectionName && (oppositeAttrVal.through === linkedCollectionName || oppositeAttrVal.referenceIdentity === linkedCollectionName);
    })) {
      throw flaverr({ name: 'userError' }, new Error('A `through` property was set on the attribute `' + attributeName + '` on the `' + collectionName + '` model but no corresponding attribute in the `' + oppositeCollectionName + '` model could be found pointing with the same `through` value (`' + linkedCollectionName + '`).'));
    }

    // Set the schema value on the through table
    schema[linkedCollectionName].hasSchema = true;

    // Find the attribute on the linked collection that references this collection
    schema[linkedCollectionName].throughTable[throughPath] =  _.find(_.keys(linkedAttrs), function checkReference(attrName) {
      if (!linkedAttrs[attrName].referenceIdentity) {
        return false;
      }

      return linkedAttrs[attrName].referenceIdentity === attributeVal.collection;
    });

    // Build up proper reference on the attribute
    attributeVal.references = schema[linkedCollectionName].tableName;
    attributeVal.referenceIdentity = linkedCollectionName;

    // Find Reference Key
    var via = attributeVal.via;
    var reference;

    _.each(linkedAttrs, function lookForLinkedAttribute(linkedAttrVal, linkedAttrName) {
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

      if (linkedAttrVal.references !== schema[collectionName].tableName) {
        return;
      }

      if (via !== linkedAttrName) {
        return;
      }

      reference = linkedAttrVal.columnName;
    });

    if (!reference) {
      throw flaverr({ name: 'userError' }, new Error('A `through` property was set on the attribute `' + attributeName + '` on the `' + collectionName + '` model but no reference in the through model was found.'));
    }

    // Set the reference
    attributeVal.on = reference;
    attributeVal.onKey = reference;

    // Remove the through key from the schema definition
    delete attributeVal.through;

    // Set the attribute value
    attributes[attributeName] = attributeVal;
  });
};
