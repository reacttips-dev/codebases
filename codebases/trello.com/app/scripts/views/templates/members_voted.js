// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'members_voted',
);
const memberTemplate = require('./member');

module.exports = function () {
  t.mustacheBlock('loading', () =>
    t.p('.quiet.u-text-align-center', { style: 'margin: 24px 0;' }, () =>
      t.format('loading-ellipsis'),
    ),
  );

  return t.mustacheBlockInverted('loading', function () {
    t.div(
      {
        class: `list-voters u-clearfix ${t.mustacheBlock(
          'fewMembers',
          () => 'compact',
        )}`,
      },
      () =>
        t.mustacheBlock('members', () =>
          t.div('.voter', function () {
            t.div('.member.member-no-menu', () =>
              memberTemplate(t.mustacheVar('.')),
            );

            return t.mustacheBlock('fewMembers', () =>
              t.p('.title', function () {
                t.text(t.mustacheVar('fullName'));
                t.text(' ');
                return t.span('.quiet', () =>
                  t.text(`(${t.mustacheVar('username')})`),
                );
              }),
            );
          }),
        ),
    );

    t.mustacheBlock('moreMembers', () =>
      t.a('.show-more.mod-compact.js-more-members-voted', { href: '#' }, () =>
        t.format('show-all-voters-lengthdiff-more', {
          lengthDiff: t.mustacheVar('lengthDiff'),
        }),
      ),
    );

    return t.mustacheBlock('canVote', function () {
      t.hr();

      t.mustacheBlock('voted', () =>
        t.a('.quiet-button.u-text-align-center.js-unvote', { href: '#' }, () =>
          t.format('remove-your-vote'),
        ),
      );

      return t.mustacheBlockInverted('voted', () =>
        t.button(
          '.nch-button.nch-button--primary.full.js-vote',
          { href: '#' },
          () => t.format('vote'),
        ),
      );
    });
  });
};
