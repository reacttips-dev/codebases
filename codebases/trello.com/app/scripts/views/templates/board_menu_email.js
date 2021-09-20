// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'board_menu_email',
);

module.exports = t.renderable(function ({
  commentsEnabled,
  email,
  listName,
  lists,
  position,
  positionName,
}) {
  if (!commentsEnabled) {
    t.p(() => t.format('requires-comments-enabled'));
    t.p(() => t.format('enabled-by-enabling-comments'));
    return;
  }

  t.label({ for: 'boardEmail' }, () =>
    t.format('your-email-address-for-this-board'),
  );
  t.input('.non-empty.js-autofocus', {
    id: 'boardEmail',
    type: 'text',
    name: 'boardEmail',
    readonly: 'readonly',
    placeholder: t.l('loading-ellipsis'),
    value: email,
    style: 'margin: 4px 0 8px;',
  });

  t.a('.quiet-button.js-generate-address', { href: '#' }, () =>
    t.format('generate-a-new-email-address'),
  );
  t.a('.quiet-button.js-send-address', { href: '#' }, () =>
    t.format('email-me-this-address'),
  );

  t.hr();

  t.label(() => t.format('your-emailed-cards-appear-in-ellipsis'));

  t.div('.form-grid', function () {
    t.div(
      '.button-link.setting.form-grid-child.form-grid-child-twothirds',
      function () {
        t.span('.label', () => t.format('list'));
        t.span('.value.js-list-value', () => t.text(listName));
        t.label(() => t.format('list'));
        return t.select('.js-select-list', () =>
          (() => {
            const result = [];
            for (const { id, name, selected } of Array.from(lists)) {
              result.push(
                t.optionSelected(selected, { value: id }, () => t.text(name)),
              );
            }
            return result;
          })(),
        );
      },
    );

    return t.div('.button-link.setting.form-grid-child', function () {
      t.span('.label', () => t.format('position'));
      t.span('.value.js-pos-value', () => t.text(positionName));
      t.label(() => t.format('position'));
      return t.select('.js-select-position', function () {
        t.optionSelected(position === 'top', { value: 'top' }, () =>
          t.format('top'),
        );
        return t.optionSelected(
          position === 'bottom',
          { value: 'bottom' },
          () => t.format('bottom'),
        );
      });
    });
  });

  t.hr();

  return t.p('.u-bottom.quiet', () =>
    t.format(
      'tip-dont-share-this-email-address-anyone-who-has-it-can-add-cards-as-you-when-composing-emails-the-card-title-goes-in-the-subject-and-the-card-description-in-the-body-more-email-formatting-tips',
    ),
  );
});
