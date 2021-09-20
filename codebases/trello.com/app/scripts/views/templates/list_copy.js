// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'list_copy',
);

module.exports = t.renderable(({ canCopyOpen, canCopyTotal, name }) =>
  t.div(function () {
    const canCopy = canCopyOpen && canCopyTotal;
    t.label(() => t.format('name'));
    t.textarea('.js-autofocus', { name: 'name' }, () => t.text(name));

    t.span(
      '.js-limit-exceeded.error',
      { class: t.classify({ hide: canCopy }) },
      () =>
        t.format(!canCopyOpen ? 'open-limit-exceeded' : 'total-limit-exceeded'),
    );

    return t.input('.nch-button.nch-button--primary.wide.js-submit', {
      type: 'submit',
      value: t.l('create-list'),
      disabled: !canCopy,
    });
  }),
);
