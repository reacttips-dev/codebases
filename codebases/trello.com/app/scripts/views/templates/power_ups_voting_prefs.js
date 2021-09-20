// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'power_ups_voting_prefs',
);

module.exports = t.renderable(function ({
  canChange,
  canSetObservers,
  canSetOrganization,
  canSetPublic,
  votingMode,
  hideVotes,
}) {
  t.h4(() => t.format('who-is-allowed-to-vote-on-cards'));

  t.ul('.pop-over-list', function () {
    t.li(() =>
      t.a(
        '.js-voting-select',
        {
          href: '#',
          class: t.classify({ disabled: !canChange }),
          name: 'members',
        },
        function () {
          t.span('.name', () => t.format('members'));

          if (votingMode === 'members') {
            t.icon('check');
          }

          return t.span('.sub-name', () =>
            t.format('admins-and-board-members-can-vote'),
          );
        },
      ),
    );

    t.li(() =>
      t.a(
        '.js-voting-select',
        {
          href: '#',
          class: t.classify({ disabled: !canChange || !canSetObservers }),
          name: 'observers',
        },
        function () {
          t.span('.name', () => t.format('members-and-observers'));

          if (votingMode === 'observers') {
            t.icon('check');
          }

          return t.span('.sub-name', () =>
            t.format('admins-board-members-and-observers-can-vote'),
          );
        },
      ),
    );

    t.li(() =>
      t.a(
        '.js-voting-select',
        {
          href: '#',
          class: t.classify({ disabled: !canChange || !canSetOrganization }),
          name: 'org',
        },
        function () {
          t.span('.name', () => t.format('organization-members'));

          if (votingMode === 'org') {
            t.icon('check');
          }

          return t.span('.sub-name', () =>
            t.format(
              'admins-board-members-observers-and-team-members-can-vote',
            ),
          );
        },
      ),
    );

    return t.li(() =>
      t.a(
        '.js-voting-select',
        {
          href: '#',
          class: t.classify({ disabled: !canChange || !canSetPublic }),
          name: 'public',
        },
        function () {
          t.span('.name', () => t.format('public-members'));

          if (votingMode === 'public') {
            t.icon('check');
          }

          return t.span('.sub-name', () =>
            t.format('any-trello-user-can-vote'),
          );
        },
      ),
    );
  });

  t.tag('hr');

  t.h4(() => t.format('hide-vote-counts'));

  return t.ul('.pop-over-list', () =>
    t.li(() =>
      t.a(
        '.js-vote-count-select',
        {
          href: '#',
          class: t.classify({ disabled: !canChange }),
          name: 'hideVoteCount',
        },
        function () {
          t.span('.name', () => t.format('hide-vote-counts-except-mine'));

          if (hideVotes) {
            t.icon('check');
          }

          return t.span('.sub-name', () =>
            t.format('hide-vote-counts-except-mine-explain'),
          );
        },
      ),
    ),
  );
});
