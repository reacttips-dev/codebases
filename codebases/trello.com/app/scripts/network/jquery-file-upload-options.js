// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Auth } = require('app/scripts/db/auth');
const _ = require('underscore');

// When you're uploading a file using $.ajax, you need to use FormData and tell
// jQuery not to try to do its own processing on the data
//
// It's meant to be used as follows:
//
// $.ajax(_.extend({
//   url: '...'
//   ...
// }, fileUploadOptions({
//   foo: 'bar'
//   file: [ fileObject, 'filename.jpg' ]
// })))
//
// You can also pass it's return value as the options parameter to a
// Backbone Collection::create
//
module.exports.fileUploadOptions = function (attributes) {
  const data = new FormData();
  data.append('token', Auth.myToken());

  for (const key in attributes) {
    const value = attributes[key];
    if (_.isArray(value)) {
      data.append(key, ...Array.from(value));
    } else {
      data.append(key, value);
    }
  }

  return {
    data,
    contentType: false,
    processData: false,
    timeout: 6 * 60 * 60 * 1000, // 6 hours
  };
};
