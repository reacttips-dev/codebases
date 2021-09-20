// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'card_in_list',
);
const labelTemplate = require('./label');
const memberOnCardTemplate = require('./member_on_card');
const coverTemplate = require('./card_in_list_cover');

module.exports = t.renderable(function ({
  hasStickers,
  labels,
  quickEdit,
  name,
  members,
  showEditor,
  badgesHTML,
  hasCover,
  cover,
  hideCover,
  attachmentCoverUrl,
  cardRole,
}) {
  if (cardRole !== 'board') {
    coverTemplate({
      cover,
      hasCover,
      hideCover,
      hasStickers,
      attachmentCoverUrl,
    });
  }

  if (showEditor) {
    t.icon('edit', {
      class:
        'list-card-operation dark-hover js-open-quick-card-editor js-card-menu',
    });
  }
  if (cardRole !== 'board') {
    t.div(
      '.list-card-stickers-area.js-stickers-area',
      { class: t.classify({ hide: !hasStickers }) },
      () => t.div('.stickers.js-card-stickers'),
    );
  }
  t.div('.list-card-details.js-card-details', function () {
    t.div('.list-card-labels.js-card-labels', () =>
      Array.from(labels).map((label) =>
        labelTemplate({
          name: label.name,
          color: label.color,
          extraClasses: ['mod-card-front'],
        }),
      ),
    );
    if (quickEdit) {
      t.textarea(
        '.list-card-edit-title.js-edit-card-title',
        { dir: 'auto' },
        () => t.text(name),
      );
    } else {
      t.span('.list-card-title.js-card-name', { dir: 'auto' });
    }
    t.div('.badges', function () {
      t.span('.js-badges', () => t.raw(badgesHTML));
      t.span('.custom-field-front-badges.js-custom-field-badges');
      return t.span('.js-plugin-badges');
    });
    return t.div('.list-card-members.js-list-card-members', () =>
      Array.from(members).map((member) => memberOnCardTemplate(member)),
    );
  });

  t.p('.list-card-dropzone', () => t.format('drop-files-to-upload'));

  t.p('.list-card-dropzone-limited', () => t.format('too-many-attachments'));

  return t.p('.list-card-dropzone-restricted', () =>
    t.format('attachments-restricted'),
  );
});
