// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const moment = require('moment');
const { l } = require('app/scripts/lib/localize');

// Generate a name for a pasted image file, using the current date and time
module.exports = function () {
  const now = moment();
  const name = l('pasted file name', {
    date: now.format('l'),
    time: now.format('LTS'),
  });

  return `${name}.png`;
};
