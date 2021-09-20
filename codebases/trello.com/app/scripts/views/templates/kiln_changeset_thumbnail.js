/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'kiln_changeset_thumbnail',
);

module.exports = function () {
  t.span({ title: t.mustacheVar('commitMessage') }, () =>
    t.text(t.mustacheVar('shortCommitMessage')),
  );

  return t.span('.block.quiet', function () {
    let left;
    const reviews = (left = t.mustacheVar('reviews')) != null ? left : [];
    const date = t.mustacheVar('date');

    if (reviews.length === 0 && !date) {
      t.format('no-reviews-no-date');
    } else if (reviews.length === 0 && date) {
      t.format('no-reviews-date', { date });
    } else if (reviews.length > 0 && !date) {
      t.format('reviews-no-date');
    } else if (reviews.length > 0 && date) {
      t.format('reviews-date', { date });
    }

    return t.mustacheBlock('reviews', () =>
      t.span(() =>
        t.a({ href: t.mustacheVar('url'), target: '_blank' }, () =>
          t.text(t.mustacheVar('status')),
        ),
      ),
    );
  });
};
