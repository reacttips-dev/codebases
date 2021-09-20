// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'board_change_background',
);
const { featureFlagClient } = require('@trello/feature-flag-client');

module.exports = t.renderable(function ({
  enabled_customBoardBackgrounds,
  idMember,
  upsellEnabled,
}) {
  t.div('.board-backgrounds-section-tiles.u-clearfix', function () {
    t.div(
      '.board-backgrounds-section-tile.board-backgrounds-photos-tile.js-bg-photos',
      function () {
        t.div('.image');
        return t.div('.title', () => t.format('photos'));
      },
    );

    if (featureFlagClient.get('aaaa.web.board-bkgd-gradients', false)) {
      return t.div(
        '.board-backgrounds-section-tile.board-backgrounds-gradients-tile.js-bg-colors',
        function () {
          t.div('.image');
          return t.div('.title', () => {
            t.span('.gradients-new-lozenge.js-gradients-new-lozenge');
            return t.format('colors');
          });
        },
      );
    } else {
      return t.div(
        '.board-backgrounds-section-tile.board-backgrounds-colors-tile.js-bg-colors',
        function () {
          t.div('.image');
          return t.div('.title', () => {
            return t.format('colors');
          });
        },
      );
    }
  });

  t.hr('.board-menu-header-divider');

  if (enabled_customBoardBackgrounds || upsellEnabled) {
    t.h2(() => t.format('custom'));

    return t.div(
      {
        class: `board-backgrounds-list u-relative u-clearfix js-custom-list${
          enabled_customBoardBackgrounds ? '' : ' disabled'
        }`,
      },
      () =>
        t.div(
          '.board-background-select.board-background-select-upload.js-uploader',
          () =>
            t.form(
              {
                action: `/1/member/${idMember}/customBoardBackgrounds`,
                method: 'post',
                enctype: 'multipart/form-data',
              },
              function () {
                t.input({ type: 'hidden', name: 'token', value: '' });
                t.input({ type: 'hidden', name: 'format', value: 'http' });
                t.span('.background-box', () => t.span('.icon-lg.icon-add'));
                return t.input('.upload-background.js-upload-image', {
                  type: 'file',
                  name: 'file',
                  multiple: 'multiple',
                  accept: 'image/*',
                });
              },
            ),
        ),
    );
  }
});
