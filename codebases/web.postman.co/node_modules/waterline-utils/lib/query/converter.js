//   ██████╗ ██████╗ ███╗   ██╗██╗   ██╗███████╗██████╗ ████████╗███████╗██████╗
//  ██╔════╝██╔═══██╗████╗  ██║██║   ██║██╔════╝██╔══██╗╚══██╔══╝██╔════╝██╔══██╗
//  ██║     ██║   ██║██╔██╗ ██║██║   ██║█████╗  ██████╔╝   ██║   █████╗  ██████╔╝
//  ██║     ██║   ██║██║╚██╗██║╚██╗ ██╔╝██╔══╝  ██╔══██╗   ██║   ██╔══╝  ██╔══██╗
//  ╚██████╗╚██████╔╝██║ ╚████║ ╚████╔╝ ███████╗██║  ██║   ██║   ███████╗██║  ██║
//   ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝
//
// The Converter takes a Waterline query and converts it into a Waterline
// statement. The difference may sound tiny but it's important. The way
// Waterline currently works is that it takes up to four seperate pieces to
// build a query: modelName, method, criteria, and possibly values.
//
// A Waterline statement is an object that encompasses the entire query. It can
// easily be transformed into a native query such as a SQL string or a Mongo
// object. It more closely represents a native query and is much easier to
// validate. Going forward Waterline will move more and more to having end users
// work with statements.

var _ = require('@sailshq/lodash');

module.exports = function convert(options) {
  var model = options.model;
  var method = options.method;
  var criteria = options.criteria;
  var values = options.values;
  var joins = options.joins;
  var opts = options.opts || undefined;

  // Hold the final query value
  var query = {};

  // Validate options
  if (!model) {
    throw new Error('Convert must contain a model to use to build the query.');
  }

  if (!method) {
    throw new Error('Convert must contain a method to use to build the query.');
  }

  // Validate Criteria Input is a dictionary
  if (criteria && !_.isPlainObject(criteria)) {
    throw new Error('Criteria must be a dictionary.');
  }

  // Validate Criteria Input contains a WHERE clause
  if (criteria && _.keys(criteria).length && !_.has(criteria, 'where')) {
    throw new Error('Criteria must contain a WHERE clause.');
  }


  //  ╔╦╗╔═╗╔╦╗╦╔═╗╦╔═╗╦═╗╔═╗
  //  ║║║║ ║ ║║║╠╣ ║║╣ ╠╦╝╚═╗
  //  ╩ ╩╚═╝═╩╝╩╚  ╩╚═╝╩╚═╚═╝

  if (criteria && _.keys(criteria).length) {
    if (_.has(criteria, 'skip')) {
      query.skip = criteria.skip;
    }

    // Sort should be pre-normalized coming from Waterline
    if (_.has(criteria, 'sort')) {
      query.orderBy = criteria.sort;
    }

    if (_.has(criteria, 'limit')) {
      query.limit = criteria.limit;
    }
  }


  //  ╔═╗╦═╗╔═╗╔═╗╔╦╗╔═╗  ╔═╗╔═╗╔═╗╦ ╦
  //  ║  ╠╦╝║╣ ╠═╣ ║ ║╣   ║╣ ╠═╣║  ╠═╣
  //  ╚═╝╩╚═╚═╝╩ ╩ ╩ ╚═╝  ╚═╝╩ ╩╚═╝╩ ╩
  //
  // Process a CREATE EACH query and build a WQL insert query
  var processCreateEach = function processCreateEach() {
    query.into = model;
    query.insert = values || [];

    // Add the opts
    if (opts) {
      query.opts = opts;
    }
  };


  //  ╔═╗╦═╗╔═╗╔═╗╔╦╗╔═╗
  //  ║  ╠╦╝║╣ ╠═╣ ║ ║╣
  //  ╚═╝╩╚═╚═╝╩ ╩ ╩ ╚═╝
  //
  // Process a CREATE query and build a WQL insert query
  var processCreate = function processCreate() {
    query.into = model;
    query.insert = values || {};

    // Add the opts
    if (opts) {
      query.opts = opts;
    }
  };


  //  ╔═╗╦╔╗╔╔╦╗
  //  ╠╣ ║║║║ ║║
  //  ╚  ╩╝╚╝═╩╝
  //
  // Process a FIND or FINDONE query and build a WQL select query.
  var processFind = function processFind(criteria) {
    query.select = criteria.select || [];
    query.from = model;
    query.where = criteria.where || {};

    // If there are any joins add them as well
    if (joins && joins.length) {
      // First be sure to update the select so there are no ambiguous columns
      query.select = _.map(query.select, function remapSelect(key) {
        return model + '.' + key;
      });

      // Ensure values only exist once
      query.select = _.uniq(query.select);

      // Process Joins
      processJoins(joins);
    }

    // Add the opts
    if (opts) {
      query.opts = opts;
    }
  };


  //  ╔╦╗╔═╗╔═╗╔╦╗╦═╗╔═╗╦ ╦
  //   ║║║╣ ╚═╗ ║ ╠╦╝║ ║╚╦╝
  //  ═╩╝╚═╝╚═╝ ╩ ╩╚═╚═╝ ╩
  //
  // Process a DESTROY query and a build a WQL destroy query.
  var processDestroy = function processDestroy(criteria) {
    query.del = true;
    query.from = model;
    query.where = criteria.where || {};

    // Add the opts
    if (opts) {
      query.opts = opts;
    }
  };


  //  ╦ ╦╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║ ║╠═╝ ║║╠═╣ ║ ║╣
  //  ╚═╝╩  ═╩╝╩ ╩ ╩ ╚═╝
  //
  // Process an UPDATE query and a build a WQL update query.
  var processUpdate = function processUpdate(criteria) {
    query.update = values || {};
    query.using = model;
    query.where = criteria.where || {};

    // Add the opts
    if (opts) {
      query.opts = opts;
    }
  };


  //  ╔═╗╦  ╦╔═╗╦═╗╔═╗╔═╗╔═╗
  //  ╠═╣╚╗╔╝║╣ ╠╦╝╠═╣║ ╦║╣
  //  ╩ ╩ ╚╝ ╚═╝╩╚═╩ ╩╚═╝╚═╝
  //
  // Process an AVERAGE aggregation. In WQL you can only average by one field
  // at a time so if the array contains more than one item, throw an error.
  //
  // If any of `skip`, `sort`, or `limit` is used, a table subquery will be
  // created to prevent any weird `groupBy` logic and stick with only returning
  // a single value.
  var processAverage = function processAverage(criteria) {
    query.avg = values || '';

    // Check is a subquery is needed
    (function determineSubQueryUsage() {
      var subQuery = false;
      if (_.has(query, 'skip') || _.has(query, 'sort') || _.has(query, 'limit')) {
        subQuery = true;
      }

      // If no subquery is needed, a simple query statement can be generated
      if (!subQuery) {
        query.from = model;

        // Add a where clause
        if (_.has(criteria, 'where')) {
          query.where = criteria.where || {};
        }

        // Add the opts
        if (opts) {
          query.opts = opts;
        }

        return;
      }

      // Otherwise a subquery must be used
      query.from = {
        select: [values],
        from: model
      };

      // Add the top-level criteria pieces to the sub-query and remove them
      // from the top-level.
      if (_.has(query, 'skip')) {
        query.from.skip = query.skip;
        delete query.skip;
      }

      if (_.has(query, 'limit')) {
        query.from.limit = query.limit;
        delete query.limit;
      }

      if (_.has(query, 'orderBy')) {
        query.from.orderBy = query.orderBy;
        delete query.orderBy;
      }

      // Add a where clause
      if (_.has(criteria, 'where')) {
        query.from.where = criteria.where || {};
      }

      // Add the opts
      if (opts) {
        query.from.opts = opts;
      }

      // Set the "AS" clause so subquery will be run correctly
      query.from.as = 'avg';
    })();
  };


  //  ╔═╗╦ ╦╔╦╗
  //  ╚═╗║ ║║║║
  //  ╚═╝╚═╝╩ ╩
  //
  // Process a SUM aggregation. In WQL you can only sum by one field
  // at a time so if the array contains more than one item, throw an error.
  //
  // If any of `skip`, `sort`, or `limit` is used, a table subquery will be
  // created to prevent any weird `groupBy` logic and stick with only returning
  // a single value.
  var processSum = function processSum(criteria) {
    query.sum = values || '';

    // Check is a subquery is needed
    (function determineSubQueryUsage() {
      var subQuery = false;
      if (_.has(query, 'skip') || _.has(query, 'sort') || _.has(query, 'limit')) {
        subQuery = true;
      }

      // If no subquery is needed, a simple query statement can be generated
      if (!subQuery) {
        query.from = model;

        // Add a where clause
        if (_.has(criteria, 'where')) {
          query.where = criteria.where || {};
        }

        // Add the opts
        if (opts) {
          query.opts = opts;
        }

        return;
      }

      // Otherwise a subquery must be used
      query.from = {
        select: [values],
        from: model
      };

      // Add the top-level criteria pieces to the sub-query and remove them
      // from the top-level.
      if (_.has(query, 'skip')) {
        query.from.skip = query.skip;
        delete query.skip;
      }

      if (_.has(query, 'limit')) {
        query.from.limit = query.limit;
        delete query.limit;
      }

      if (_.has(query, 'orderBy')) {
        query.from.orderBy = query.orderBy;
        delete query.orderBy;
      }

      // Add a where clause
      if (_.has(criteria, 'where')) {
        query.from.where = criteria.where || {};
      }

      // Add the opts
      if (opts) {
        query.from.opts = opts;
      }

      // Set the "AS" clause so subquery will be run correctly
      query.from.as = 'sum';
    })();
  };


  //  ╔═╗╔═╗╦ ╦╔╗╔╔╦╗
  //  ║  ║ ║║ ║║║║ ║
  //  ╚═╝╚═╝╚═╝╝╚╝ ╩
  //
  // Process a COUNT query and a build a WQL count query.
  var processCount = function processCount(criteria) {
    query.count = true;
    query.from = model;
    query.where = criteria.where || {};

    // Add the opts
    if (opts) {
      query.opts = opts;
    }
  };


  //  ╔═╗╦═╗╔═╗╔═╗╔═╗╔═╗╔═╗   ┬┌─┐┬┌┐┌┌─┐
  //  ╠═╝╠╦╝║ ║║  ║╣ ╚═╗╚═╗   ││ │││││└─┐
  //  ╩  ╩╚═╚═╝╚═╝╚═╝╚═╝╚═╝  └┘└─┘┴┘└┘└─┘
  //
  // When a find query contains an instruction set, build up a set of joins for
  // the query to use.
  function processJoins(instructions) {
    // Build an array to hold all the normalized join instructions
    var joins = [];

    _.each(instructions, function processJoinSet(join) {
      var strategy = join.strategy && join.strategy.strategy;
      if (!strategy) {
        throw new Error('Join instructions are missing a valid strategy.');
      }

      _.each(join.instructions, function buildJoin(instructions, idx) {
        var obj = {};
        obj.from = instructions.child + ' as ' + instructions.childAlias;
        obj.on = {};

        // Check the idx and determine which parent to use (in a m:m the parent)
        // will use the alias
        if (idx > 0 || instructions.forceAlias) {
          obj.on[instructions.parentAlias] = instructions.parentKey;
        } else {
          obj.on[instructions.parent] = instructions.parentKey;
        }

        obj.on[instructions.childAlias] = instructions.childKey;

        // If there is a select on the instructions, move the select to the
        // top level and append each item with the child name.
        if (instructions.criteria && instructions.criteria.select && instructions.criteria.select.length) {
          var _select = _.map(instructions.criteria.select, function mapSelect(col) {
            return instructions.childAlias + '.' + col + ' as ' + instructions.alias + '__' + col;
          });

          // Concat the select on the main criteria
          query.select = _.uniq(query.select.concat(_select));
        }

        joins.push(obj);
      });
    });

    query.leftOuterJoin = joins;
  }


  //  ╔╗ ╦ ╦╦╦  ╔╦╗  ╔═╗ ╦ ╦╔═╗╦═╗╦ ╦
  //  ╠╩╗║ ║║║   ║║  ║═╬╗║ ║║╣ ╠╦╝╚╦╝
  //  ╚═╝╚═╝╩╩═╝═╩╝  ╚═╝╚╚═╝╚═╝╩╚═ ╩
  //
  var buildQuery = function buildQuery() {
    // If there was any criteria, process it
    var _criteria = criteria || {};

    switch (method) {
      case 'create':
        processCreate();
        break;

      case 'createEach':
        processCreateEach();
        break;

      case 'find':
      case 'findOne':
        processFind(_criteria);
        break;

      case 'destroy':
        processDestroy(_criteria);
        break;

      case 'update':
        processUpdate(_criteria);
        break;

      case 'avg':
        processAverage(_criteria);
        break;

      case 'sum':
        processSum(_criteria);
        break;

      case 'count':
        processCount(_criteria);
        break;
    }
  };

  // Build the query
  buildQuery();


  // Delete any SKIP 0 clauses
  if (_.has(query.where, 'skip') && query.where.skip === 0) {
    delete query.where.skip;
  }

  // Return the result
  return query;
};
