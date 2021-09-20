// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'board_member_profile',
);

module.exports = function () {
  t.div('.window-header.u-clearfix', function () {
    t.span('.window-header-icon.icon-lg.icon-activity');
    return t.h2('.window-title', function () {
      t.text(t.mustacheVar('fullName'));
      return t.span('.quiet', { style: 'margin-left: 3px' }, () =>
        t.text(`(${t.mustacheVar('username')})`),
      );
    });
  });

  return t.div('.window-main-col.window-main-col-full', function () {
    t.div('.list-actions', () =>
      t.p('.js-board-member-profile-no-activity', () =>
        t.format('this-member-has-no-board-activity'),
      ),
    );
    return t.a('.show-more.js-more-actions', { href: '#' }, () =>
      t.format('load-more-activity'),
    );
  });
};
