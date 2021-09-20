// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'sticker_select_item_upload',
);

module.exports = () =>
  t.form(
    {
      action: `/1/member/${t.mustacheVar('id')}/customStickers`,
      method: 'post',
      enctype: 'multipart/form-data',
    },
    function () {
      t.input({ type: 'hidden', name: 'token', value: '' });
      t.input({ type: 'hidden', name: 'format', value: 'http' });
      return t.div('.sticker-select.sticker-select-upload', function () {
        t.span('.sticker-select-upload-icon.icon-lg.icon-add');
        return t.input({
          type: 'file',
          name: 'file',
          class: `sticker-select-upload-input js-upload-image ${t.mustacheBlockInverted(
            'enabled_customStickers',
            () => ' disabled',
          )}`,
          multiple: 'multiple',
          accept: 'image/*',
        });
      });
    },
  );
