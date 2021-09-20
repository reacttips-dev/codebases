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
  'checklist_add_menu',
);

module.exports = t.renderable(function ({
  canCopy,
  canAddChecklistCard,
  canAddChecklistBoard,
  suggestions,
}) {
  if (suggestions.length > 0) {
    t.div('.pop-over-section.js-suggestions', function () {
      t.h4(function () {
        t.icon('sparkle');
        return t.format('suggested');
      });

      suggestions.forEach((checklist) => {
        t.a(
          '.button-link.js-suggested-checklist',
          {
            'data-id': checklist.id,
            'data-name': checklist.name,
            href: '#',
          },
          function () {
            t.icon('checklist');
            return t.text(checklist.name);
          },
        );
      });
    });
  }

  return t.form(function () {
    const canAdd = canAddChecklistCard && canAddChecklistBoard;
    if (!canAdd) {
      t.span(
        '.js-checklist-limit-exeeded.error',
        { class: t.classify({ hide: canAdd }) },
        () =>
          t.format(
            !canAddChecklistCard
              ? 'card-limit-exceeded'
              : 'board-limit-exceeded',
          ),
      );
      return;
    }
    t.label({ for: 'id-checklist' }, () => t.format('title'));
    t.input('.js-checklist-title.js-autofocus', {
      type: 'text',
      id: 'id-checklist',
      value: t.l('default-checklist-name'),
      'data-default': t.l('default-checklist-name'),
      dir: 'auto',
      maxLength: 512,
    });

    if (canCopy) {
      t.span(() => {
        t.label({ for: 'js-checklist-copy-source' }, () =>
          t.format('copy-items-from-ellipsis'),
        );
        return t.select('.js-checklist-copy-source.js-uninitialized', () =>
          t.option({ value: '', selected: true }, () => t.format('none')),
        );
      });
    }

    return t.input(
      '.nch-button.nch-button--primary.wide.confirm.js-add-checklist',
      {
        type: 'submit',
        value: t.l('add'),
      },
    );
  });
});
