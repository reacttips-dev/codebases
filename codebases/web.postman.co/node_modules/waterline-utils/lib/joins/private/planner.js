//   ██████╗ ██╗   ██╗███████╗██████╗ ██╗   ██╗    ██████╗ ██╗      █████╗ ███╗   ██╗███╗   ██╗███████╗██████╗
//  ██╔═══██╗██║   ██║██╔════╝██╔══██╗╚██╗ ██╔╝    ██╔══██╗██║     ██╔══██╗████╗  ██║████╗  ██║██╔════╝██╔══██╗
//  ██║   ██║██║   ██║█████╗  ██████╔╝ ╚████╔╝     ██████╔╝██║     ███████║██╔██╗ ██║██╔██╗ ██║█████╗  ██████╔╝
//  ██║▄▄ ██║██║   ██║██╔══╝  ██╔══██╗  ╚██╔╝      ██╔═══╝ ██║     ██╔══██║██║╚██╗██║██║╚██╗██║██╔══╝  ██╔══██╗
//  ╚██████╔╝╚██████╔╝███████╗██║  ██║   ██║       ██║     ███████╗██║  ██║██║ ╚████║██║ ╚████║███████╗██║  ██║
//   ╚══▀▀═╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝   ╚═╝       ╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝
//
// Takes a Waterline Criteria object and determines which types of associations
// to plan out. For each association being populated, it will determine a specific
// strategy to use for the instruction set.
//
// The strategies are used when building up statements based on a join criteria.
// They represent the various ways a join could be constructed.
//
// HAS_FK         Used when populating a model attribute where the foreign key
// Type 1         exist on the parent record. Sometimes referred to as a belongsTo
//                association.
//
// VIA_FK         Used when populating a collection attribute where the foreign
// Type 2         key exist on the child record. Sometimes referred to as a
//                hasMany association because the parent can have many child records.
//
// VIA_JUNCTOR    This is the most complicated type of join. It requires the use
// Type 3         of an intermediate table to hold the values the connect the
//                two sets of records. Sometimes referred to as a manyToMany
//                association.
//

var util = require('util');
var _ = require('@sailshq/lodash');

// A set of named strategies to use
var strategies = {
  HAS_FK: 1,
  VIA_FK: 2,
  VIA_JUNCTOR: 3
};

module.exports = function planner(options) {
  // Validate the options dictionary argument to ensure it has everything it needs
  if (!options || !_.isPlainObject(options)) {
    throw new Error('Planner is missing a required options input.');
  }

  if (_.isUndefined(options.joins) || !_.isArray(options.joins)) {
    throw new Error('Options must contain a joins array.');
  }

  if (_.isUndefined(options.getPk) || !_.isFunction(options.getPk)) {
    throw new Error('Options must contain a getPk function that accepts a single argument - modelName.');
  }

  // Grab the values from the options dictionary for local use.
  var joins = options.joins;
  var getPk = options.getPk;


  // Group the associations by alias
  var groupedAssociations = _.groupBy(joins, 'alias');

  //  ╔╦╗╔═╗╔╦╗╔═╗╦═╗╔╦╗╦╔╗╔╔═╗  ┌─┐┌┬┐┬─┐┌─┐┌┬┐┌─┐┌─┐┬ ┬
  //   ║║║╣  ║ ║╣ ╠╦╝║║║║║║║║╣   └─┐ │ ├┬┘├─┤ │ ├┤ │ ┬└┬┘
  //  ═╩╝╚═╝ ╩ ╚═╝╩╚═╩ ╩╩╝╚╝╚═╝  └─┘ ┴ ┴└─┴ ┴ ┴ └─┘└─┘ ┴
  // Given an association's instructions, figure out which strategy to use
  // in order to correctly build the query.
  var determineStrategy = function determineStrategy(instructions) {
    if (!instructions) {
      throw new Error('Missing options when planning the query');
    }

    // Grab the parent and the child. In the case of a belongsTo or hasMany
    // there will only ever be a single instruction. However on the case of a
    // manyToMany there will be two items in the instructions array - one join
    // for the join table and one join to get the child records. To account for
    // this the parent is always the first and the child is always the last.
    var parentTableName = _.first(instructions).parent;
    var childTableName = _.last(instructions).child;

    // Ensure we found parent and child identities
    if (!parentTableName) {
      throw new Error('Unable to find a parentTableName in ' + util.inspect(instructions, false, 3));
    }

    if (!childTableName) {
      throw new Error('Unable to find a childTableName in ' + util.inspect(instructions, false, 3));
    }

    // Calculate the parent and child primary keys
    var parentPk;
    try {
      parentPk = getPk(parentTableName);
    } catch (e) {
      throw new Error('Error finding a primary key attribute for ' + parentTableName + '\n\n' + e.stack);
    }

    // Determine the type of association rule (i.e. "strategy") we'll be using.
    var strategy;

    // If there are more than one join instruction set, there must be an
    // intermediate (junctor) collection involved
    if (instructions.length === 2) {
      strategy = strategies.VIA_JUNCTOR;

    // If the parent's primary key IS the foreign key we know to use the `viaFK`
    // strategy. This means that the parent query will have many of the join
    // items - i.e. populating a collection.
    } else if (_.first(instructions).parentKey === parentPk) {
      strategy = strategies.VIA_FK;

    // Otherwise the parent query must have the foreign key. i.e. populating a
    // model.
    } else {
      strategy = strategies.HAS_FK;
    }

    // Build an object to hold any meta-data for the strategy
    var meta = {};

    // Now lookup strategy-specific association metadata.

    // `parentFk` will only be meaningful if this is the `HAS_FK` strategy. This
    // shows which field on the parent contains the id of the association to join.
    // It's used when populating a model.
    if (strategy === strategies.HAS_FK) {
      meta.parentFk = _.first(instructions).parentKey;
    }

    // `childFK` will only be meaningful if this is the `VIA_FK` strategy. This
    // shows which field on the child contains the value to use for the assocation.
    if (strategy === strategies.VIA_FK) {
      meta.childFk = _.first(instructions).childKey;
    }

    // `junctorIdentity`, `junctorFkToParent`, `junctorFkToChild`, and `junctorPk`
    // will only be meaningful if this is the `VIA_JUNCTOR` strategy. i.e. a
    // manyToMany join where an intermediate table is used.
    if (strategy === strategies.VIA_JUNCTOR) {
      meta.junctorIdentity = _.first(instructions).childCollectionIdentity;

      // Find the primary key of the join table.
      var junctorPk;
      try {
        junctorPk = getPk(_.first(instructions).child);
      } catch (e) {
        throw new Error('Error finding a primary key attribute for junction table: ' + _.first(instructions).child + '\n\n' + e.stack);
      }

      meta.junctorPk = junctorPk;
      meta.junctorFkToParent = _.first(instructions).childKey;
      meta.junctorFkToChild = _.last(instructions).parentKey;
    }

    return {
      strategy: strategy,
      meta: meta
    };
  };


  //  ╔╗ ╦ ╦╦╦  ╔╦╗  ┌─┐┌┬┐┬─┐┌─┐┌┬┐┌─┐┌─┐┬┌─┐┌─┐
  //  ╠╩╗║ ║║║   ║║  └─┐ │ ├┬┘├─┤ │ ├┤ │ ┬│├┤ └─┐
  //  ╚═╝╚═╝╩╩═╝═╩╝  └─┘ ┴ ┴└─┴ ┴ ┴ └─┘└─┘┴└─┘└─┘
  // Go through all the associations being used and determine a strategy for
  // each one. Update the instructions to include the strategy metadata.
  _.each(groupedAssociations, function buildStrategy(val, key) {
    var strategy = determineStrategy(val);

    // Overwrite the grouped associations and insert the strategy and
    // original instructions.
    groupedAssociations[key] = {
      strategy: strategy,
      instructions: val
    };
  });

  return groupedAssociations;
};
