// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'popover_set_list_limit',
);

module.exports = t.renderable(({ limit }) =>
  t.div(function () {
    t.label(function () {
      t.format('maximum-cards');
      return t.input('.set-list-limit.js-autofocus.js-list-limit-input', {
        name: 'list-limit',
        min: 0,
        max: 5000,
        placeholder: t.l('no-limit-set'),
        type: 'number',
        value: limit,
      });
    });
    t.p('.quiet', () =>
      t.format(
        'highlight-this-list-if-the-number-of-cards-in-it-passes-this-limit',
      ),
    );
    return t.div('.set-list-limit-buttons', function () {
      t.input('.nch-button.nch-button--primary.wide.js-submit', {
        type: 'submit',
        value: t.l('save'),
      });
      return t.button(
        '.nch-button.nch-button--danger.js-remove-limit',
        { type: 'button' },
        () => t.format('remove'),
      );
    });
  }),
);
