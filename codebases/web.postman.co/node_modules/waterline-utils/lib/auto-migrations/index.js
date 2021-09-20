/**
 * Module dependencies
 */

var _ = require('@sailshq/lodash');
var runAlterStrategy = require('./private/run-alter-strategy');
var runDropStrategy = require('./private/run-drop-strategy');
var runSafeStrategy = require('./private/run-safe-strategy');


/**
 * runAutoMigrations()
 *
 * Auto-migrate all models in this orm using the given strategy.
 *
 * @param  {[type]}   strategy [description]
 * @param  {[type]}   orm      [description]
 * @param  {Function} cb       [description]
 * @return {[type]}            [description]
 */
module.exports = function runAutoMigrations(strategy, orm, cb) {
  //  ╦  ╦╔═╗╦  ╦╔╦╗╔═╗╔╦╗╔═╗  ┌─┐┌┬┐┬─┐┌─┐┌┬┐┌─┐┌─┐┬ ┬
  //  ╚╗╔╝╠═╣║  ║ ║║╠═╣ ║ ║╣   └─┐ │ ├┬┘├─┤ │ ├┤ │ ┬└┬┘
  //   ╚╝ ╩ ╩╩═╝╩═╩╝╩ ╩ ╩ ╚═╝  └─┘ ┴ ┴└─┴ ┴ ┴ └─┘└─┘ ┴
  if (!_.isString(strategy)) {
    return cb(new Error('Strategy must be one of: `alter`, `drop`, or `safe`.'));
  }

  //  ╦  ╦╔═╗╦  ╦╔╦╗╔═╗╔╦╗╔═╗  ┌─┐┬─┐┌┬┐
  //  ╚╗╔╝╠═╣║  ║ ║║╠═╣ ║ ║╣   │ │├┬┘│││
  //   ╚╝ ╩ ╩╩═╝╩═╩╝╩ ╩ ╩ ╚═╝  └─┘┴└─┴ ┴
  if (!orm || !_.isObject(orm)) {
    return cb(new Error('ORM must be an initialized Waterline ORM instance.'));
  }

  // Ensure a callback function exists
  if (!cb || !_.isFunction(cb)) {
    throw new Error('Missing callback argument.');
  }

  //  ╦═╗╦ ╦╔╗╔  ┌┬┐┬┌─┐┬─┐┌─┐┌┬┐┬┌─┐┌┐┌  ┌─┐┌┬┐┬─┐┌─┐┌┬┐┌─┐┌─┐┬ ┬
  //  ╠╦╝║ ║║║║  │││││ ┬├┬┘├─┤ │ ││ ││││  └─┐ │ ├┬┘├─┤ │ ├┤ │ ┬└┬┘
  //  ╩╚═╚═╝╝╚╝  ┴ ┴┴└─┘┴└─┴ ┴ ┴ ┴└─┘┘└┘  └─┘ ┴ ┴└─┴ ┴ ┴ └─┘└─┘ ┴
  switch(strategy){
    case 'alter': runAlterStrategy(orm, cb); break;
    case 'drop': runDropStrategy(orm, cb); break;
    case 'safe': runSafeStrategy(orm, cb); break;
    default: return cb(new Error('Strategy must be one of: `alter`, `drop`, or `safe`.'));
  }
};
