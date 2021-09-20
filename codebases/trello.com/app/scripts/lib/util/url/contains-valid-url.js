/* eslint-disable
    eqeqeq,
    @trello/disallow-filenames,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// Checks to see if any part of the text contains a valid URL
// Regex adapted from answer provided here: https://stackoverflow.com/a/2015516
module.exports.containsValidUrl = (text) =>
  new RegExp(`\
(https?|ftp):\\/\\/\
(([a-z0-9$_\\.\\+!\\*\\'\\(\\),;\\?&=-]|%[0-9a-f]{2})+\
(:([a-z0-9$_\\.\\+!\\*\\'\\(\\),;\\?&=-]|%[0-9a-f]{2})+)?\
@)?\
((([a-z0-9]\\.|[a-z0-9][a-z0-9-]*[a-z0-9]\\.)*\
[a-z][a-z0-9-]*[a-z0-9]\
|((\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])\\.){3}\
(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])\
)(:\\d+)?\
)(((\\/+([a-z0-9$_\\.\\+!\\*\\'\\(\\),;:@&=-]|%[0-9a-f]{2})*)*\
(\\?([a-z0-9$_\\.\\+!\\*\\'\\(\\),;:@&=-]|%[0-9a-f]{2})*)\
?)?)?\
(\\#([a-z0-9$_\\.\\+!\\*\\'\\(\\),;:@&=-]|%[0-9a-f]{2})*)?\
`).test(text != null ? text.toLowerCase() : undefined);
