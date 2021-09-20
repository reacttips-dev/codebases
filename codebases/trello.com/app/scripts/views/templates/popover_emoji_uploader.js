// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'popover_emoji_uploader',
);

module.exports = function () {
  t.mustacheBlockInverted('canUpload', function () {
    t.div('.warning', function () {
      return t.mustacheBlockInverted('hasBCGold', () =>
        t.p('.u-bottom', () =>
          t.format(
            'you-can-get-custom-emoji-for-your-entire-organization-with-business-class-learn-more-about-business-class',
          ),
        ),
      );
    });

    return t.hr();
  });

  t.form(
    {
      action: `/1/member/${t.mustacheVar('id')}/customEmoji`,
      method: 'post',
      enctype: 'multipart/form-data',
    },
    function () {
      t.input({ type: 'hidden', name: 'token', value: '' });
      t.input({ type: 'hidden', name: 'format', value: 'http' });

      t.label({ for: 'emojiImage' }, () => t.format('upload-image'));
      t.input('.js-upload-emoji-file.upload-emoji', {
        id: 'emojiImage',
        type: 'file',
        name: 'file',
        tabindex: '-1',
        accept: 'image/*',
      });

      t.label({ for: 'emojiName' }, () => t.format('emoji-name'));
      t.input('.js-emoji-name', {
        id: 'emojiName',
        type: 'text',
        name: 'name',
        value: t.mustacheVar('emojiName'),
      });

      t.p('.quiet', () =>
        t.format(
          'the-name-will-default-to-the-name-of-the-uploaded-file-you-can-change-it-here-though',
        ),
      );

      t.p('.warning.hide.js-invalid-name', () =>
        t.format(
          'the-emoji-name-can-only-contain-letters-numbers-and-underscores',
        ),
      );

      t.div(
        '.js-emoji-preview',
        { style: 'margin-bottom: 12px;' },
        function () {
          t.p({ style: 'margin-bottom: 4px;' }, () =>
            t.strong(() => t.format('preview')),
          );
          t.span('.js-emoji-preview-name', () =>
            t.text(t.mustacheVar('emojiName')),
          );
          t.text(' → ');
          return t.img('.js-emoji-preview.emoji');
        },
      );

      t.input('.nch-button.nch-button--primary.wide.js-upload-emoji', {
        type: 'submit',
        value: t.l('create-custom-emoji'),
      });

      return t.div('.error.hide', () => t.format('upload-failed'));
    },
  );

  return t.mustacheBlock('canUpload', () =>
    t.mustacheBlock('showTeamUpsell', function () {
      t.hr();

      return t.p('.u-bottom', () =>
        t.format(
          'you-can-also-get-custom-emoji-for-your-entire-organization-with-business-class-learn-more-about-business-class',
        ),
      );
    }),
  );
};
