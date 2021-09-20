// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'popover_add_list',
);

module.exports = t.renderable(function ({
  tooManyTotalLists,
  tooManyOpenLists,
}) {
  if (tooManyTotalLists) {
    t.p(() => t.format('you-have-too-many-lists-on-this-board'));
    return;
  }

  if (tooManyOpenLists) {
    t.p(() => t.format('you-have-too-many-open-lists-on-this-board'));
    return;
  }

  return t.form(function () {
    t.div('.form-grid', function () {
      t.div('.form-grid-child.form-grid-child-threequarters', function () {
        t.label({ for: 'list-name' }, () => t.format('name'));
        return t.input('.js-list-name.js-autofocus', {
          type: 'text',
          id: 'list-name',
          value: t.l('default-list-name'),
          style: 'margin-bottom: 0;',
        });
      });

      return t.div('.form-grid-child', () =>
        t.div(
          '.button-link.setting',
          { style: 'margin-top: 4px;' },
          function () {
            t.span('.label', () => t.format('position'));
            t.span('.value.js-pos-value');
            t.label(() => t.format('position'));
            return t.select('.js-select-list-pos');
          },
        ),
      );
    });

    return t.input('.nch-button.nch-button--primary.wide.js-add-list', {
      type: 'submit',
      value: t.l('add'),
    });
  });
});
