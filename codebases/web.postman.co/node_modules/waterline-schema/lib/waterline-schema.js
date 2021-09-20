/**
 * Module dependencies
 */

var Schema = require('./waterline-schema/schema');
var ForeignKeys = require('./waterline-schema/foreignKeys');
var JoinTables = require('./waterline-schema/joinTables');
var References = require('./waterline-schema/references');
var Checks = require('./waterline-schema/checks');


//  ██╗    ██╗ █████╗ ████████╗███████╗██████╗ ██╗     ██╗███╗   ██╗███████╗
//  ██║    ██║██╔══██╗╚══██╔══╝██╔════╝██╔══██╗██║     ██║████╗  ██║██╔════╝
//  ██║ █╗ ██║███████║   ██║   █████╗  ██████╔╝██║     ██║██╔██╗ ██║█████╗
//  ██║███╗██║██╔══██║   ██║   ██╔══╝  ██╔══██╗██║     ██║██║╚██╗██║██╔══╝
//  ╚███╔███╔╝██║  ██║   ██║   ███████╗██║  ██║███████╗██║██║ ╚████║███████╗
//   ╚══╝╚══╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚══════╝╚═╝╚═╝  ╚═══╝╚══════╝
//
//  ███████╗ ██████╗██╗  ██╗███████╗███╗   ███╗ █████╗
//  ██╔════╝██╔════╝██║  ██║██╔════╝████╗ ████║██╔══██╗
//  ███████╗██║     ███████║█████╗  ██╔████╔██║███████║
//  ╚════██║██║     ██╔══██║██╔══╝  ██║╚██╔╝██║██╔══██║
//  ███████║╚██████╗██║  ██║███████╗██║ ╚═╝ ██║██║  ██║
//  ╚══════╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝
//
// Used to build a Waterline Schema object from a set of loaded collections.
// It should normalize attribute definitions and expand out associations. This
// module is used internally to Waterline and provides no benefits outside of
// it. The expanded properties added to associations are not appropriate for use
// directly inside of your Waterline models.

module.exports = function WaterlineSchema(collections, modelDefaults) {
  var schema = {};

  // Transform Collections into a basic schema
  schema = Schema(collections);

  // Map out and expand foreign keys on the collection schema attributes
  ForeignKeys(schema);

  // Build and map any generated join tables on the collection schema
  JoinTables(schema, modelDefaults);

  // Add References for Has Many Keys
  References(schema);

  // Run any final sanity checks on the schema
  Checks(schema);

  return schema;
};
