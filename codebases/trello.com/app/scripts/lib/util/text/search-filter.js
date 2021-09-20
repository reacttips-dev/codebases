/* eslint-disable @trello/disallow-filenames */
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
module.exports.searchFilter = (search) => {
  const searchTerms = search.toLowerCase().split(/[\s,]+/);

  const tests = searchTerms.map((term, index) => {
    if (term.length === 0) {
      return (s) => true;
    } else if (index === searchTerms.length - 1) {
      // Assume the last term is a partial
      return (s) => s.toLowerCase().indexOf(term) === 0;
    } else {
      return (s) => s.toLowerCase() === term;
    }
  });

  return (word) => {
    if (Array.isArray(word)) {
      word = word.join(' ');
    }

    const terms = word.toLowerCase().split(/\s+/);
    // We've got to have a match for every search term
    return tests.every((fn) => terms.some((term) => fn(term)));
  };
};
