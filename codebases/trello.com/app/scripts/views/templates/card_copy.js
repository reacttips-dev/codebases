// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'card_copy',
);

module.exports = function () {
  t.mustacheBlock('loading', () =>
    t.div('.spinner.loading.js-loading-card-actions'),
  );
  return t.mustacheBlockInverted('loading', () =>
    t.form(function () {
      t.label(() => t.format('title'));
      t.textarea('.js-autofocus', { name: 'name' }, () =>
        t.text(t.mustacheVar('name')),
      );

      t.mustacheBlock('hasStuff', function () {
        t.label(() => t.format('keep-ellipsis'));

        t.mustacheBlock('hasChecklists', () =>
          t.div('.check-div.u-clearfix', function () {
            t.input({
              id: 'idKeepChecklists',
              type: 'checkbox',
              name: 'checklists',
              checked: true,
            });
            return t.label({ for: 'idKeepChecklists' }, () =>
              t.format('checklists-numchecklists', {
                numChecklists: t.mustacheVar('numChecklists'),
              }),
            );
          }),
        );

        t.mustacheBlock('hasLabels', () =>
          t.div('.check-div.u-clearfix', function () {
            t.input({
              id: 'idKeepLabels',
              type: 'checkbox',
              name: 'labels',
              checked: true,
            });
            return t.label({ for: 'idKeepLabels' }, () =>
              t.format('labels-numlabels', {
                numLabels: t.mustacheVar('numLabels'),
              }),
            );
          }),
        );

        t.mustacheBlock('hasMembers', () =>
          t.div('.check-div.u-clearfix', function () {
            t.input({
              id: 'idKeepMembers',
              type: 'checkbox',
              name: 'members',
              checked: true,
            });
            return t.label({ for: 'idKeepMembers' }, () =>
              t.format('members-nummembers', {
                numMembers: t.mustacheVar('numMembers'),
              }),
            );
          }),
        );

        t.mustacheBlock('hasAttachments', () =>
          t.div('.check-div.u-clearfix', function () {
            t.input({
              id: 'idKeepAttachments',
              type: 'checkbox',
              name: 'attachments',
              checked: true,
            });
            return t.label({ for: 'idKeepAttachments' }, () =>
              t.format('attachments-numattachments', {
                numAttachments: t.mustacheVar('numAttachments'),
              }),
            );
          }),
        );

        t.mustacheBlock('hasComments', () =>
          t.div('.check-div.u-clearfix', function () {
            t.input({
              id: 'idKeepComments',
              type: 'checkbox',
              name: 'comments',
              checked: true,
            });
            return t.label({ for: 'idKeepComments' }, () =>
              t.format('comments-numcomments', {
                numComments: t.mustacheVar('numComments'),
              }),
            );
          }),
        );

        return t.mustacheBlock('hasStickers', () =>
          t.div('.check-div.u-clearfix', function () {
            t.input({
              id: 'idKeepStickers',
              type: 'checkbox',
              name: 'stickers',
              checked: true,
            });
            return t.label({ for: 'idKeepStickers' }, () =>
              t.format('stickers-numstickers', {
                numStickers: t.mustacheVar('numStickers'),
              }),
            );
          }),
        );
      });

      t.label(() => t.format('copy-to-ellipsis'));

      t.mustachePartial(
        require('app/scripts/views/templates/move_card_controls'),
      );

      return t.input('.nch-button.nch-button--primary.wide.js-submit', {
        type: 'submit',
        value: t.l('create-card'),
      });
    }),
  );
};
