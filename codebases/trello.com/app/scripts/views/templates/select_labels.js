// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'select_labels',
);

module.exports = () =>
  t.mustacheBlock('labels', () =>
    t.li(function () {
      t.mustacheBlock('__ed', () =>
        t.a('.card-label-edit-button.icon-sm.icon-edit.js-edit-label', {
          href: '#',
          'data-idlabel': t.mustacheVar('id'),
        }),
      );
      return t.span(
        {
          class: `card-label mod-selectable card-label-${t.mustacheVar(
            'color',
          )} ${t.mustacheBlock('isActive', () => 'active')} js-select-label`,
          'data-idlabel': t.mustacheVar('id'),
          'data-color': t.mustacheVar('color'),
        },
        function () {
          t.mustacheBlock('name', () => t.text(t.mustacheVar('name')));
          return t.icon('check', { class: 'card-label-selectable-icon light' });
        },
      );
    }),
  );
