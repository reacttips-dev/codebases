/* eslint-disable @trello/disallow-filenames */
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// Naive check to see if it looks like the text contains a URL
// This doesn't make any attempt to reject obviously bad URLs like
// http://? http://:abc http:/// etc
module.exports.isUrl = (text) =>
  new RegExp(`\
^\
https?://\
\\S+\
$\
`).test(text);
