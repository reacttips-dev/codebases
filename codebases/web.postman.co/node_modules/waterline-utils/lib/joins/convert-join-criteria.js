//   ██████╗ ██████╗ ███╗   ██╗██╗   ██╗███████╗██████╗ ████████╗         ██╗ ██████╗ ██╗███╗   ██╗
//  ██╔════╝██╔═══██╗████╗  ██║██║   ██║██╔════╝██╔══██╗╚══██╔══╝         ██║██╔═══██╗██║████╗  ██║
//  ██║     ██║   ██║██╔██╗ ██║██║   ██║█████╗  ██████╔╝   ██║            ██║██║   ██║██║██╔██╗ ██║
//  ██║     ██║   ██║██║╚██╗██║╚██╗ ██╔╝██╔══╝  ██╔══██╗   ██║       ██   ██║██║   ██║██║██║╚██╗██║
//  ╚██████╗╚██████╔╝██║ ╚████║ ╚████╔╝ ███████╗██║  ██║   ██║       ╚█████╔╝╚██████╔╝██║██║ ╚████║
//   ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝   ╚═╝        ╚════╝  ╚═════╝ ╚═╝╚═╝  ╚═══╝
//
//   ██████╗██████╗ ██╗████████╗███████╗██████╗ ██╗ █████╗
//  ██╔════╝██╔══██╗██║╚══██╔══╝██╔════╝██╔══██╗██║██╔══██╗
//  ██║     ██████╔╝██║   ██║   █████╗  ██████╔╝██║███████║
//  ██║     ██╔══██╗██║   ██║   ██╔══╝  ██╔══██╗██║██╔══██║
//  ╚██████╗██║  ██║██║   ██║   ███████╗██║  ██║██║██║  ██║
//   ╚═════╝╚═╝  ╚═╝╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝
//
// Given some Waterline criteria, inspect it for any joins and determine how
// to go about building up queries. If the joins don't contain any criteria
// or any skip, sort, or limit clauses then a single query can be built.
// Otherwise the first query will need to be run and then using the primary
// key of the "parent" build up a child query. This child query will be either
// an IN query using a map of the parent's primary key or a big UNION query.
// The UNION query is used in situations where you are basically filtering
// the child results. It's a rare case and will result in a non-ideal query
// but is supported in the Waterline API.
//
// EX: In the following case the UNION query will run the query specific to
// each user that is found.`
//
// Model.find()
// .populate('pets', { type: 'cat', sort: 'name', limit: 5 })
// .exec()
//

var _ = require('@sailshq/lodash');
var Helpers = require('./private');
var Converter = require('../query/converter');

module.exports = function convertCriteria(options) {
  //  ╦  ╦╔═╗╦  ╦╔╦╗╔═╗╔╦╗╔═╗  ┌─┐┌─┐┌┬┐┬┌─┐┌┐┌┌─┐
  //  ╚╗╔╝╠═╣║  ║ ║║╠═╣ ║ ║╣   │ │├─┘ │ ││ ││││└─┐
  //   ╚╝ ╩ ╩╩═╝╩═╩╝╩ ╩ ╩ ╚═╝  └─┘┴   ┴ ┴└─┘┘└┘└─┘
  if (_.isUndefined(options) || !_.isPlainObject(options)) {
    throw new Error('Invalid options argument. Options must contain: tableName, schemaName, getPk, and criteria.');
  }

  if (!_.has(options, 'query') || !_.isPlainObject(options.query)) {
    throw new Error('Invalid option used in options argument. Missing or invalid query.');
  }

  if (!_.has(options, 'getPk') || !_.isFunction(options.getPk)) {
    throw new Error('Invalid option used in options argument. Missing or invalid getPk function.');
  }

  // Store the validated options for use
  var query = options.query;
  var schemaName = options.schemaName;
  var getPk = options.getPk;


  // Add a statement var that will be used to build up a Waterline Statement
  // from the criteria.
  var parentStatement;
  var childStatements = [];

  // Add a flag to determine if this query will need to be a slow join or not.
  var slowJoin = false;

  //  ╔╗╔╔═╗   ┬┌─┐┬┌┐┌┌─┐
  //  ║║║║ ║   ││ │││││└─┐
  //  ╝╚╝╚═╝  └┘└─┘┴┘└┘└─┘
  // If the criteria has no join instructions go ahead and build a very simple
  // statement then bail out. Nothing fancy to do here.
  if (!_.has(query, 'joins')) {
    try {
      (function buildUpConvertCriteria() {
        var convertObj = {
          model: query.using,
          method: 'find',
          criteria: query.criteria
        };

        if (schemaName) {
          convertObj.opts = {
            schema: schemaName
          };
        }

        parentStatement = Converter(convertObj);
      })();
    } catch (e) {
      throw new Error('There was an error converting the Waterline Query into a Waterline Statement: ' + e.message);
    }

    return {
      parentStatement: parentStatement
    };
  }


  //  ╔═╗╦  ╔═╗╔╗╔  ┌─┐ ┬ ┬┌─┐┬─┐┬ ┬
  //  ╠═╝║  ╠═╣║║║  │─┼┐│ │├┤ ├┬┘└┬┘
  //  ╩  ╩═╝╩ ╩╝╚╝  └─┘└└─┘└─┘┴└─ ┴
  // If there ARE joins, replace the criteria with the planned instructions. These
  // are instructions that have been expanded to include the normalized join
  // strategy.
  var instructions = Helpers.planner({
    joins: query.joins,
    getPk: getPk
  });


  //  ╔═╗╦ ╦╔═╗╔═╗╦╔═  ┌─┐┌─┐┬─┐  ┌─┐┬  ┌─┐┬ ┬   ┬┌─┐┬┌┐┌
  //  ║  ╠═╣║╣ ║  ╠╩╗  ├┤ │ │├┬┘  └─┐│  │ ││││   ││ │││││
  //  ╚═╝╩ ╩╚═╝╚═╝╩ ╩  └  └─┘┴└─  └─┘┴─┘└─┘└┴┘  └┘└─┘┴┘└┘
  // Go through and check if any of the join instructions are
  // using any sort of criteria. If not, build up a single statement.
  //
  // When criteria is used on a join (populate) it complicates things. Based on
  // the way populates work in Waterline, criteria on the population is used
  // as a filter on the children and not the parents. Because of this the criteria
  // can't simply be added into the query. This is called a slow join because it
  // can't be fulfilled in a single query, it must be run in two queries. The
  // first query finds all the matching parent records and the second query finds
  // the records being populated along with the given criteria.

  // Hold an array of population aliases that can't be run in a single query
  var slowJoinAliases = [];

  // Hold a map of joins that will be needed. If two joins need the same data
  // but are connected in different ways then there will be some slow joins
  // needed. This is used when you have a model that has multiple collection
  // attributes pointing to the same model but using different `via` attributes.
  // See below for more information.
  var joinMaps = {};

  // Hold the maximum integer size
  var maxInt = Number.MAX_SAFE_INTEGER || 9007199254740991;

  _.each(instructions, function processJoins(val, key) {
    // If the join has a type 1 strategy it will never be a slow join
    if (val.strategy && val.strategy.strategy === 1) {
      return;
    }

    // Process each instruction for the aliases being populated
    _.each(val.instructions, function checkForCriteria(joinSet) {
      //  ╔═╗╦ ╦╔═╗╔═╗╦╔═  ┌─┐┌─┐┬─┐  ┌─┐┌─┐┬─┐┌─┐┌┐┌┌┬┐  ┌─┐┬  ┌─┐┬ ┬   ┬┌─┐┬┌┐┌
      //  ║  ╠═╣║╣ ║  ╠╩╗  ├┤ │ │├┬┘  ├─┘├─┤├┬┘├┤ │││ │   └─┐│  │ ││││   ││ │││││
      //  ╚═╝╩ ╩╚═╝╚═╝╩ ╩  └  └─┘┴└─  ┴  ┴ ┴┴└─└─┘┘└┘ ┴   └─┘┴─┘└─┘└┴┘  └┘└─┘┴┘└┘
      // If the parent criteria contains a SKIP or LIMIT then all the populates in
      // the query will need to be slow joins.
      if (_.has(query.criteria, 'skip') && query.criteria.skip > 0) {
        slowJoin = true;
        slowJoinAliases.push(key);
        return;
      }

      if (_.has(query.criteria, 'limit') && query.criteria.limit < maxInt) {
        slowJoin = true;
        slowJoinAliases.push(key);
        return;
      }

      // Check if the tables in this have already been joined in some way. If
      // so, then a slow join is needed to fufill any further requests. This is
      // commonly used when a parent is populating multiple attributes from the
      // same table. See the multiple foreign keys test from Waterline-Adapter-Tests.
      if (_.has(joinMaps, joinSet.child) && joinMaps[joinSet.child] !== joinSet.childKey) {
        slowJoin = true;
        slowJoinAliases.push(key);
        return;
      }

      // Add this join to the mapping
      joinMaps[joinSet.child] = joinSet.childKey;

      // If there isn't any criteria set there is no need to make this a slowJoin
      if (!_.has(joinSet, 'criteria')) {
        return;
      }

      // If there is an empty criteria object set, no need to make this a slowJoin
      if (_.keys(joinSet.criteria).length === 0) {
        return;
      }

      // Check for SLOW JOIN criteria keys (skip, limit, and where) and make
      // sure if they are set that they aren't the "base" values set by Waterline.
      if (_.has(joinSet.criteria, 'limit')) {
        if (joinSet.criteria.limit === maxInt) {
          delete joinSet.criteria.limit;
        }
      }

      if (_.has(joinSet.criteria, 'skip')) {
        if (joinSet.criteria.skip === 0) {
          delete joinSet.criteria.skip;
        }
      }

      if (_.has(joinSet.criteria, 'where')) {
        if (_.keys(joinSet.criteria.where).length === 0) {
          delete joinSet.criteria.where;
        }
      }

      // If there are still skip and limits attached, this is a slow join
      if (_.has(joinSet.criteria, 'sort') || _.has(joinSet.criteria, 'limit') || _.has(joinSet.criteria, 'skip') || _.has(joinSet.criteria, 'where')) {
        slowJoin = true;
        slowJoinAliases.push(key);
      }
    });
  });

  // Ensure that the slowJoinAliases array is made up of unique aliases
  slowJoinAliases = _.uniq(slowJoinAliases);


  //  ╔╗ ╦ ╦╦╦  ╔╦╗   ┬┌─┐┬┌┐┌  ┌─┐┌┬┐┌─┐┌┬┐┌─┐┌┬┐┌─┐┌┐┌┌┬┐
  //  ╠╩╗║ ║║║   ║║   ││ │││││  └─┐ │ ├─┤ │ ├┤ │││├┤ │││ │
  //  ╚═╝╚═╝╩╩═╝═╩╝  └┘└─┘┴┘└┘  └─┘ ┴ ┴ ┴ ┴ └─┘┴ ┴└─┘┘└┘ ┴
  // If there wasn't a slow join found go ahead and try and build a statement.
  // This is a query that can be executed in a single run. These will be the
  // fastest and take the least amount of time to run.
  if (!slowJoin) {
    var instructionArray = _.map(_.keys(instructions), function parseAlias(alias) {
      return instructions[alias];
    });

    // Try and convert the criteria into a Waterline Statement
    try {
      (function buildUpConvertCriteria() {
        var convertObj = {
          model: query.using,
          method: 'find',
          criteria: query.criteria,
          joins: instructionArray,
        };

        if (schemaName) {
          convertObj.opts = {
            schema: schemaName
          };
        }

        parentStatement = Converter(convertObj);
      })();
    } catch (e) {
      throw new Error('There was an error converting the Waterline Query into a Waterline Statement: ' + e.message);
    }

    // After check if this is a type 3 join. The VIA_JUNCTOR queries need a way
    // to link parent and child records together without holding all the additional
    // join table records in memory. To do this we add a special SELECT statement
    // to the criteria instructions. This allows the child records to appear
    // as if they were simple hasMany records.
    _.each(instructionArray, function checkStrategy(val) {
      if (val.strategy.strategy !== 3) {
        return;
      }

      // Otherwise modify the SELECT and add a special key
      var junctor = _.first(val.instructions);
      var child = _.last(val.instructions);

      // The "special" key is simply a reserved word `__parent_fk` that can easily
      // be parsed out of the results. It contains the value that was found in
      // the join table that links it to the parent.
      var selectStr = junctor.childAlias + '.' + junctor.childKey + ' as ' + child.alias + '___parent_fk';
      parentStatement.select.push(selectStr);
    });

    // Expand the criteria so it doesn't contain any ambiguous fields
    try {
      parentStatement.where = Helpers.expandCriteria(parentStatement.where, query.using);
    } catch (e) {
      throw new Error('There was an error trying to expand the criteria used in the WHERE clause. Perhaps it is invalid? ' + e.stack);
    }

    return {
      parentStatement: parentStatement,
      instructions: instructions
    };
  }


  //  ╔╗ ╦ ╦╦╦  ╔╦╗  ┌─┐┬  ┌─┐┬ ┬  ┌─┐┌─┐┬─┐┌─┐┌┐┌┌┬┐  ┌─┐ ┬ ┬┌─┐┬─┐┬ ┬
  //  ╠╩╗║ ║║║   ║║  └─┐│  │ ││││  ├─┘├─┤├┬┘├┤ │││ │   │─┼┐│ │├┤ ├┬┘└┬┘
  //  ╚═╝╚═╝╩╩═╝═╩╝  └─┘┴─┘└─┘└┴┘  ┴  ┴ ┴┴└─└─┘┘└┘ ┴   └─┘└└─┘└─┘┴└─ ┴
  // Otherwise build up a statement for the "parent" query. This is just a
  // statement with all the join instructions stripped out from it.
  //
  // It's responsibility is to get the parent's primary keys that can be used
  // in another query to fufill the request. These are much slower.
  var fastJoinInstructionArray;
  var fastInstructions = _.extend({}, instructions);
  try {
    // Take the instructions and remove any aliases that need to be run using a
    // slow join. Whatever is left should be able to be run in a single query.
    _.each(slowJoinAliases, function removeSlowJoinAliases(alias) {
      delete fastInstructions[alias];
    });

    // Normalize the instructions array
    fastJoinInstructionArray = _.map(_.keys(fastInstructions), function parseAlias(alias) {
      return instructions[alias];
    });

    (function buildUpConvertCriteria() {
      var convertObj = {
        model: query.using,
        method: 'find',
        criteria: query.criteria,
        joins: fastJoinInstructionArray
      };

      if (schemaName) {
        convertObj.opts = {
          schema: schemaName
        };
      }

      parentStatement = Converter(convertObj);
    })();
  } catch (e) {
    throw new Error('There was an error converting the Waterline Query into a Waterline Statement. ' + e.stack);
  }

  // After check if this is a type 3 join. The VIA_JUNCTOR queries need a way
  // to link parent and child records together without holding all the additional
  // join table records in memory. To do this we add a special SELECT statement
  // to the criteria instructions. This allows the child records to appear
  // as if they were simple hasMany records.
  _.each(fastJoinInstructionArray, function checkStrategy(val) {
    if (val.strategy.strategy !== 3) {
      return;
    }

    // Otherwise modify the SELECT and add a special key
    var junctor = _.first(val.instructions);
    var child = _.last(val.instructions);

    // The "special" key is simply a reserved word `__parent_fk` that can easily
    // be parsed out of the results. It contains the value that was found in
    // the join table that links it to the parent.
    var selectStr = junctor.childAlias + '.' + junctor.childKey + ' as ' + child.alias + '___parent_fk';
    parentStatement.select.push(selectStr);
  });

  // Expand the criteria so it doesn't contain any ambiguous fields
  try {
    parentStatement.where = Helpers.expandCriteria(parentStatement.where, query.using);
  } catch (e) {
    throw new Error('There was an error trying to expand the criteria used in the WHERE clause. Perhaps it is invalid? ' + e.stack);
  }


  //  ╔╗ ╦ ╦╦╦  ╔╦╗  ┌─┐┬  ┌─┐┬ ┬  ┌─┐┬ ┬┬┬  ┌┬┐  ┌─┐ ┬ ┬┌─┐┬─┐┬ ┬
  //  ╠╩╗║ ║║║   ║║  └─┐│  │ ││││  │  ├─┤││   ││  │─┼┐│ │├┤ ├┬┘└┬┘
  //  ╚═╝╚═╝╩╩═╝═╩╝  └─┘┴─┘└─┘└┴┘  └─┘┴ ┴┴┴─┘─┴┘  └─┘└└─┘└─┘┴└─ ┴
  //  ┌┬┐┌─┐┌┬┐┌─┐┬  ┌─┐┌┬┐┌─┐
  //   │ ├┤ │││├─┘│  ├─┤ │ ├┤
  //   ┴ └─┘┴ ┴┴  ┴─┘┴ ┴ ┴ └─┘
  // This is a template that will be used for the children queries. It will be
  // formed based upon the type of query being run and the strategy used.
  //
  // The template is simply a placeholder that represents what query will be need
  // to be run to find the child. It contains a placeholder value that can't be
  // generated until the parent query has finished.
  //
  // Once a parent query has been run the child template can be rendered and then
  // run through as a native query to get the remaining results.
  _.each(slowJoinAliases, function buildJoinTemplate(alias) {
    // Grab the join instructions
    var _instructions = instructions[alias];

    // Grab the strategy type off the instructions
    var strategy = _instructions.strategy.strategy;

    // Hold the generated statement template
    var statement;

    // Hold the primary key attribute to use for the template
    var primaryKeyAttr;

    // Hold an empty template for the where criteria that will be built as a
    // stand in. This will be editied to contain the primary keys of the parent
    // query results.
    var whereTemplate = {};

    // Grab the parent instructions
    var parentInstructions = _.first(_instructions.instructions);

    // Clean up any default join criteria that would have a bearing on how the
    // query gets built.
    if (_.has(parentInstructions.criteria, 'skip') && parentInstructions.criteria.skip === 0) {
      delete parentInstructions.criteria.skip;
    }

    if (_.has(parentInstructions.criteria, 'limit') && parentInstructions.criteria.limit === maxInt) {
      delete parentInstructions.criteria.limit;
    }

    // Check if the child result will be paginated
    var paginated = _.get(parentInstructions.criteria, 'skip', 0) !== 0 || _.get(parentInstructions.criteria, 'limit', Number.MAX_SAFE_INTEGER) !== Number.MAX_SAFE_INTEGER;

    //  ╔═╗╔═╗╔╗╔╔═╗╦═╗╔═╗╔╦╗╔═╗  ┌┐┌┌─┐┌┐┌   ┌─┐┌─┐┌─┐┬┌┐┌┌─┐┌┬┐┌─┐┌┬┐
    //  ║ ╦║╣ ║║║║╣ ╠╦╝╠═╣ ║ ║╣   ││││ ││││───├─┘├─┤│ ┬││││├─┤ │ ├┤  ││
    //  ╚═╝╚═╝╝╚╝╚═╝╩╚═╩ ╩ ╩ ╚═╝  ┘└┘└─┘┘└┘   ┴  ┴ ┴└─┘┴┘└┘┴ ┴ ┴ └─┘─┴┘
    //  ┌┬┐┬ ┬┌─┐┌─┐  ┌┬┐┬ ┬┌─┐   ┬┌─┐┬┌┐┌  ┌┬┐┌─┐┌┬┐┌─┐┬  ┌─┐┌┬┐┌─┐
    //   │ └┬┘├─┘├┤    │ ││││ │   ││ │││││   │ ├┤ │││├─┘│  ├─┤ │ ├┤
    //   ┴  ┴ ┴  └─┘   ┴ └┴┘└─┘  └┘└─┘┴┘└┘   ┴ └─┘┴ ┴┴  ┴─┘┴ ┴ ┴ └─┘
    // If the join isn't using a join table and there isn't a `skip` or `limit`
    // criteria, a simple IN query can be built.
    if (strategy === 2 && !paginated) {
      (function generateTemplate() {
        // Ensure the criteria has a WHERE clause to make it valid
        if (!_.has(parentInstructions.criteria, 'where')) {
          parentInstructions.criteria.where = {};
        }

        // Convert the query to a statement
        try {
          (function buildUpConvertCriteria() {
            var convertObj = {
              model: parentInstructions.child + ' as ' + parentInstructions.childAlias,
              method: 'find',
              criteria: parentInstructions.criteria
            };

            if (schemaName) {
              convertObj.opts = {
                schema: schemaName
              };
            }

            statement = Converter(convertObj);
          })();
        } catch (e) {
          throw new Error('There was an error converting the Waterline Query into a Waterline Statement. ' + e.stack);
        }

        // Mixin the select from the top level instructions
        statement.select = parentInstructions.criteria.select;

        // Add in a WHERE IN template that can be rendered before compiling the
        // statement to include the primary keys of the parent.
        // This gives you a query like the following example:
        //
        // SELECT user.id from pet where pet.user_id IN [1,2,3,4];
        try {
          primaryKeyAttr = getPk(parentInstructions.child);
        } catch (e) {
          throw new Error('There was an issue getting the primary key attribute from ' + parentInstructions.child + ' are ' +
          'you sure the getPk function is working correctly? It should accept a single argument which reperents the ' +
          'tableName and should return a string of the column name that is set as the primary key of the table. \n\n' + e.stack);
        }

        // Build an IN template
        whereTemplate[parentInstructions.childAlias + '.' + parentInstructions.childKey] = {
          in: []
        };

        statement.where = statement.where || {};
        statement.where.and = statement.where.and || [];
        statement.where.and.push(whereTemplate);

        // Add the statement to the childStatements array
        childStatements.push({
          queryType: 'in',
          primaryKeyAttr: primaryKeyAttr,
          statement: statement,
          instructions: parentInstructions,
          alias: alias
        });
      })();
    }


    //  ╔═╗╔═╗╔╗╔╔═╗╦═╗╔═╗╔╦╗╔═╗  ┌─┐┌─┐┌─┐┬┌┐┌┌─┐┌┬┐┌─┐┌┬┐
    //  ║ ╦║╣ ║║║║╣ ╠╦╝╠═╣ ║ ║╣   ├─┘├─┤│ ┬││││├─┤ │ ├┤  ││
    //  ╚═╝╚═╝╝╚╝╚═╝╩╚═╩ ╩ ╩ ╚═╝  ┴  ┴ ┴└─┘┴┘└┘┴ ┴ ┴ └─┘─┴┘
    //  ┌┬┐┬ ┬┌─┐┌─┐  ┌┬┐┬ ┬┌─┐   ┬┌─┐┬┌┐┌  ┌┬┐┌─┐┌┬┐┌─┐┬  ┌─┐┌┬┐┌─┐
    //   │ └┬┘├─┘├┤    │ ││││ │   ││ │││││   │ ├┤ │││├─┘│  ├─┤ │ ├┤
    //   ┴  ┴ ┴  └─┘   ┴ └┴┘└─┘  └┘└─┘┴┘└┘   ┴ └─┘┴ ┴┴  ┴─┘┴ ┴ ┴ └─┘
    // If the join isn't using a join table but IS paginated then a big union query
    // will need to be generated. Generate a template for what a single piece of
    // the UNION ALL query will look like.
    if (strategy === 2 && paginated) {
      (function generateTemplate() {
        // Ensure the criteria has a WHERE clause to make it valid
        if (!_.has(parentInstructions.criteria, 'where')) {
          parentInstructions.criteria.where = {};
        }

        try {
          (function buildUpConvertCriteria() {
            var convertObj = {
              model: parentInstructions.child + ' as ' + parentInstructions.childAlias,
              method: 'find',
              criteria: parentInstructions.criteria
            };

            if (schemaName) {
              convertObj.opts = {
                schema: schemaName
              };
            }

            statement = Converter(convertObj);
          })();
        } catch (e) {
          throw new Error('There was an error converting the Waterline Query into a Waterline Statement.' + e.stack);
        }

        // Mixin the select from the top level instructions
        statement.select = parentInstructions.criteria.select;

        try {
          primaryKeyAttr = getPk(parentInstructions.child);
        } catch (e) {
          throw new Error('There was an issue getting the primary key attribute from ' + parentInstructions.child + ' are ' +
          'you sure the getPk function is working correctly? It should accept a single argument which reperents the ' +
          'tableName and should return a string of the column name that is set as the primary key of the table. \n\n' + e.stack);
        }

        // When using the UNION ALL type queries each query needs a where clause that
        // matches a single parent's primary key value. Use a ? for now and replace
        // it later with a real value.
        whereTemplate[parentInstructions.childAlias + '.' + parentInstructions.childKey] = '?';

        statement.where = statement.where || {};
        statement.where.and = statement.where.and || [];
        statement.where.and.push(whereTemplate);

        childStatements.push({
          queryType: 'union',
          primaryKeyAttr: primaryKeyAttr,
          statement: statement,
          instructions: parentInstructions,
          alias: alias
        });
      })();
    }


    // If the joins are using a join table then the statement template will need
    // the additional leftOuterJoin piece.

    // Grab the parent instructions
    var childInstructions = _.last(_instructions.instructions);

    // Check if the child is paginated
    var childPaginated = _.has(childInstructions.criteria, 'skip') || _.has(childInstructions.criteria, 'limit');

    // Ensure the criteria has a WHERE clause to make it valid
    if (!_.has(childInstructions.criteria, 'where')) {
      childInstructions.criteria.where = {};
    }

    // Ensure that child criteria are namespaced to the child alias, to avoid collisions
    // with fields in the join table (most likely `id`).
    childInstructions.criteria.where = (function disambiguate(obj) {
      return _.reduce(obj, function(memo, val, key) {
        if (key === 'and' || key === 'or') {
          memo[key] = _.map(val, disambiguate);
        }
        else {
          memo[childInstructions.childAlias + '.' + key] = val;
        }
        return memo;
      }, {});
    })(childInstructions.criteria.where);



    //  ╔═╗╔═╗╔╗╔╔═╗╦═╗╔═╗╔╦╗╔═╗  ┌┐┌┌─┐┌┐┌   ┌─┐┌─┐┌─┐┬┌┐┌┌─┐┌┬┐┌─┐┌┬┐
    //  ║ ╦║╣ ║║║║╣ ╠╦╝╠═╣ ║ ║╣   ││││ ││││───├─┘├─┤│ ┬││││├─┤ │ ├┤  ││
    //  ╚═╝╚═╝╝╚╝╚═╝╩╚═╩ ╩ ╩ ╚═╝  ┘└┘└─┘┘└┘   ┴  ┴ ┴└─┘┴┘└┘┴ ┴ ┴ └─┘─┴┘
    //  ┌┬┐┬ ┬┌─┐┌─┐  ┌┬┐┬ ┬┬─┐┌─┐┌─┐   ┬┌─┐┬┌┐┌  ┌┬┐┌─┐┌┬┐┌─┐┬  ┌─┐┌┬┐┌─┐
    //   │ └┬┘├─┘├┤    │ ├─┤├┬┘├┤ ├┤    ││ │││││   │ ├┤ │││├─┘│  ├─┤ │ ├┤
    //   ┴  ┴ ┴  └─┘   ┴ ┴ ┴┴└─└─┘└─┘  └┘└─┘┴┘└┘   ┴ └─┘┴ ┴┴  ┴─┘┴ ┴ ┴ └─┘
    // If the join criteria isn't paginated an IN query can be used.
    if (strategy === 3 && !childPaginated) {
      (function generateTemplate() {

        // The WHERE IN template for many to many queries is a little bit different.
        // Instead of using the primary key of the parent the parent key of the
        // join table is used.
        whereTemplate[parentInstructions.childAlias + '.' + parentInstructions.childKey] = {
          in: []
        };

        var modifiedInstructions =  _.merge({}, _instructions);
        modifiedInstructions.instructions = [childInstructions];
        _.first(modifiedInstructions.instructions).forceAlias = true;

        // Convert the query to a statement
        try {
          (function buildUpConvertCriteria() {
            var convertObj = {
              model: parentInstructions.child + ' as ' + parentInstructions.childAlias,
              method: 'find',
              criteria: childInstructions.criteria,
              joins: [modifiedInstructions]
            };

            if (schemaName) {
              convertObj.opts = {
                schema: schemaName
              };
            }

            statement = Converter(convertObj);
          })();
        } catch (e) {
          throw new Error('There was an error converting the Waterline Query into a Waterline Statement. ' + e.stack);
        }

        // Mixin the select from the top level instructions and make sure the correct
        // table name is prepended to it.
        statement.select = _.map(childInstructions.criteria.select, function normalizeSelect(column) {
          return childInstructions.childAlias + '.' + column;
        });

        // Mixin the Where IN template logic
        statement.where = statement.where || {};
        statement.where.and = statement.where.and || [];
        statement.where.and.push(whereTemplate);

        // Add in the generated foriegn key select value so the records can be
        // nested together correctly.
        var selectStr = parentInstructions.childAlias + '.' + parentInstructions.childKey + ' as _parent_fk';
        statement.select.push(selectStr);

        // Add the statement to the childStatements array
        childStatements.push({
          queryType: 'in',
          statement: statement,
          instructions: [parentInstructions, childInstructions],
          alias: alias
        });
      })();
    }


    //  ╔═╗╔═╗╔╗╔╔═╗╦═╗╔═╗╔╦╗╔═╗  ┌─┐┌─┐┌─┐┬┌┐┌┌─┐┌┬┐┌─┐┌┬┐
    //  ║ ╦║╣ ║║║║╣ ╠╦╝╠═╣ ║ ║╣   ├─┘├─┤│ ┬││││├─┤ │ ├┤  ││
    //  ╚═╝╚═╝╝╚╝╚═╝╩╚═╩ ╩ ╩ ╚═╝  ┴  ┴ ┴└─┘┴┘└┘┴ ┴ ┴ └─┘─┴┘
    //  ┌┬┐┬ ┬┌─┐┌─┐  ┌┬┐┬ ┬┬─┐┌─┐┌─┐   ┬┌─┐┬┌┐┌  ┌┬┐┌─┐┌┬┐┌─┐┬  ┌─┐┌┬┐┌─┐
    //   │ └┬┘├─┘├┤    │ ├─┤├┬┘├┤ ├┤    ││ │││││   │ ├┤ │││├─┘│  ├─┤ │ ├┤
    //   ┴  ┴ ┴  └─┘   ┴ ┴ ┴┴└─└─┘└─┘  └┘└─┘┴┘└┘   ┴ └─┘┴ ┴┴  ┴─┘┴ ┴ ┴ └─┘
    // If the join criteria is paginated a very complex and slow UNION ALL query
    // must be built.
    if (strategy === 3 && childPaginated) {
      (function generateTemplate() {

        var modifiedInstructions =  _.merge({}, _instructions);
        modifiedInstructions.instructions = [childInstructions];
        _.first(modifiedInstructions.instructions).forceAlias = true;

        try {
          (function buildUpConvertCriteria() {
            var convertObj = {
              model: parentInstructions.child + ' as ' + parentInstructions.childAlias,
              method: 'find',
              criteria: childInstructions.criteria,
              joins: [modifiedInstructions]
            };

            if (schemaName) {
              convertObj.opts = {
                schema: schemaName
              };
            }

            statement = Converter(convertObj);
          })();
        } catch (e) {
          throw new Error('There was an error converting the Waterline Query into a Waterline Statement.' + e.stack);
        }

        // When using the UNION ALL type queries each query needs a where clause that
        // matches a single parent's primary key value. Use a ? for now and replace
        // it later with a real value.
        whereTemplate[parentInstructions.childAlias + '.' + parentInstructions.childKey] = '?';

        // Mixin the select from the top level instructions and make sure the correct
        // table name is prepended to it.
        statement.select = _.map(childInstructions.criteria.select, function normalizeSelect(column) {
          return childInstructions.childAlias + '.' + column;
        });

        // Mixin the Where IN template logic
        statement.where = statement.where || {};
        statement.where.and = statement.where.and || [];
        statement.where.and.push(whereTemplate);

        // Add in the generated foriegn key select value so the records can be
        // nested together correctly.
        var selectStr = parentInstructions.childAlias + '.' + parentInstructions.childKey + ' as _parent_fk';
        statement.select.push(selectStr);

        childStatements.push({
          queryType: 'union',
          strategy: strategy,
          primaryKeyAttr: parentInstructions.childKey,
          statement: statement,
          instructions: instructions[alias].instructions,
          alias: alias
        });
      })();
    }
  });


  return {
    parentStatement: parentStatement,
    childStatements: childStatements,
    instructions: instructions
  };
};
