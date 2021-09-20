// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'description',
);

module.exports = t.renderable(
  ({ editable, isCardDesc, placeholderKey, isAdmin, isTemplate }) =>
    t.div('.window-module', function () {
      t.div(
        '.window-module-title.window-module-title-no-divider.description-title',
        function () {
          t.span('.icon-description.icon-lg.window-module-title-icon');
          t.h3('.u-inline-block', () => t.format('description'));
          if (editable) {
            return t.div(
              { class: t.classify({ editable }), attr: 'desc' },
              function () {
                t.a(
                  '.nch-button.ml-4.hide-on-edit.js-show-with-desc.js-edit-desc.js-edit-desc-button',
                  { href: '#' },
                  () => t.format('edit'),
                );
                return t.span(
                  '.editing-members-description.js-editing-members-description.hide',
                );
              },
            );
          }
        },
      );

      // description body
      return t.div('.u-gutter', () =>
        t.div({ class: t.classify({ editable }), attr: 'desc' }, () =>
          t.div('.description-content.js-desc-content', function () {
            t.div('.description-content-fade-button', () =>
              t.span('.description-content-fade-button-text', () =>
                t.format('show-full-description'),
              ),
            );

            t.div(
              '.current.markeddown.hide-on-edit.js-desc.js-show-with-desc.hide',
              { dir: 'auto' },
            );

            if (!editable && isTemplate && !isCardDesc && !isAdmin) {
              t.div('.description-content-no-edit.js-hide-with-desc', () =>
                t.format(placeholderKey),
              );
            }

            if (editable) {
              t.p('.u-bottom.js-hide-with-desc', () =>
                t.a(
                  {
                    class: t.classify({
                      'description-fake-text-area hide-on-edit js-edit-desc  js-hide-with-draft': true,
                      large: !isCardDesc,
                    }),
                    href: '#',
                  },
                  () => t.format(placeholderKey),
                ),
              );

              t.div('.description-edit.edit', function () {
                t.a('.helper.nch-button.js-format-help', { href: '#' }, () =>
                  t.format('formatting-help'),
                );

                return t.textarea(
                  '.field.field-autosave.js-description-draft.description',
                  {
                    placeholder: t.l(placeholderKey),
                  },
                );
              });

              // Edits warning only shows when autosave is not turned on
              t.p('.edits-warning.quiet', function () {
                t.format('you-have-unsaved-edits-on-this-field');
                t.text(' ');
                t.a('.js-view-edits', { href: '#' }, () =>
                  t.format('view-edits'),
                );
                t.text(' - ');
                return t.a('.js-discard-edits', { href: '#' }, () =>
                  t.format('discard'),
                );
              });
              return t.p('.edits-error.error', () =>
                t.format('edit-not-saved'),
              );
            }
          }),
        ),
      );
    }),
);
