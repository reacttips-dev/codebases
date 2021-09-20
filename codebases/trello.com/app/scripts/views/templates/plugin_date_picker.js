// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'plugin_date_picker',
);

module.exports = t.renderable(function ({ dateOnly }) {
  t.div('.datepicker-select.u-clearfix', function () {
    t.div('.datepicker-select-date', () =>
      t.label('.datepicker-select-label', function () {
        t.format('date');
        return t.input(
          '.datepicker-select-input.js-dpicker-date-input.js-autofocus',
          {
            type: 'text',
            placeholder: t.l('enter-date'),
            tabindex: 101,
          },
        );
      }),
    );

    if (!dateOnly) {
      return t.div('.datepicker-select-time', () =>
        t.label('.datepicker-select-label', function () {
          t.format('time');
          return t.input('.datepicker-select-input.js-dpicker-time-input', {
            type: 'text',
            placeholder: t.l('enter-time'),
            tabindex: 102,
          });
        }),
      );
    }
  });

  t.div('.pickers.js-dpicker-cal');

  return t.div('.datepicker-confirm-btns', () =>
    t.input('.nch-button.nch-button--primary.wide.confirm', {
      type: 'submit',
      value: t.l('submit'),
      tabindex: 103,
    }),
  );
});
