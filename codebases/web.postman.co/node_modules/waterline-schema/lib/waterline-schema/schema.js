//  ██████╗ ██╗   ██╗██╗██╗     ██████╗
//  ██╔══██╗██║   ██║██║██║     ██╔══██╗
//  ██████╔╝██║   ██║██║██║     ██║  ██║
//  ██╔══██╗██║   ██║██║██║     ██║  ██║
//  ██████╔╝╚██████╔╝██║███████╗██████╔╝
//  ╚═════╝  ╚═════╝ ╚═╝╚══════╝╚═════╝
//
//  ███████╗ ██████╗██╗  ██╗███████╗███╗   ███╗ █████╗
//  ██╔════╝██╔════╝██║  ██║██╔════╝████╗ ████║██╔══██╗
//  ███████╗██║     ███████║█████╗  ██╔████╔██║███████║
//  ╚════██║██║     ██╔══██║██╔══╝  ██║╚██╔╝██║██╔══██║
//  ███████║╚██████╗██║  ██║███████╗██║ ╚═╝ ██║██║  ██║
//  ╚══════╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝
//
// Takes a collection of attributes from a Waterline Collection
// and builds up an initial schema by normalizing into a known format.

var _ = require('@sailshq/lodash');
var flaverr = require('flaverr');
var rttc = require('rttc');
var validTypes = require('../../accessible/valid-attribute-types');
var validProperties = require('../../accessible/valid-attribute-properties');

module.exports = function schemaBuilder(collections) {
  // Build up a schema object to return
  var schema = {};

  // Validate that collections exists and is an array
  if (_.isUndefined(collections) || !_.isArray(collections)) {
    throw new Error('Invalid collections argument.');
  }

  // Process each collection
  _.each(collections, function normalizeCollection(collectionPrototype) {
    var collection = collectionPrototype.prototype;

    //  ╔╗╔╔═╗╦═╗╔╦╗╔═╗╦  ╦╔═╗╔═╗  ┬┌┬┐┌─┐┌┐┌┌┬┐┬┌┬┐┬ ┬
    //  ║║║║ ║╠╦╝║║║╠═╣║  ║╔═╝║╣   │ ││├┤ │││ │ │ │ └┬┘
    //  ╝╚╝╚═╝╩╚═╩ ╩╩ ╩╩═╝╩╚═╝╚═╝  ┴─┴┘└─┘┘└┘ ┴ ┴ ┴  ┴
    if (_.has(collection, 'tableName') && !_.has(collection, 'identity')) {
      collection.identity = collection.tableName;
    }

    //  ╔╗╔╔═╗╦═╗╔╦╗╔═╗╦  ╦╔═╗╔═╗  ┌┬┐┌─┐┌┐ ┬  ┌─┐  ┌┐┌┌─┐┌┬┐┌─┐
    //  ║║║║ ║╠╦╝║║║╠═╣║  ║╔═╝║╣    │ ├─┤├┴┐│  ├┤   │││├─┤│││├┤
    //  ╝╚╝╚═╝╩╚═╩ ╩╩ ╩╩═╝╩╚═╝╚═╝   ┴ ┴ ┴└─┘┴─┘└─┘  ┘└┘┴ ┴┴ ┴└─┘
    if (!_.has(collection, 'tableName')) {
      collection.tableName = collection.identity;
    }

    // Require an identity so the object key can be set
    if (!_.has(collection, 'identity')) {
      throw flaverr({ name: 'userError' }, new Error('A Model must include an identity or tableName attribute'));
    }

    // Require a table name
    if (!_.has(collection, 'tableName')) {
      throw flaverr({ name: 'userError' }, new Error('A Model must include a tableName attribute'));
    }


    //  ╔═╗╦ ╦╔═╗╔═╗╦╔═  ┌┬┐┬┌┬┐┌─┐┌─┐┌┬┐┌─┐┌┬┐┌─┐┌─┐
    //  ║  ╠═╣║╣ ║  ╠╩╗   │ ││││├┤ └─┐ │ ├─┤│││├─┘└─┐
    //  ╚═╝╩ ╩╚═╝╚═╝╩ ╩   ┴ ┴┴ ┴└─┘└─┘ ┴ ┴ ┴┴ ┴┴  └─┘
    // Ensure that the legacy values autoCreatedAt and autoUpdatedAt are not
    // set on the collection. If they are, throw an error.
    if (_.has(collection, 'autoCreatedAt')) {
      throw flaverr({ name: 'userError' }, new Error('A model may not contain a top-level `autoCreatedAt` model option. To set an auto incrementing timestamp set the `autoCreatedAt` flag directly on an attribute.'));
    }

    if (_.has(collection, 'autoUpdatedAt')) {
      throw flaverr({ name: 'userError' }, new Error('A model may not contain a top-level `autoUpdatedAt` model option. To set an auto incrementing timestamp set the `autoUpdatedAt` flag directly on an attribute.'));
    }


    //  ╔═╗╔═╗╔╦╗  ┌─┐┬─┐┬┌┬┐┌─┐┬─┐┬ ┬  ┬┌─┌─┐┬ ┬
    //  ╚═╗║╣  ║   ├─┘├┬┘││││├─┤├┬┘└┬┘  ├┴┐├┤ └┬┘
    //  ╚═╝╚═╝ ╩   ┴  ┴└─┴┴ ┴┴ ┴┴└─ ┴   ┴ ┴└─┘ ┴
    // EVERY model must contain an attribute that represents the primary key.
    // To find the Primary Key it will be set on the top level model options.

    // Validate that the primary key exists and the attribute it points to exists
    // in the definition.
    if (!_.has(collection, 'primaryKey') || !_.isString(collection.primaryKey)) {
      throw flaverr({ name: 'userError' }, new Error('Could not find a primary key attribute on the model `' + collection.identity + '`. All models must contain an attribute that acts as the primary key and is guaranteed to be unique.'));
    }

    // Check and make sure the attribute actually exists
    if (!_.has(collection.attributes, collection.primaryKey)) {
      throw flaverr({ name: 'userError' }, new Error('The model `' + collection.identity + '` defined a primary key of `' + collection.primaryKey + '` but that attribute could not be found on the model.'));
    }

    // Ensure that the primary key does NOT contain a `defaultsTo` value.
    var primaryKeyAttribute = collection.attributes[collection.primaryKey];
    if (_.has(primaryKeyAttribute, 'defaultsTo') && !_.isUndefined(primaryKeyAttribute, 'defaultsTo')) {
      throw flaverr({ name: 'userError' }, new Error('The model `' + collection.identity + '` defined a primary key of `' + collection.primaryKey + '` that has a `defaultsTo` value set. Primary keys must be unique therefore can\'t contain a default value.'));
    }

    if (_.has(primaryKeyAttribute, 'autoCreatedAt') && primaryKeyAttribute.autoCreatedAt) {
      throw flaverr({ name: 'userError' }, new Error('The model `' + collection.identity + '` defined a primary key of `' + collection.primaryKey + '` that has an `autoCreatedAt` value set. Primary keys must be unique therefore can\'t contain a timestamp value because it is not guaranteed to be unique.'));
    }

    if (_.has(primaryKeyAttribute, 'autoUpdatedAt') && primaryKeyAttribute.autoUpdatedAt) {
      throw flaverr({ name: 'userError' }, new Error('The model `' + collection.identity + '` defined a primary key of `' + collection.primaryKey + '` that has an `autoUpdatedAt` value set. Primary keys must be unique therefore can\'t contain a timestamp value because it is not guaranteed to be unique.'));
    }

    if (primaryKeyAttribute.type !== 'number' && primaryKeyAttribute.type !== 'string') {
      throw flaverr({ name: 'userError' }, new Error('The model `' + collection.identity + '` defined a primary key of `' + collection.primaryKey + '` that has an invalid type. Valid primary key types are `number` and `string`'));
    }


    //  ╔╗╔╔═╗╦═╗╔╦╗╔═╗╦  ╦╔═╗╔═╗  ┬┌┬┐┌─┐┌┐┌┌┬┐┬┌┬┐┬ ┬
    //  ║║║║ ║╠╦╝║║║╠═╣║  ║╔═╝║╣   │ ││├┤ │││ │ │ │ └┬┘
    //  ╝╚╝╚═╝╩╚═╩ ╩╩ ╩╩═╝╩╚═╝╚═╝  ┴─┴┘└─┘┘└┘ ┴ ┴ ┴  ┴
    //  ┌┬┐┌─┐  ┬  ┌─┐┬ ┬┌─┐┬─┐┌─┐┌─┐┌─┐┌─┐
    //   │ │ │  │  │ ││││├┤ ├┬┘│  ├─┤└─┐├┤
    //   ┴ └─┘  ┴─┘└─┘└┴┘└─┘┴└─└─┘┴ ┴└─┘└─┘
    collection.identity = collection.identity.toLowerCase();


    //  ╔═╗╔╦╗╔╦╗  ┌─┐┌─┐┬  ┬  ┌─┐┌─┐┌┬┐┬┌─┐┌┐┌  ┌┬┐┌─┐
    //  ╠═╣ ║║ ║║  │  │ ││  │  ├┤ │   │ ││ ││││   │ │ │
    //  ╩ ╩═╩╝═╩╝  └─┘└─┘┴─┘┴─┘└─┘└─┘ ┴ ┴└─┘┘└┘   ┴ └─┘
    //  ┌─┐┌─┐┌─┐┬ ┬┌─┐
    //  │  ├─┤│  ├─┤├┤
    //  └─┘┴ ┴└─┘┴ ┴└─┘
    // Store as lowercased so it's easier to lookup.
    schema[collection.identity] = {
      primaryKey: collection.primaryKey,
      hasSchema: _.has(collection, 'schema') ? collection.schema : undefined,
      identity: collection.identity,
      tableName: collection.tableName,
      datastore: collection.datastore || collection.connection,
      attributes: _.merge({}, collection.attributes),
      // The schema piece will be transformed along the way to reflect the
      // underlying datastructure. i.e. expanding out associations into foreign
      // keys, etc.
      schema: _.merge({}, collection.attributes),
      meta: collection.meta || {},

      // Ensure the collection has a fetch flag
      fetchRecordsOnUpdate: collection.fetchRecordsOnUpdate || false,
      fetchRecordsOnDestroy: collection.fetchRecordsOnDestroy || false,

      // Ensure the collection has a cascade flag
      cascadeOnDestroy: collection.cascadeOnDestroy || false
    };

    // Grab a shorthand reference to the schema object
    var schemaCollection = schema[collection.identity];


    //  ╦  ╦╔═╗╦  ╦╔╦╗╔═╗╔╦╗╔═╗  ┌─┐┌┬┐┌┬┐┬─┐┬┌┐ ┬ ┬┌┬┐┌─┐┌─┐
    //  ╚╗╔╝╠═╣║  ║ ║║╠═╣ ║ ║╣   ├─┤ │  │ ├┬┘│├┴┐│ │ │ ├┤ └─┐
    //   ╚╝ ╩ ╩╩═╝╩═╩╝╩ ╩ ╩ ╚═╝  ┴ ┴ ┴  ┴ ┴└─┴└─┘└─┘ ┴ └─┘└─┘
    // Validate each attribute and remove any fields that belong on the schema
    // such as `columnName`.
    _.each(schemaCollection.attributes, function parseAttributes(attribute, attributeName) {
      //  ╔═╗╔╗╔╔═╗╦ ╦╦═╗╔═╗  ┌┐┌┌─┐  ┬┌┐┌┌─┐┌┬┐┌─┐┌┐┌┌─┐┌─┐  ┌┬┐┌─┐┌┬┐┬ ┬┌─┐┌┬┐┌─┐
      //  ║╣ ║║║╚═╗║ ║╠╦╝║╣   ││││ │  ││││└─┐ │ ├─┤││││  ├┤   │││├┤  │ ├─┤│ │ ││└─┐
      //  ╚═╝╝╚╝╚═╝╚═╝╩╚═╚═╝  ┘└┘└─┘  ┴┘└┘└─┘ ┴ ┴ ┴┘└┘└─┘└─┘  ┴ ┴└─┘ ┴ ┴ ┴└─┘─┴┘└─┘
      //  ┌─┐─┐ ┬┬┌─┐┌┬┐  ┌─┐┌┐┌  ┌┬┐┬ ┬┌─┐  ┌┬┐┌─┐┌┬┐┌─┐┬
      //  ├┤ ┌┴┬┘│└─┐ │   │ ││││   │ ├─┤├┤   ││││ │ ││├┤ │
      //  └─┘┴ └─┴└─┘ ┴   └─┘┘└┘   ┴ ┴ ┴└─┘  ┴ ┴└─┘─┴┘└─┘┴─┘
      if (_.isFunction(attribute)) {
        throw flaverr({ name: 'userError' }, Error('Functions are not allowed as attributes and instance methods on models have been removed. Please change the `' + attributeName + '` on the `' + collection.identity + '` model.'));
      }


      //  ╔═╗╔╗╔╔═╗╦ ╦╦═╗╔═╗  ┌┬┐┬ ┬┌─┐  ┌─┐┌┬┐┌┬┐┬─┐┬┌┐ ┬ ┬┌┬┐┌─┐
      //  ║╣ ║║║╚═╗║ ║╠╦╝║╣    │ ├─┤├┤   ├─┤ │  │ ├┬┘│├┴┐│ │ │ ├┤
      //  ╚═╝╝╚╝╚═╝╚═╝╩╚═╚═╝   ┴ ┴ ┴└─┘  ┴ ┴ ┴  ┴ ┴└─┴└─┘└─┘ ┴ └─┘
      //  ┬ ┬┌─┐┌─┐  ┌─┐  ┌┬┐┬ ┬┌─┐┌─┐
      //  ├─┤├─┤└─┐  ├─┤   │ └┬┘├─┘├┤
      //  ┴ ┴┴ ┴└─┘  ┴ ┴   ┴  ┴ ┴  └─┘
      // Only if it's not an association
      if (!_.has(attribute, 'type') && !_.has(attribute, 'model') && !_.has(attribute, 'collection')) {
        throw flaverr({ name: 'userError' }, Error('The attribute `' + attributeName + '` on the `' + collection.identity + '` model is missing a type property. All attributes must define what their type is.'));
      }

      // Ensure the type is valid.
      if (!_.has(attribute, 'model') && !_.has(attribute, 'collection') && _.indexOf(validTypes, attribute.type) < 0) {
        throw flaverr({ name: 'userError' }, Error('The attribute `' + attributeName + '` on the `' + collection.identity + '` model uses an invalid type - `' + attribute.type + '`.'));
      }

      // Ensure if the attribute is a singular association the type is unspecified
      if (_.has(attribute, 'model') && _.has(attribute, 'type') && !_.isUndefined(attribute, 'type')) {
        throw flaverr({ name: 'userError' }, Error('The attribute `' + attributeName + '` on the `' + collection.identity + '` model is an association but also specifies a type property. This is not needed and will be automatically determined.'));
      }


      //  ╔═╗╔╗╔╔═╗╦ ╦╦═╗╔═╗  ┌┬┐┬ ┬┌─┐  ┌─┐┌┬┐┌┬┐┬─┐┬┌┐ ┬ ┬┌┬┐┌─┐
      //  ║╣ ║║║╚═╗║ ║╠╦╝║╣    │ ├─┤├┤   ├─┤ │  │ ├┬┘│├┴┐│ │ │ ├┤
      //  ╚═╝╝╚╝╚═╝╚═╝╩╚═╚═╝   ┴ ┴ ┴└─┘  ┴ ┴ ┴  ┴ ┴└─┴└─┘└─┘ ┴ └─┘
      //  ┬ ┬┌─┐┌─┐  ┌─┐  ┬─┐┌─┐┌─┐ ┬ ┬┬┬─┐┌─┐┌┬┐  ┌─┐┬  ┌─┐┌─┐
      //  ├─┤├─┤└─┐  ├─┤  ├┬┘├┤ │─┼┐│ ││├┬┘├┤  ││  ├┤ │  ├─┤│ ┬
      //  ┴ ┴┴ ┴└─┘  ┴ ┴  ┴└─└─┘└─┘└└─┘┴┴└─└─┘─┴┘  └  ┴─┘┴ ┴└─┘
      if (_.has(attribute, 'required') && !_.isBoolean(attribute.required)) {
        throw flaverr({ name: 'userError' }, Error('The attribute `' + attributeName + '` on the `' + collection.identity + '` model has a `required` flag but the value is not a boolean.'));
      }

      // Set to false if it's missing
      if (!_.has(attribute, 'required')) {
        attribute.required = false;
      }

      // Ensure that any plural associations don't contain a required flag
      if (_.has(attribute, 'collection') && attribute.required) {
        throw flaverr({ name: 'userError' }, Error('The attribute `' + attributeName + '` on the `' + collection.identity + '` model is a plural association and can\'t have a required flag set. Plural associations can only be populated.'));
      }

      // Ensure that any plural associations don't contain a columnName property
      if (_.has(attribute, 'collection') && _.has(attribute, 'columnName')) {
        throw flaverr({ name: 'userError' }, Error('The attribute `' + attributeName + '` on the `' + collection.identity + '` model is a plural association and can\'t have a `columnName` value set.  If you\'re trying to customize the join table used for a many-to-many association, use the `through` option.'));
      }

      // Ensure any plural associations don't point to themselves
      if (_.has(attribute, 'collection') && _.has(attribute, 'via')) {
        // If the via is === to the attribute name and the collection is the current identity
        // then bail out.
        if (attribute.via.toLowerCase() === attributeName && attribute.collection.toLowerCase() === collection.identity) {
          throw flaverr({ name: 'userError' }, Error('The `via` property in the `' + attributeName + '` attribute of model `' + collection.identity + '` is invalid because it points at itself.  Instead, if you want to indicate that this is a reflexive association with no inverse (for example, a Person\'s "favoriteSiblings" attribute, where Jill might be one of Jack\'s favorite siblings without Jack necessarily being one of Jill\'s favorite siblings), simply remove `via`.  Or if you want this association to be commutative (to go both ways and automatically stay up to date for both involved records; for example, a Person\'s "siblings", where adding Jack as one of Jill\'s siblings always means that Jill should also be considered one of Jack\'s siblings too), then you\'ll still need to remove this `via` and simulate this commutativity yourself by keeping both records up to date.  (See https://trello.com/c/JiwzRmFY for a visual diagram.)'));
        }
      }

      // Ensure if the attribute is required that it doesn't have a defaultsTo value
      if (attribute.required && _.has(attribute, 'defaultsTo') && !_.isUndefined(attribute, 'defaultsTo')) {
        throw flaverr({ name: 'userError' }, Error('The attribute `' + attributeName + '` on the `' + collection.identity + '` model is set to `required` but it also has a `defaultsTo` value set. In this case the two checks cancel each other out. Only one of them should be set.'));
      }


      //  ╦  ╦╔═╗╦  ╦╔╦╗╔═╗╔╦╗╔═╗  ┌─┐┬─┐┌─┐┌─┐┌─┐┬─┐┌┬┐┬┌─┐┌─┐
      //  ╚╗╔╝╠═╣║  ║ ║║╠═╣ ║ ║╣   ├─┘├┬┘│ │├─┘├┤ ├┬┘ │ │├┤ └─┐
      //   ╚╝ ╩ ╩╩═╝╩═╩╝╩ ╩ ╩ ╚═╝  ┴  ┴└─└─┘┴  └─┘┴└─ ┴ ┴└─┘└─┘
      // If the attribute contains a property that isn't whitelisted, then return
      // an error.
      _.each(attribute, function parseProperties(propertyValue, propertyName) {
        if (_.indexOf(validProperties, propertyName) < 0) {
          throw flaverr({ name: 'userError' }, Error('The attribute `' + attributeName + '` on the `' + collection.identity + '` model contains invalid properties. The property `' + propertyName + '` isn\'t a recognized property.'));
        }
      });


      //  ╦  ╦╔═╗╦  ╦╔╦╗╔═╗╔╦╗╔═╗  ┌─┐┬  ┬  ┌─┐┬ ┬╔╗╔┬ ┬┬  ┬
      //  ╚╗╔╝╠═╣║  ║ ║║╠═╣ ║ ║╣   ├─┤│  │  │ ││││║║║│ ││  │
      //   ╚╝ ╩ ╩╩═╝╩═╩╝╩ ╩ ╩ ╚═╝  ┴ ┴┴─┘┴─┘└─┘└┴┘╝╚╝└─┘┴─┘┴─┘
      // allowNull may not be used on any attributes whose type is `json` or `ref`.
      // It may also not be used on primaryKeys, timestamps, singular or plural associations,
      // and any attributes with required true set.
      if (_.has(attribute, 'allowNull') && attribute.allowNull === true) {
        // Check the attribute isn't an association
        if (_.has(attribute, 'model') || _.has(attribute, 'collection')) {
          throw flaverr({ name: 'userError' }, Error('The attribute `' + attributeName + '` on the `' + collection.identity + '` model contains invalid properties. The `allowNull` flag may not be used on attributes that represent associations. For singular associations `null` is allowed by default.'));
        }

        // Check type isn't a ref or json type
        if (attribute.type.toLowerCase() === 'json' || attribute.type.toLowerCase() === 'ref') {
          throw flaverr({ name: 'userError' }, Error('The attribute `' + attributeName + '` on the `' + collection.identity + '` model contains invalid properties. The `allowNull` flag may not be used on attributes with type `json` or type `ref`.'));
        }

        // Check the attribute isn't a primaryKey
        if (collection.primaryKey === attributeName) {
          throw flaverr({ name: 'userError' }, Error('The attribute `' + attributeName + '` on the `' + collection.identity + '` model contains invalid properties. The primary key may not allow null values.'));
        }

        // Check the attribute isn't a timestamp
        if (_.has(attribute, 'autoCreatedAt') && attribute.autoCreatedAt === true) {
          throw flaverr({ name: 'userError' }, Error('The attribute `' + attributeName + '` on the `' + collection.identity + '` model contains invalid properties. Auto-timestamp fields may not allow null values to be set.'));
        }

        if (_.has(attribute, 'autoUpdatedAt') && attribute.autoUpdatedAt === true) {
          throw flaverr({ name: 'userError' }, Error('The attribute `' + attributeName + '` on the `' + collection.identity + '` model contains invalid properties. Auto-timestamp fields may not allow null values to be set.'));
        }

        // Check the attribute isn't a required attribute
        if (_.has(attribute, 'required') && attribute.required === true) {
          throw flaverr({ name: 'userError' }, Error('The attribute `' + attributeName + '` on the `' + collection.identity + '` model contains invalid properties. Attributes with a required flag may not allow `null` values to be set.'));
        }

        // Check the attribute doesn't have a default value of null
        if (_.has(attribute, 'defaultsTo') && _.isNull(attribute.defaultsTo)) {
          throw flaverr({ name: 'userError' }, Error('The attribute `' + attributeName + '` on the `' + collection.identity + '` model contains invalid properties. The attribute has both a `defaultsTo` value set to `null` and an `allowNull` flag set to true. When the `allowNull` flag is set to true then the default value for the attribute will always be `null` and the `defaultsTo` flag should not be used.'));
        }
      }


      //  ╦  ╦╔═╗╦  ╦╔╦╗╔═╗╔╦╗╔═╗  ┌┬┐┬ ┬┌─┐  ┌─┐┌┬┐┌┬┐┬─┐┬┌┐ ┬ ┬┌┬┐┌─┐
      //  ╚╗╔╝╠═╣║  ║ ║║╠═╣ ║ ║╣    │ ├─┤├┤   ├─┤ │  │ ├┬┘│├┴┐│ │ │ ├┤
      //   ╚╝ ╩ ╩╩═╝╩═╩╝╩ ╩ ╩ ╚═╝   ┴ ┴ ┴└─┘  ┴ ┴ ┴  ┴ ┴└─┴└─┘└─┘ ┴ └─┘
      //  ┌┐┌┌─┐┌┬┐┌─┐
      //  │││├─┤│││├┤
      //  ┘└┘┴ ┴┴ ┴└─┘
      // Check for dots in name
      if (attributeName.match(/\./g)) {
        throw flaverr({ name: 'userError' }, Error('Invalid Attribute Name: Attributes may not contain a \'.\' character.'));
      }

      // Remove the columnName attribute if it exists
      if (_.has(attribute, 'columnName')) {
        delete schemaCollection.attributes[attributeName].columnName;
      }


      //  ╦  ╦╔═╗╦  ╦╔╦╗╔═╗╔╦╗╔═╗  ┌┬┐┌─┐┌─┐┌─┐┬ ┬┬ ┌┬┐┌─┐  ┌┬┐┌─┐
      //  ╚╗╔╝╠═╣║  ║ ║║╠═╣ ║ ║╣    ││├┤ ├┤ ├─┤│ ││  │ └─┐   │ │ │
      //   ╚╝ ╩ ╩╩═╝╩═╩╝╩ ╩ ╩ ╚═╝  ─┴┘└─┘└  ┴ ┴└─┘┴─┘┴ └─┘   ┴ └─┘
      if (_.has(attribute, 'defaultsTo')) {
        // Verify the attribute isn't an association
        if (_.has(attribute, 'collection') || _.has(attribute, 'model')) {
          throw flaverr({ name: 'userError' }, Error('The attribute `' + attributeName + '` on the `' + collection.identity + '` model is an association and can not have a default value'));
        }

        // Verify that the attribute isn't required
        if (attribute.required) {
          throw flaverr({ name: 'userError' }, Error('The attribute `' + attributeName + '` on the `' + collection.identity + '` model contains both a `defaultsTo` value and is set to `required`. The attribute can have either property but not both.'));
        }

        // Verify that the defaultsTo is valid for the type
        try {
          rttc.validateStrict(attribute.type, attribute.defaultsTo);
        } catch (e) {
          throw flaverr({ name: 'userError' }, Error('The attribute `' + attributeName + '` on the `' + collection.identity + '` model has a default value that doesn\'t match it\'s set type.'));
        }
      }


      //  ╦  ╦╔═╗╦  ╦╔╦╗╔═╗╔╦╗╔═╗  ┌┬┐┬┌┬┐┌─┐┌─┐┌┬┐┌─┐┌┬┐┌─┐┌─┐
      //  ╚╗╔╝╠═╣║  ║ ║║╠═╣ ║ ║╣    │ ││││├┤ └─┐ │ ├─┤│││├─┘└─┐
      //   ╚╝ ╩ ╩╩═╝╩═╩╝╩ ╩ ╩ ╚═╝   ┴ ┴┴ ┴└─┘└─┘ ┴ ┴ ┴┴ ┴┴  └─┘
      // Validate that an attribute doesn't have both auto timestamp flags set
      // to `true`.
      if (_.has(attribute, 'autoCreatedAt') && attribute.autoCreatedAt) {
        if (_.has(attribute, 'autoUpdatedAt') && attribute.autoUpdatedAt) {
          throw flaverr({ name: 'userError' }, Error('The attribute `' + attributeName + '` on the `' + collection.identity + '` model contains both an `autoUpdatedAt` and an `autoCreatedAt` flag. It can only have one of these.'));
        }
      }

      // Ensure auto timestamps don't also contain a required flag or a default
      // value.
      if (_.has(attribute, 'autoCreatedAt')) {
        if (_.has(attribute, 'required') && attribute.required) {
          throw flaverr({ name: 'userError' }, Error('The attribute `' + attributeName + '` on the `' + collection.identity + '` model contains both an `autoCreatedAt` and an `required` flag. Because this attribute is automatically set, the `required` is not needed.'));
        }

        if (_.has(attribute, 'defaultsTo')) {
          throw flaverr({ name: 'userError' }, Error('The attribute `' + attributeName + '` on the `' + collection.identity + '` model contains both an `autoCreatedAt` flag and a `defaultsTo` value. Because this attribute is automatically set, the `defaultsTo` is not needed.'));
        }

        if (attribute.type !== 'number' && attribute.type !== 'string' && attribute.type !== 'ref') {
          throw flaverr({ name: 'userError' }, Error('The attribute `' + attributeName + '` on the `' + collection.identity + '` model contains both an `autoCreatedAt` flag but is not a proper type. Auto timestamps must have either a `number`, `string` or `ref` type set.'));
        }
      }

      if (_.has(attribute, 'autoUpdatedAt')) {
        if (_.has(attribute, 'required') && attribute.required) {
          throw flaverr({ name: 'userError' }, Error('The attribute `' + attributeName + '` on the `' + collection.identity + '` model contains both an `autoUpdatedAt` and an `required` flag. Because this attribute is automatically set, the `required` is not needed.'));
        }

        if (_.has(attribute, 'defaultsTo')) {
          throw flaverr({ name: 'userError' }, Error('The attribute `' + attributeName + '` on the `' + collection.identity + '` model contains both an `autoUpdatedAt` flag and a `defaultsTo` value. Because this attribute is automatically set, the `defaultsTo` is not needed.'));
        }

        if (attribute.type !== 'number' && attribute.type !== 'string' && attribute.type !== 'ref') {
          throw flaverr({ name: 'userError' }, Error('The attribute `' + attributeName + '` on the `' + collection.identity + '` model contains both an `autoUpdatedAt` flag but is not a proper type. Auto timestamps must have either a `number`, `string` or `ref` type set.'));
        }
      }


      //  ╔╗╔╔═╗╦═╗╔╦╗╔═╗╦  ╦╔═╗╔═╗  ┌─┐┬┌┐┌┌─┐┬  ┬ ┬┌─┐┬─┐  ┌─┐┌─┐┌─┐┌─┐┌─┐┬┌─┐┌┬┐┬┌─┐┌┐┌
      //  ║║║║ ║╠╦╝║║║╠═╣║  ║╔═╝║╣   └─┐│││││ ┬│  │ │├─┤├┬┘  ├─┤└─┐└─┐│ ││  │├─┤ │ ││ ││││
      //  ╝╚╝╚═╝╩╚═╩ ╩╩ ╩╩═╝╩╚═╝╚═╝  └─┘┴┘└┘└─┘┴─┘└─┘┴ ┴┴└─  ┴ ┴└─┘└─┘└─┘└─┘┴┴ ┴ ┴ ┴└─┘┘└┘
      //  ┌┬┐┌─┐  ┬  ┌─┐┬ ┬┌─┐┬─┐┌─┐┌─┐┌─┐┌─┐
      //   │ │ │  │  │ ││││├┤ ├┬┘│  ├─┤└─┐├┤
      //   ┴ └─┘  ┴─┘└─┘└┴┘└─┘┴└─└─┘┴ ┴└─┘└─┘
      if (_.has(attribute, 'model')) {
        attribute.model = attribute.model.toLowerCase();
      }

      //  ╔╗╔╔═╗╦═╗╔╦╗╔═╗╦  ╦╔═╗╔═╗  ┌─┐┬  ┬ ┬┬─┐┌─┐┬    ┌─┐┌─┐┌─┐┌─┐┌─┐┬┌─┐┌┬┐┬┌─┐┌┐┌
      //  ║║║║ ║╠╦╝║║║╠═╣║  ║╔═╝║╣   ├─┘│  │ │├┬┘├─┤│    ├─┤└─┐└─┐│ ││  │├─┤ │ ││ ││││
      //  ╝╚╝╚═╝╩╚═╩ ╩╩ ╩╩═╝╩╚═╝╚═╝  ┴  ┴─┘└─┘┴└─┴ ┴┴─┘  ┴ ┴└─┘└─┘└─┘└─┘┴┴ ┴ ┴ ┴└─┘┘└┘
      //  ┌┬┐┌─┐  ┬  ┌─┐┬ ┬┌─┐┬─┐┌─┐┌─┐┌─┐┌─┐
      //   │ │ │  │  │ ││││├┤ ├┬┘│  ├─┤└─┐├┤
      //   ┴ └─┘  ┴─┘└─┘└┴┘└─┘┴└─└─┘┴ ┴└─┘└─┘
      if (_.has(attribute, 'collection')) {
        attribute.collection = attribute.collection.toLowerCase();
      }

      //  ╔╗╔╔═╗╦═╗╔╦╗╔═╗╦  ╦╔═╗╔═╗  ┌┬┐┬ ┬┬─┐┌─┐┬ ┬┌─┐┬ ┬  ┌─┐┌─┐┌─┐┌─┐┌─┐┬┌─┐┌┬┐┬┌─┐┌┐┌
      //  ║║║║ ║╠╦╝║║║╠═╣║  ║╔═╝║╣    │ ├─┤├┬┘│ ││ ││ ┬├─┤  ├─┤└─┐└─┐│ ││  │├─┤ │ ││ ││││
      //  ╝╚╝╚═╝╩╚═╩ ╩╩ ╩╩═╝╩╚═╝╚═╝   ┴ ┴ ┴┴└─└─┘└─┘└─┘┴ ┴  ┴ ┴└─┘└─┘└─┘└─┘┴┴ ┴ ┴ ┴└─┘┘└┘
      //  ┌┬┐┌─┐┬  ┌─┐┬ ┬┌─┐┬─┐┌─┐┌─┐┌─┐┌─┐
      //   │ │ ││  │ ││││├┤ ├┬┘│  ├─┤└─┐├┤
      //   ┴ └─┘┴─┘└─┘└┴┘└─┘┴└─└─┘┴ ┴└─┘└─┘
      if (_.has(attribute, 'through')) {
        attribute.through = attribute.through.toLowerCase();
      }
    }); // </ .each(attributes)


    //  ╔╗╔╔═╗╦═╗╔╦╗╔═╗╦  ╦╔═╗╔═╗  ┌─┐┌─┐┬ ┬┌─┐┌┬┐┌─┐
    //  ║║║║ ║╠╦╝║║║╠═╣║  ║╔═╝║╣   └─┐│  ├─┤├┤ │││├─┤
    //  ╝╚╝╚═╝╩╚═╩ ╩╩ ╩╩═╝╩╚═╝╚═╝  └─┘└─┘┴ ┴└─┘┴ ┴┴ ┴
    // Expand out the schema so each attribute has a valid columnName.
    _.each(schemaCollection.schema, function normalizeSchema(attribute, attributeName) {
      if (!_.has(attribute, 'columnName') && !_.has(attribute, 'collection')) {
        var columnName = attributeName.trim().replace(' ', '_');
        schemaCollection.schema[attributeName].columnName = columnName;
      }

      //  ╔╗╔╔═╗╦═╗╔╦╗╔═╗╦  ╦╔═╗╔═╗  ┌─┐┬┌┐┌┌─┐┬  ┬ ┬┌─┐┬─┐  ┌─┐┌─┐┌─┐┌─┐┌─┐┬┌─┐┌┬┐┬┌─┐┌┐┌
      //  ║║║║ ║╠╦╝║║║╠═╣║  ║╔═╝║╣   └─┐│││││ ┬│  │ │├─┤├┬┘  ├─┤└─┐└─┐│ ││  │├─┤ │ ││ ││││
      //  ╝╚╝╚═╝╩╚═╩ ╩╩ ╩╩═╝╩╚═╝╚═╝  └─┘┴┘└┘└─┘┴─┘└─┘┴ ┴┴└─  ┴ ┴└─┘└─┘└─┘└─┘┴┴ ┴ ┴ ┴└─┘┘└┘
      //  ┌┬┐┌─┐  ┬  ┌─┐┬ ┬┌─┐┬─┐┌─┐┌─┐┌─┐┌─┐
      //   │ │ │  │  │ ││││├┤ ├┬┘│  ├─┤└─┐├┤
      //   ┴ └─┘  ┴─┘└─┘└┴┘└─┘┴└─└─┘┴ ┴└─┘└─┘
      if (_.has(attribute, 'model')) {
        attribute.model = attribute.model.toLowerCase();
      }

      //  ╔╗╔╔═╗╦═╗╔╦╗╔═╗╦  ╦╔═╗╔═╗  ┌─┐┬  ┬ ┬┬─┐┌─┐┬    ┌─┐┌─┐┌─┐┌─┐┌─┐┬┌─┐┌┬┐┬┌─┐┌┐┌
      //  ║║║║ ║╠╦╝║║║╠═╣║  ║╔═╝║╣   ├─┘│  │ │├┬┘├─┤│    ├─┤└─┐└─┐│ ││  │├─┤ │ ││ ││││
      //  ╝╚╝╚═╝╩╚═╩ ╩╩ ╩╩═╝╩╚═╝╚═╝  ┴  ┴─┘└─┘┴└─┴ ┴┴─┘  ┴ ┴└─┘└─┘└─┘└─┘┴┴ ┴ ┴ ┴└─┘┘└┘
      //  ┌┬┐┌─┐  ┬  ┌─┐┬ ┬┌─┐┬─┐┌─┐┌─┐┌─┐┌─┐
      //   │ │ │  │  │ ││││├┤ ├┬┘│  ├─┤└─┐├┤
      //   ┴ └─┘  ┴─┘└─┘└┴┘└─┘┴└─└─┘┴ ┴└─┘└─┘
      if (_.has(attribute, 'collection')) {
        attribute.collection = attribute.collection.toLowerCase();
      }

      //  ╔╗╔╔═╗╦═╗╔╦╗╔═╗╦  ╦╔═╗╔═╗  ┌┬┐┬ ┬┬─┐┌─┐┬ ┬┌─┐┬ ┬  ┌─┐┌─┐┌─┐┌─┐┌─┐┬┌─┐┌┬┐┬┌─┐┌┐┌
      //  ║║║║ ║╠╦╝║║║╠═╣║  ║╔═╝║╣    │ ├─┤├┬┘│ ││ ││ ┬├─┤  ├─┤└─┐└─┐│ ││  │├─┤ │ ││ ││││
      //  ╝╚╝╚═╝╩╚═╩ ╩╩ ╩╩═╝╩╚═╝╚═╝   ┴ ┴ ┴┴└─└─┘└─┘└─┘┴ ┴  ┴ ┴└─┘└─┘└─┘└─┘┴┴ ┴ ┴ ┴└─┘┘└┘
      //  ┌┬┐┌─┐┬  ┌─┐┬ ┬┌─┐┬─┐┌─┐┌─┐┌─┐┌─┐
      //   │ │ ││  │ ││││├┤ ├┬┘│  ├─┤└─┐├┤
      //   ┴ └─┘┴─┘└─┘└┴┘└─┘┴└─└─┘┴ ┴└─┘└─┘
      if (_.has(attribute, 'through')) {
        attribute.through = attribute.through.toLowerCase();
      }
    }); // </ .each(schema)
  }); // </ .each(collections)


  //  ╦  ╦╔═╗╦  ╦╔╦╗╔═╗╔╦╗╔═╗  ┌─┐┌─┐┬ ┬┌─┐┌┬┐┌─┐  ┌─┐┌─┐┌─┐┌─┐┌─┐┬┌─┐┌┬┐┬┌─┐┌┐┌┌─┐
  //  ╚╗╔╝╠═╣║  ║ ║║╠═╣ ║ ║╣   └─┐│  ├─┤├┤ │││├─┤  ├─┤└─┐└─┐│ ││  │├─┤ │ ││ ││││└─┐
  //   ╚╝ ╩ ╩╩═╝╩═╩╝╩ ╩ ╩ ╚═╝  └─┘└─┘┴ ┴└─┘┴ ┴┴ ┴  ┴ ┴└─┘└─┘└─┘└─┘┴┴ ┴ ┴ ┴└─┘┘└┘└─┘
  // One final pass through the schema for any checks that require inspecting
  // both sides of the association before moving on.
  _.each(schema, function validateSchema(collectionInfo, collectionName) {
    //  ╔═╗╔╦╗╔╦╗╦═╗╦╔╗ ╦ ╦╔╦╗╔═╗  ┬  ┌─┐┌─┐┌─┐┬┌┐┌┌─┐
    //  ╠═╣ ║  ║ ╠╦╝║╠╩╗║ ║ ║ ║╣   │  │ ││ │├─┘│││││ ┬
    //  ╩ ╩ ╩  ╩ ╩╚═╩╚═╝╚═╝ ╩ ╚═╝  ┴─┘└─┘└─┘┴  ┴┘└┘└─┘
    // Process each attribute in the schema individually
    _.each(collectionInfo.schema, function parseAttributes(attributeInfo, attributeName) {
      // Putting `dominant: true` on a plural ("collection") attribute, where that
      // attribute is via-linked in a many-to-one relationship should throw an
      // error because no join table is used.
      if (_.has(attributeInfo, 'collection') && _.has(attributeInfo, 'dominant') && attributeInfo.dominant === true) {
        // Check if there is a `via` defined. If not, error out because dominant
        // has no meaning when using a via-less association. The join table will
        // always be on the same datastore as the model.
        if (!_.has(attributeInfo, 'via')) {
          throw flaverr({ name: 'userError' }, Error('The attribute ' + attributeName + ' on the ' + collectionName + ' model is a via-less collection attribute and has a dominant flag set. This should be removed because the generated join table will always use the datastore used by the model.'));
        }

        // Check the other side of the association and make sure it's not a model
        // association. If so throw an error because dominant has no meaning when
        // a join table is not used.
        var otherSideModel = schema[attributeInfo.collection].attributes;
        var otherSideAttribute = otherSideModel[attributeInfo.via];

        if (_.has(otherSideAttribute, 'model')) {
          throw flaverr({ name: 'userError' }, Error('The attribute ' + attributeName + ' on the ' + collectionName + ' model is a collection attribute that has a dominant flag and is pointing to the ' + attributeInfo.via + ' attribute on the ' + attributeInfo.collection + ' model which is a model association. Dominant is only valid on many to many associations.'));
        }
      }
    });
  });

  // Return the schema
  return schema;
};
