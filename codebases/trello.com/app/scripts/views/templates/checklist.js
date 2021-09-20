// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'checklist',
);
const { featureFlagClient } = require('@trello/feature-flag-client');

module.exports = () => {
  t.div(
    {
      class: `window-module-title window-module-title-no-divider u-clearfix${t.mustacheBlock(
        '__ed',
        () => {},
      )}`,
    },
    () => {
      if (featureFlagClient.get('treehouse.web.checklist-toggles', false)) {
        t.span(
          '.window-module-title-icon.icon-lg.toggle-checklist-button.js-toggle-checklist-state',
        );
      } else {
        t.span('.window-module-title-icon.icon-lg.icon-checklist');
      }

      t.mustacheBlock('__ed', () => {
        t.div(
          '.editable.non-empty.checklist-title.js-checklist-title',
          { attr: 'name' },
          () => {
            t.h3('.current.hide-on-edit', { dir: 'auto' }, () => {
              t.text(t.mustacheVar('name'));
            });
            t.div('.window-module-title-options', () => {
              t.mustacheBlock('__ed', () => {
                t.a('.nch-button.hide.hide-on-edit.js-show-checked-items', {
                  href: '#',
                  style: 'margin: 0 8px 0 0;',
                });

                t.a(
                  '.nch-button.hide.hide-on-edit.js-hide-checked-items',
                  { href: '#', style: 'margin: 0 8px 0 0;' },
                  () => {
                    t.format('hide-checked-items');
                  },
                );

                t.a(
                  '.nch-button.hide-on-edit.js-confirm-delete',
                  { href: '#', style: 'margin: 0' },
                  () => {
                    t.format('delete');
                  },
                );
              });
            });
            t.div('.edit.edit-heavy', () => {
              t.textarea('.field.full.single-line.checklist-title-input', {
                dir: 'auto',
              });

              t.div('.checklist-title-edit-controls.u-clearfix', () => {
                t.input(
                  '.nch-button.nch-button--primary.confirm.mod-submit-edit.js-save-checklist-title',
                  { type: 'submit', value: t.l('save') },
                );

                t.a(
                  '.icon-lg.icon-close.dark-hover.cancel.js-cancel-checklist-title',
                  { href: '#' },
                );
              });
            });

            t.p('.edits-warning.quiet', () => {
              t.format('you-have-unsaved-edits-on-this-field');
              t.text(' ');
              t.a('.js-view-edits', { href: '#' }, () => {
                t.format('view-edits');
              });
              t.text(' - ');

              t.a('.js-discard-edits', { href: '#' }, () => {
                t.format('discard');
              });
            });
          },
        );
      });

      t.mustacheBlockInverted('__ed', () => {
        t.h3(() => {
          t.text(t.mustacheVar('name'));
        });
      });
    },
  );

  t.div('.checklist-progress', () => {
    t.span(
      '.checklist-progress-percentage.js-checklist-progress-percent',
      () => {
        t.text('0%');
      },
    );

    t.div('.checklist-progress-bar', () => {
      t.div('.checklist-progress-bar-current.js-checklist-progress-bar');
    });

    t.span('.checklist-completed-text.hide.quiet.js-completed-message', () => {
      t.format('everything-in-this-checklist-is-complete');
    });
  });

  t.div('.js-checklist-banners');

  t.div('.checklist-items-list.js-checklist-items-list.js-no-higher-edits');

  return t.mustacheBlock('__ed', () => {
    t.div(
      '.editable.checklist-new-item.u-gutter.js-new-checklist-item',
      { attr: 'newItem' },
      () => {
        t.button(
          '.js-new-checklist-item-button.nch-button.mt-4.hide-on-edit',
          () => {
            return t.l('add-an-item');
          },
        );
        t.textarea(
          '.edit.field.checklist-new-item-text.js-new-checklist-item-input',
          { placeholder: t.l('add-an-item') },
        );

        t.div('.checklist-add-controls.u-clearfix', () => {
          t.input(
            '.nch-button.nch-button--primary.confirm.mod-submit-edit.js-add-checklist-item',
            {
              type: 'submit',
              value: t.l('add'),
            },
          );

          t.a(
            '.icon-lg.icon-close.dark-hover.cancel.js-cancel-checklist-item',
            { href: '#' },
          );

          t.div('.checklist-add-controls-spacer');

          t.a(
            '.checklist-add-controls-option.options-menu.dark-hover.js-assign.hide',
            { href: '#' },
          );

          t.a(
            '.checklist-add-controls-option.options-menu.dark-hover.js-due.checklist-add-controls-due.hide',
            { href: '#' },
          );

          t.a(
            '.checklist-add-controls-option.options-menu.dark-hover.js-open-mention-selector',
            { href: '#' },
            () => {
              t.span('.icon-sm.icon-mention');
            },
          );

          t.a(
            '.checklist-add-controls-option.options-menu.dark-hover.js-open-emoji-selector',
            { href: '#' },
            () => {
              t.span('.icon-sm.icon-emoji');
            },
          );
        });
      },
    );

    t.div(
      '.checklist-limit-warning.u-gutter.js-new-checklist-item-limit-exceeded.hide',
      () => {
        t.span('.checklist-limit-warning-text', () => {
          t.format('too-many-check-items');
        });
      },
    );
  });
};
