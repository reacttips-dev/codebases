/* eslint-disable
    eqeqeq,
    no-prototype-builtins,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let value;
const { makeVisitor, visit } = require('./babble');
const f = require('effing');
const assert = require('app/scripts/lib/assert');
const _ = require('underscore');
const locale = require('locale');

const visitor = makeVisitor(f.id, function (key, substitutions, options) {
  if (options == null) {
    options = {};
  }
  assert(
    substitutions.hasOwnProperty(key),
    `Error translating: '${key}' was not found in the provided substitutions ${JSON.stringify(
      Object.keys(substitutions),
    )}`,
  );
  value = substitutions[key];
  assert(
    typeof value === 'string',
    "I don't know how to convert values into strings. Please use a localized conversion function and pass me the string result.",
  );
  if (options.raw) {
    return value;
  } else {
    return _.escape(value);
  }
});

const visitFunction = f(visit, locale);

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

module.exports.tryBabble = function (keyPath, args, options) {
  if (args == null) {
    args = {};
  }
  return __guard__(visitFunction(keyPath, visitor, args, options), (x) =>
    x.join(''),
  );
};
