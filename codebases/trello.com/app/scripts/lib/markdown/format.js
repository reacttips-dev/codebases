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
const TFM = require('app/scripts/lib/markdown/tfm');

module.exports = new (class {
  markdownAsHtml(s, args) {
    if (args == null) {
      args = {};
    }
    /*
    There were some old accounts that couldn't view their account page
    because they had a null bio.  That needed to be fixed, but we may
    as well not crash the client if we run into a case like this.
    */
    if (s == null) {
      s = '';
    }
    if (s === '') {
      return s;
    }
    return TFM.description.format(s, args).output;
  }

  markdownAsText(s, args) {
    if (args == null) {
      args = {};
    }
    if (s == null) {
      s = '';
    }
    if (s === '') {
      return s;
    }
    return TFM.description.text(s, args).output;
  }

  // Take a number like 9823 and convert it to "9.59 KB"
  bytes(bytes) {
    if (bytes == null) {
      return 'Unknown Size';
    }

    const units = ['B', 'KB', 'MB', 'GB'];
    let count = bytes;
    for (let index = 0; index < units.length; index++) {
      const unit = units[index];
      if (count < 1024 || index === units.length - 1) {
        const number = Math.round(count * 100) / 100;
        return `${number} ${unit}`;
      }
      count /= 1024;
    }

    return 'unknown';
  }
})();
