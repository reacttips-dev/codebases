// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'popover_move_list',
);

module.exports = t.renderable(function ({
  organizations,
  hasEnterprise,
  enterpriseName,
  restrictToCurrentBoard,
}) {
  t.div('.form-grid', function () {
    t.div(
      '.form-grid-child.form-grid-child-full',
      {
        class: t.classify({
          hide: !restrictToCurrentBoard,
        }),
      },
      function () {
        t.label(() => t.format('board'));
        return t.p(() => t.text(organizations[0].boards[0].name));
      },
    );
    return t.div(
      '.button-link.setting.form-grid-child.form-grid-child-full',
      {
        class: t.classify({
          hide: restrictToCurrentBoard,
        }),
      },
      function () {
        t.span('.label', () => t.format('board'));
        t.span('.value.js-board-value');
        t.label(() => t.format('board'));
        return t.select('.js-select-board', () =>
          Array.from(organizations).map((org) =>
            t.optgroup({ label: org.displayName }, () =>
              Array.from(org.boards).map((board) =>
                t.optionSelected(
                  board.selected,
                  { value: board.id },
                  function () {
                    t.text(board.name);
                    if (board.selected) {
                      t.text(' ');
                      return t.format('current');
                    }
                  },
                ),
              ),
            ),
          ),
        );
      },
    );
  });

  if (hasEnterprise && enterpriseName) {
    t.p('.quiet', () =>
      t.format('list-can-only-be-moved-to-teams-within-org', {
        enterpriseName,
      }),
    );
  }

  t.div('.form-grid', () =>
    t.div(
      '.button-link.setting.form-grid-child.form-grid-child-full',
      function () {
        t.span('.label', () => t.format('position'));
        t.span('.value.js-pos-value');
        t.label(() => t.format('position'));
        return t.select('.js-select-list-pos');
      },
    ),
  );

  t.input('.nch-button.nch-button--primary.wide.js-commit-position', {
    type: 'submit',
    value: t.l('move'),
  });
  return t.p(() =>
    t.span('.error.hide.js-list-limit-exceeded', () =>
      t.format('too many lists'),
    ),
  );
});
