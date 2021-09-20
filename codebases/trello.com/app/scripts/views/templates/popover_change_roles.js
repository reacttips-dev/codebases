// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'popover_change_roles',
);

module.exports = function () {
  t.ul('.pop-over-list', function () {
    t.li(() =>
      t.a(
        {
          class:
            t.mustacheBlock(
              'canMakeAdmin',
              () => 'js-make-admin highlight-icon',
            ) + t.mustacheBlockInverted('canMakeAdmin', () => ' disabled'),
        },
        function () {
          t.check(t.mustacheVar('memberIsAdmin'), 'admin');

          return t.span('.sub-name', () =>
            t.text(t.mustacheVar('roleText_admin')),
          );
        },
      ),
    );

    t.li(() =>
      t.a(
        {
          class:
            t.mustacheBlock(
              'canMakeMember',
              () => 'highlight-icon js-make-member ',
            ) + t.mustacheBlockInverted('canMakeMember', () => ' disabled'),
        },
        function () {
          t.check(t.mustacheVar('memberIsNormal'), 'normal');
          return t.span('.sub-name', () =>
            t.text(t.mustacheVar('roleText_normal')),
          );
        },
      ),
    );

    return t.mustacheBlock('showObserver', () =>
      t.li(() =>
        t.a(
          {
            class:
              t.mustacheBlock(
                'canMakeObserver',
                () => 'highlight-icon js-make-observer ',
              ) + t.mustacheBlockInverted('canMakeObserver', () => ' disabled'),
          },
          function () {
            t.format('observer');
            t.icon('business-class');
            t.mustacheBlock('memberIsObserver', () => t.icon('check'));
            return t.span('.sub-name', () =>
              t.text(t.mustacheVar('roleText_observer')),
            );
          },
        ),
      ),
    );
  });

  return t.mustacheBlockInverted('isMoreThanOneAdmin', () =>
    t.mustacheBlock('memberIsAdmin', function () {
      t.hr();
      return t.p('.quiet.u-bottom', () =>
        t.format(
          'you-can-t-change-roles-because-there-must-be-at-least-one-admin',
        ),
      );
    }),
  );
};
