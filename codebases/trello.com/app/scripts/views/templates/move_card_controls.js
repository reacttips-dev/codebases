// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'move_card_controls',
);
const { SelectTestIds } = require('@trello/test-ids');

module.exports = function () {
  t.mustacheBlockInverted('hideBoard', function () {
    t.div('.form-grid', function () {
      t.div(
        '.form-grid-child.form-grid-child-full',
        {
          class: t.classify({
            hide: !t.mustacheVar('restrictToCurrentBoard'),
          }),
        },
        function () {
          t.label(() => t.format('board'));
          return t.p(() =>
            t.mustacheBlock('organizations', () =>
              t.mustacheBlock('boards', () => t.text(t.mustacheVar('name'))),
            ),
          );
        },
      );
      return t.div(
        '.button-link.setting.form-grid-child.form-grid-child-full',
        {
          class: t.classify({
            hide: t.mustacheVar('restrictToCurrentBoard'),
          }),
        },
        function () {
          t.span('.label', () => t.format('board'));
          t.span('.value.js-board-value');
          t.label(() => t.format('board'));
          return t.select(
            '.js-select-board',
            {
              'data-test-id': SelectTestIds.MoveBoardSelect,
            },
            () =>
              t.mustacheBlock('organizations', () =>
                t.optgroup({ label: t.mustacheVar('displayName') }, () =>
                  t.mustacheBlock('boards', () =>
                    t.optionSelected(
                      t.mustacheVar('selected'),
                      { value: t.mustacheVar('id') },
                      function () {
                        t.text(t.mustacheVar('name'));
                        return t.mustacheBlock('selected', function () {
                          t.text(' ');
                          return t.format('current');
                        });
                      },
                    ),
                  ),
                ),
              ),
          );
        },
      );
    });

    return t.mustacheBlock('hasEnterprise', () =>
      t.mustacheBlock('enterpriseName', function () {
        t.mustacheBlock('isMove', () =>
          t.p('.quiet', () =>
            t.format('card-can-only-be-moved-to-teams-within-org', {
              enterpriseName: t.mustacheVar('enterpriseName'),
            }),
          ),
        );
        return t.mustacheBlock('isCopy', () =>
          t.p('.quiet', () =>
            t.format('card-can-only-be-copied-to-teams-within-org', {
              enterpriseName: t.mustacheVar('enterpriseName'),
            }),
          ),
        );
      }),
    );
  });

  return t.div('.form-grid', function () {
    t.div(
      '.button-link.setting.form-grid-child.form-grid-child-threequarters',
      function () {
        t.span('.label', () => t.format('list'));
        t.span('.value.js-list-value');
        t.label(() => t.format('list'));
        return t.select('.js-select-list');
      },
    );

    return t.div('.button-link.setting.form-grid-child', function () {
      t.span('.label', () => t.format('position'));
      t.span('.value.js-pos-value');
      t.label(() => t.format('position'));
      return t.select('.js-select-position');
    });
  });
};
