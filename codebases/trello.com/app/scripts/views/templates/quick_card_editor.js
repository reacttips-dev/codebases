// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'quick_card_editor',
);
const cardTemplate = require('app/scripts/views/templates/card_in_list');

module.exports = function () {
  const cardUrl = t.mustacheVar('cardUrl');
  const isTemplate = t.mustacheVar('isTemplate');
  const isCardTemplate = t.mustacheVar('isCardTemplate');
  const cardRole = t.mustacheVar('cardRole');
  t.span('.icon-lg.icon-close.quick-card-editor-close-icon.js-close-editor');

  return t.div(
    '.quick-card-editor-card',
    {
      style: `top: ${t.mustacheVar('top')}px; left: ${t.mustacheVar(
        'left',
      )}px; width: ${t.mustacheVar('width')}px;`,
    },
    function () {
      t.div(
        '.list-card.list-card-quick-edit.js-stop',
        { style: `width: ${t.mustacheVar('width')}px;` },
        () => cardTemplate(t.mustacheVar('.')),
      );

      t.input('.nch-button.nch-button--primary.wide.js-save-edits', {
        type: 'submit',
        value: t.l('save'),
      });

      return t.div(
        {
          class: `quick-card-editor-buttons${t.mustacheBlock(
            'leftButtons',
            () => ' quick-card-editor-buttons-left',
          )}`,
        },
        function () {
          if (!cardRole) {
            t.a(
              '.quick-card-editor-buttons-item',
              { href: cardUrl },
              function () {
                t.icon('card', { class: 'light' });
                return t.span('.quick-card-editor-buttons-item-text', () =>
                  t.format('open-card'),
                );
              },
            );

            t.a(
              '.quick-card-editor-buttons-item.js-edit-labels',
              { href: '#' },
              function () {
                t.icon('label', { class: 'light' });
                return t.span('.quick-card-editor-buttons-item-text', () =>
                  t.format('edit-labels'),
                );
              },
            );
          }
          if (!isTemplate && !cardRole) {
            t.a(
              '.quick-card-editor-buttons-item.js-edit-members',
              { href: '#' },
              function () {
                t.icon('member', { class: 'light' });
                return t.span('.quick-card-editor-buttons-item-text', () =>
                  t.format('change-members'),
                );
              },
            );
          }
          if (!cardRole) {
            t.a(
              '.quick-card-editor-buttons-item.js-edit-cover',
              { href: '#' },
              function () {
                t.icon('card-cover', { class: 'light' });
                return t.span('.quick-card-editor-buttons-item-text', () =>
                  t.format('change-cover'),
                );
              },
            );
          }
          t.a(
            '.quick-card-editor-buttons-item.js-move-card',
            { href: '#' },
            function () {
              t.icon('move', { class: 'light' });
              return t.span('.quick-card-editor-buttons-item-text', () =>
                t.format('move'),
              );
            },
          );
          t.a(
            '.quick-card-editor-buttons-item.js-copy-card',
            { href: '#' },
            function () {
              t.icon('card', { class: 'light' });
              return t.span('.quick-card-editor-buttons-item-text', () =>
                t.format('copy'),
              );
            },
          );
          if (!isCardTemplate && !cardRole) {
            t.a(
              '.quick-card-editor-buttons-item.js-edit-due-date',
              { href: '#' },
              function () {
                t.icon('clock', { class: 'light' });
                return t.span('.quick-card-editor-buttons-item-text', () =>
                  t.format('edit-dates'),
                );
              },
            );
          }
          t.mustacheBlockInverted('closed', () =>
            t.a(
              '.quick-card-editor-buttons-item.js-archive',
              { href: '#' },
              function () {
                t.icon('archive', { class: 'light' });
                return t.span(
                  '.quick-card-editor-buttons-item-text',
                  function () {
                    if (isCardTemplate) {
                      return t.format('hide-from-list');
                    } else {
                      return t.format('archive');
                    }
                  },
                );
              },
            ),
          );

          t.div('#convert-card-role-button-react-root', {
            class: t.mustacheBlock('leftButtons', () => 'left-side-react-root'),
          });
        },
      );
    },
  );
};
