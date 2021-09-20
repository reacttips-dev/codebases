//   ██████╗ ██╗   ██╗███████╗██████╗ ██╗   ██╗     ██████╗ █████╗  ██████╗██╗  ██╗███████╗
//  ██╔═══██╗██║   ██║██╔════╝██╔══██╗╚██╗ ██╔╝    ██╔════╝██╔══██╗██╔════╝██║  ██║██╔════╝
//  ██║   ██║██║   ██║█████╗  ██████╔╝ ╚████╔╝     ██║     ███████║██║     ███████║█████╗
//  ██║▄▄ ██║██║   ██║██╔══╝  ██╔══██╗  ╚██╔╝      ██║     ██╔══██║██║     ██╔══██║██╔══╝
//  ╚██████╔╝╚██████╔╝███████╗██║  ██║   ██║       ╚██████╗██║  ██║╚██████╗██║  ██║███████╗
//   ╚══▀▀═╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝   ╚═╝        ╚═════╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝
//
// The query cache is used to hold the results of multiple queries. It's used in
// adapters that need to perform multiple queries to fufill a request. This is
// most commonly required when joins are performed with certain keys such as
// skip, sort, or limit. It acts as a mini query heap and provides a way to
// generate nested records that can be returned to the user.
//
// It provides a few methods for working with it:
//
// setParents      - Sets the top level records. These will be returned as an array
//                   whenever the results of the cache are generated.
//
// getParents      - Returns an array of the current parent records.
//
// set             - Adds an instruction set for a parent and children records to
//                   the cache. Each item that is passed in should represent the logic
//                   for connecting an array of children records to a single parent.
//
// extend          - Extends a child cache to add more records. This is called when
//                   multiple queries are run to add more values to an association.
//
// combineRecords  - Responsible for creating a set of nested records where the
//                   parents contain nested children records based on the join
//                   logic set on it's cache item.
//

var _ = require('@sailshq/lodash');

module.exports = function queryCache() {
  // Hold values used to keep track of records internally
  var store = [];
  var parents = [];


  //  ╔═╗╔═╗╔╦╗  ┌─┐┌─┐┬─┐┌─┐┌┐┌┌┬┐┌─┐
  //  ╚═╗║╣  ║   ├─┘├─┤├┬┘├┤ │││ │ └─┐
  //  ╚═╝╚═╝ ╩   ┴  ┴ ┴┴└─└─┘┘└┘ ┴ └─┘
  var setParents = function setParents(values) {
    // Normalize values to an array
    if (!_.isArray(values)) {
      values = [values];
    }

    parents = parents.concat(values);
  };


  //  ╔═╗╔═╗╔╦╗  ┌─┐┌─┐┬─┐┌─┐┌┐┌┌┬┐┌─┐
  //  ║ ╦║╣  ║   ├─┘├─┤├┬┘├┤ │││ │ └─┐
  //  ╚═╝╚═╝ ╩   ┴  ┴ ┴┴└─└─┘┘└┘ ┴ └─┘
  var getParents = function getParents() {
    return parents;
  };


  //  ╔═╗╔═╗╔╦╗  ┌─┐  ┌─┐┬ ┬┬┬  ┌┬┐  ┌─┐┌─┐┌─┐┬ ┬┌─┐
  //  ╚═╗║╣  ║   ├─┤  │  ├─┤││   ││  │  ├─┤│  ├─┤├┤
  //  ╚═╝╚═╝ ╩   ┴ ┴  └─┘┴ ┴┴┴─┘─┴┘  └─┘┴ ┴└─┘┴ ┴└─┘
  var setChildCache = function setChildCache(values) {
    // Normalize values to an array
    if (!_.isArray(values)) {
      values = [values];
    }

    // Remove any records that are all null
    _.each(values, function cleanseRecords(val) {
      _.remove(val.records, function cleanseRecords(record) {
        var empty = true;
        _.each(_.keys(record), function checkRecordKeys(key) {
          if (!_.isNull(record[key])) {
            empty = false;
          }
        });

        return empty;
      });
    });

    _.each(values, function valueParser(val) {
      store.push({
        attrName: val.attrName,
        parentPkAttr: val.parentPkAttr,
        records: val.records || [],
        keyName: val.keyName,
        type: val.type,
        belongsToPkValue: val.belongsToPkValue,

        // Optional (only used if implementing a HAS_FK strategy)
        belongsToFkValue: val.belongsToFkValue
      });
    });
  };


  //  ╔═╗═╗ ╦╔╦╗╔═╗╔╗╔╔╦╗  ┌─┐  ┌─┐┌─┐┌─┐┬ ┬┌─┐  ┬─┐┌─┐┌─┐┌─┐┬─┐┌┬┐
  //  ║╣ ╔╩╦╝ ║ ║╣ ║║║ ║║  ├─┤  │  ├─┤│  ├─┤├┤   ├┬┘├┤ │  │ │├┬┘ ││
  //  ╚═╝╩ ╚═ ╩ ╚═╝╝╚╝═╩╝  ┴ ┴  └─┘┴ ┴└─┘┴ ┴└─┘  ┴└─└─┘└─┘└─┘┴└──┴┘
  // Given a result set from a child query, parse the records and attach them to
  // the correct cache parent.
  var extend = function extend(records, instructions) {
    // Create a local cache to hold the grouped records.
    var localCache = {};

    // Grab the alias being used by the records
    var alias = _.isArray(instructions) ? _.first(instructions).alias : instructions.alias;

    // Process each record grouping them together as needed.
    _.each(records, function processRecord(record) {
      // Hold the child key used to group
      var childKey;

      // If this is not a many-to-many query then just group the records by
      // the child key defined in the instructions. This will be used to
      // determine which cache record they belong to.
      if (!_.isArray(instructions)) {
        childKey = instructions.childKey;

        // Ensure a value in the cache exists for the parent
        if (!_.has(localCache, record[childKey])) {
          localCache[record[childKey]] = [];
        }

        localCache[record[childKey]].push(record);
      }

      // If this IS a many-to-many then there is a bit more to do.
      if (_.isArray(instructions)) {
        // Grab the special "foreign key" we attach and make sure to remove it
        var fk = '_parent_fk';
        var fkValue = record[fk];

        // Ensure a value in the cache exists for the parent
        if (!_.has(localCache, fkValue)) {
          localCache[fkValue] = [];
        }

        // Delete the foreign key value that was added as a part of the join
        // process. It's not a value that the user is interested in.
        delete record[fk];

        // Ensure the record is valid and not made up of all `null` values
        var values = _.uniq(_.values(record));
        if (values.length < 2 && _.isNull(values[0])) {
          return;
        }

        // Add the record to the local cache
        localCache[fkValue].push(record);

        // Ensure there aren't duplicates in here
        localCache[fkValue] = _.uniq(localCache[fkValue], _.last(instructions).childKey);
      }
    });

    // Find the cached parents for this alias
    var cachedParents = _.filter(store, { attrName: alias });

    // Extend the parent cache with the child records related to them
    _.each(cachedParents, function extendCache(parent) {
      var childRecords = localCache[parent.belongsToPkValue];

      // If there are no child records, there is nothing to do
      if (!childRecords || !childRecords.length) {
        return;
      }

      if (!parent.records) {
        parent.records = [];
      }

      parent.records = parent.records.concat(childRecords);
    });
  };


  //  ╔═╗╔═╗╔╦╗╔╗ ╦╔╗╔╔═╗  ┬─┐┌─┐┌─┐┌─┐┬─┐┌┬┐┌─┐
  //  ║  ║ ║║║║╠╩╗║║║║║╣   ├┬┘├┤ │  │ │├┬┘ ││└─┐
  //  ╚═╝╚═╝╩ ╩╚═╝╩╝╚╝╚═╝  ┴└─└─┘└─┘└─┘┴└──┴┘└─┘
  // Use the values in the query cache to output a set of nested dictionaries.
  // Each item in the set represents a parent and all the nested children records.
  var combineRecords = function combineRecords() {

    // If there are no parents then the results are always empty
    if (!parents.length) {
      return [];
    }

    // If there are no children records being populated, just return the parents.
    if (!store.length) {
      return parents;
    }

    // For each child in the cache, attach it to the parent
    _.each(store, function attachChildren(cache) {
      // Find the parent for this cache item
      var matchingParentRecord = _.find(parents, function match(parentRecord) {
        return parentRecord[cache.parentPkAttr] === cache.belongsToPkValue;
      });

      // This should always be true, but checking just in case.
      if (_.isObject(matchingParentRecord)) {
        // If the value in `attrName` for this record is not an array,
        // it is probably a foreign key value.  Fortunately, at this point
        // we can go ahead and replace it safely since any logic relying on it
        // is complete.
        //
        // In fact, and for the same reason, we can safely override the value of
        // `buffer.attrName` for the parent record at this point, no matter what!
        // This is nice, because `buffer.records` is already sorted, limited, and
        // skipped, so we don't have to mess with that.
        //
        if (cache.records && cache.records.length) {
          matchingParentRecord[cache.keyName] = _.map(cache.records, _.clone);
        } else {
          matchingParentRecord[cache.keyName] = [];
        }

        // Check if the value should be an array or dictionary
        if (_.has(cache, 'type') && cache.type === 1) {
          matchingParentRecord[cache.keyName] = _.first(matchingParentRecord[cache.keyName]) || [];
        }
      }
    });

    // Collect all the aliases used by the query and ensure the nested objects
    // have a value for it.
    var aliases = _.uniq(_.map(store, 'keyName'));

    _.each(aliases, function normalizeAlias(alias) {
      _.each(parents, function setParentAlias(parentRecord) {
        parentRecord[alias] = parentRecord[alias] || [];
      });
    });

    return parents;
  };


  return {
    setParents: setParents,
    getParents: getParents,
    set: setChildCache,
    extend: extend,
    combineRecords: combineRecords
  };
};
