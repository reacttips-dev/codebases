/**
 * Module dependencies
 */

var _ = require('@sailshq/lodash');
var match = require('./lib/match');


/**
 * Public access
 */

module.exports = function (entity, ruleset) {

  var errors = [];

  // If ruleset doesn't contain any explicit rule keys,
  // assume that this is a type

  // Look for explicit rules
  for (var rule in ruleset) {


    // TODO: In next major version, remove this: It should definitely not be here.
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Normalize the value if it looks like a boolean
    if(ruleset[rule] === 'true') {
      ruleset[rule] = true;
    }

    if(ruleset[rule] === 'false') {
      ruleset[rule] = false;
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // If the value is false, then we shouldn't even run the validation
    if(ruleset[rule] === false) {
      break;
    }

    // If the rule value is a boolean we don't need to pass the value along.
    // Otherwise we can pass it along so it's options are available in
    // the validation.
    var ruleVal = _.isBoolean(ruleset[rule]) ? undefined : ruleset[rule];
    errors = errors.concat(match(entity, rule, ruleVal));

  }

  // If errors exist, return the list of them
  if (errors.length) {
    return errors;
  }

  // No errors, so return false
  else {
    return [];
  }

};

