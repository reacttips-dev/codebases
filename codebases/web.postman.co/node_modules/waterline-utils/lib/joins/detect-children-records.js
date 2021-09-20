//  ██████╗ ███████╗████████╗███████╗ ██████╗████████╗     ██████╗██╗  ██╗██╗██╗     ██████╗ ██████╗ ███████╗███╗   ██╗
//  ██╔══██╗██╔════╝╚══██╔══╝██╔════╝██╔════╝╚══██╔══╝    ██╔════╝██║  ██║██║██║     ██╔══██╗██╔══██╗██╔════╝████╗  ██║
//  ██║  ██║█████╗     ██║   █████╗  ██║        ██║       ██║     ███████║██║██║     ██║  ██║██████╔╝█████╗  ██╔██╗ ██║
//  ██║  ██║██╔══╝     ██║   ██╔══╝  ██║        ██║       ██║     ██╔══██║██║██║     ██║  ██║██╔══██╗██╔══╝  ██║╚██╗██║
//  ██████╔╝███████╗   ██║   ███████╗╚██████╗   ██║       ╚██████╗██║  ██║██║███████╗██████╔╝██║  ██║███████╗██║ ╚████║
//  ╚═════╝ ╚══════╝   ╚═╝   ╚══════╝ ╚═════╝   ╚═╝        ╚═════╝╚═╝  ╚═╝╚═╝╚══════╝╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝
//
//  ██████╗ ███████╗ ██████╗ ██████╗ ██████╗ ██████╗ ███████╗
//  ██╔══██╗██╔════╝██╔════╝██╔═══██╗██╔══██╗██╔══██╗██╔════╝
//  ██████╔╝█████╗  ██║     ██║   ██║██████╔╝██║  ██║███████╗
//  ██╔══██╗██╔══╝  ██║     ██║   ██║██╔══██╗██║  ██║╚════██║
//  ██║  ██║███████╗╚██████╗╚██████╔╝██║  ██║██████╔╝███████║
//  ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚══════╝
//
// Given a set of records from a join query, pull out any children records that
// have been added. These are found by checking the namespace used in the SELECT
// statement. For children they are selected using an alias similar to:
//
// SELECT childTable.childColumn as childTable__childColumn
//
// This prevents collisions between column names on the parent and child record.
// It also allows the children to easily be grabbed from the flat record and
// nested. This functions takes a result set from a query that looks like the one
// above and pulls out the children.
//

var util = require('util');
var _ = require('@sailshq/lodash');

module.exports = function detectChildrenRecords(primaryKeyAttr, records) {
  // Hold children records from all the records
  var children = {};

  // Go through each record and pull out any children.
  _.each(records, function searchForChildren(record) {
    // Build a local cache to use for the children of this record
    var cache = {};

    // Find the Primary Key of the record
    var recordPk = record[primaryKeyAttr];
    if (!recordPk) {
      throw new Error('Could not find a primary key for a record. Perhaps it wasn\'t selected in the query. The primary key was set to: ' + primaryKeyAttr + ' and the record returned was: ' + util.inspect(record, false, null));
    }

    // Process each key in the record and build up a child record that can
    // then be nested into the parent.
    _.forIn(record, function checkForChildren(val, key) {
      // Check if the key can be split this on the special alias identifier '__' (two underscores).
      var split = key.split('__');
      if (split.length < 2) {
        return;
      }

      var alias = _.first(split);
      var attribute = _.last(split);

      // Make sure the local cache knows about this child (i.e. the populated alias name - pets).
      if (!_.has(cache, alias)) {
        cache[alias] = {};
      }

      // Add the child value to the cache
      cache[alias][attribute] = val;

      // Remove the child attribute from the parent
      delete record[key];
    });

    // Combine the local cache into the children cache which holds values
    // for all the records.
    _.each(cache, function cacheChild(val, key) {
      if (!_.has(children, key)) {
        children[key] = [];
      }

      // Store the local cache on the top level cache
      children[key] = children[key].concat(cache[key]);
    });
  });

  return {
    parents: _.uniq(records, primaryKeyAttr),
    children: children
  };
};
