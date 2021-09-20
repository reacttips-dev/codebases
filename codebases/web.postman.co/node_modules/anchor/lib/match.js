/**
 * Module dependencies
 */

var _ = require('@sailshq/lodash');
var rules = require('./rules');


/**
 * Match a miscellaneous rule
 * Returns an empty list on success,
 * or a list of errors if things go wrong
 */

module.exports = function matchRule (data, ruleName, args) {
  var self = this;

  // if args is an array we need to make it a nested array
  if (Array.isArray(args) && ruleName !== 'len') {
    args = [args];
  }

  // Ensure args is a list, then prepend it with data
  if (!_.isArray(args)) {
    args = [args];
  }

  // push data on to front
  args.unshift(data);

  // Lookup rule and determine outcome
  var rule = rules[ruleName];
  if (!rule) {
    throw new Error('Unknown rule: ' + ruleName);
  }

  var errorMessage = rule.apply(self, args);
  if (errorMessage) { return [{rule: ruleName, message: errorMessage}]; }
  return [];

};
