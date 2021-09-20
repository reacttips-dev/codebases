'use strict';

/**
 * Get the current page's canonical URL.
 *
 * @return {string|undefined}
 */
function canonical() {
  var tags = document.getElementsByTagName('link');
  // eslint-disable-next-line no-cond-assign
  for (var i = 0, tag; tag = tags[i]; i++) {
    if (tag.getAttribute('rel') === 'canonical') {
      return tag.getAttribute('href');
    }
  }
}

/*
 * Exports.
 */

module.exports = canonical;
