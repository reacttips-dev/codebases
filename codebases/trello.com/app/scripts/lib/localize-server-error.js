/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');
const { tryBabble } = require('app/scripts/lib/try-babble');

const tryParseJsonMessage = function (str) {
  try {
    return JSON.parse(str).message;
  } catch (error) {
    return null;
  }
};

module.exports.localizeServerError = function (resOrString) {
  const message = _.isString(resOrString)
    ? tryParseJsonMessage(resOrString) || resOrString
    : // We used to check for .error, but that wasn't being set consistently
    (resOrString.responseJSON != null
        ? resOrString.responseJSON.message
        : undefined) != null
    ? resOrString.responseJSON.message
    : // Maybe we were passed an Error object
    resOrString.message != null
    ? tryParseJsonMessage(resOrString.message) || resOrString.message
    : resOrString.responseText;

  return tryBabble(['server error', message]) || message;
};
