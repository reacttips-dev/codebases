// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'comment_options',
);

module.exports = t.renderable((canAddAttachments, canRecordVideo) =>
  t.div('.comment-box-options', function () {
    if (canRecordVideo) {
      t.div('.js-comment-record-button');
    }

    if (canAddAttachments) {
      t.a(
        '.comment-box-options-item.js-comment-add-attachment',
        { href: '#', title: t.l('add-an-attachment-ellipsis') },
        () => t.icon('attachment'),
      );
    }

    t.a(
      '.comment-box-options-item.js-comment-mention-member',
      { href: '#', title: t.l('mention-a-member-ellipsis') },
      () => t.icon('mention'),
    );

    t.a(
      '.comment-box-options-item.js-comment-add-emoji',
      { href: '#', title: t.l('add-emoji-ellipsis') },
      () => t.icon('emoji'),
    );

    return t.a(
      '.comment-box-options-item.js-comment-add-card',
      { href: '#', title: t.l('add-card-ellipsis') },
      () => t.icon('card'),
    );
  }),
);
