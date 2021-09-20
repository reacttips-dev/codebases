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
  'kiln_changeset_preview',
);

module.exports = function () {
  let left;
  const reviews = (left = t.mustacheVar('reviews')) != null ? left : [];

  t.div('.attachment-extra-info-header', function () {
    const key = reviews.length === 0 ? 'changeset-no-reviews' : 'changeset';

    t.format(key, {
      url: t.mustacheVar('url'),
      shortHash: t.mustacheVar('shortHash'),
      author: t.mustacheVar('author'),
    });

    return t.mustacheBlock('reviews', () =>
      t.span('.quiet', () =>
        t.a({ href: t.mustacheVar('url'), target: '_blank' }, () =>
          t.text(t.mustacheVar('status')),
        ),
      ),
    );
  });

  return t.div('.attachment-extra-info-details.markeddown', () =>
    t.raw(t.mustacheVar('commitMessageHtml')),
  );
};
