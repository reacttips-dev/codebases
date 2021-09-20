// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'sticker_select_item',
);

module.exports = function () {
  t.mustacheBlock('pending', () =>
    t.img('.sticker-select-image.sticker-select-pending', {
      src: t.mustacheVar('url'),
    }),
  );

  t.mustacheBlockInverted('pending', function () {
    t.img('.sticker-select-image.sticker-select-shadow', {
      src: t.mustacheVar('url'),
    });
    t.img('.sticker-select-image.sticker-select-fixed', {
      src: t.mustacheVar('url'),
    });
    return t.img('.sticker-select-image.sticker-select-peel', {
      src: t.mustacheVar('url'),
    });
  });

  t.mustacheBlock('id', () =>
    t.span(
      '.sticker-select-option.sticker-select-option-delete-button.js-delete-sticker',
      function () {
        t.icon('close', { class: 'sticker-select-option-icon' });
        return t.span('.sticker-select-option-text.u-text-underline', () =>
          t.format('delete'),
        );
      },
    ),
  );

  t.mustacheBlock('error', () =>
    t.span('.sticker-select-option', () =>
      t.span('.sticker-select-option-text', () =>
        t.text(t.mustacheVar('error')),
      ),
    ),
  );

  return t.mustacheBlock('pending', () =>
    t.span('.sticker-select-option', function () {
      t.span('.spinner.small.u-float-left', { style: 'margin-right: 4px;' });
      return t.span('.sticker-select-option-text', () =>
        t.format('uploading-ellipsis'),
      );
    }),
  );
};
