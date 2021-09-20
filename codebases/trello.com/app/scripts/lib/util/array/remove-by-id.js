/* eslint-disable @trello/disallow-filenames */
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');

// Returns a copy of the collection without the element which has an id
// that matches toRemove
module.exports.removeById = (collection, toRemove) =>
  _.reject(collection, (item) => item.id === toRemove.id);
