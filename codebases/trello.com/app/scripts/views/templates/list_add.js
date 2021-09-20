// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')('list_add');

module.exports = t.renderable(function ({
  tooManyTotalLists,
  tooManyOpenLists,
  isFirstList,
}) {
  const tooManyLists = tooManyTotalLists || tooManyOpenLists;

  return t.form(function () {
    t.a(
      {
        href: '#',
        class: t.classify({
          'open-add-list js-open-add-list': !tooManyLists,
          'too-many-lists': tooManyLists,
        }),
      },
      () =>
        t.span('.placeholder', function () {
          if (tooManyTotalLists) {
            return t.format('you-have-too-many-lists');
          } else if (tooManyOpenLists) {
            return t.format('you-have-too-many-open-lists');
          } else {
            t.icon('add');
            if (isFirstList) {
              return t.format('add-a-list');
            } else {
              return t.format('add-another-list');
            }
          }
        }),
    );

    if (!tooManyLists) {
      const placeholder = t.l('enter-list-title-ellipsis');
      const saveText = t.l('add-list');

      t.input('.list-name-input', {
        type: 'text',
        name: 'name',
        placeholder,
        autocomplete: 'off',
        dir: 'auto',
        maxLength: 512,
      });

      return t.div('.list-add-controls.u-clearfix', function () {
        t.input(
          '.nch-button.nch-button--primary.mod-list-add-button.js-save-edit',
          {
            type: 'submit',
            value: saveText,
          },
        );
        return t.a('.icon-lg.icon-close.dark-hover.js-cancel-edit', {
          href: '#',
          'aria-label': t.l('cancel-edit-list'),
        });
      });
    }
  });
});
