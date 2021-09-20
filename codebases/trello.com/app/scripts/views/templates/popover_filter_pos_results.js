// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS201: Simplify complex destructure assignments
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'popover_filter_pos_results',
);

module.exports = () =>
  t.ul('.pop-over-list.navigable.normal-weight.js-pos-results', function () {
    const lists = [
      ['js-select-pos-keyword', t.mustacheVar('keywordList')],
      ['js-select-pos-pos', t.mustacheVar('indexList')],
      ['js-select-pos-list', t.mustacheVar('listList')],
    ];

    return lists.forEach(function (...args) {
      const [className, list] = Array.from(args[0]);
      return list.forEach((entry) =>
        t.li(() =>
          t.a({ href: '#', name: entry.value, class: className }, () =>
            t.format('position-in-list', {
              index: entry.indexString,
              listName: entry.listName,
            }),
          ),
        ),
      );
    });
  });
