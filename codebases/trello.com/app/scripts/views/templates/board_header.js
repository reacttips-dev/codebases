// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { localizeCount } = require('app/scripts/lib/localize-count');
const { asNumber } = require('@trello/i18n/formatters');

const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'board_header',
);

const { featureFlagClient } = require('@trello/feature-flag-client');
const isInFilteringExperiment = featureFlagClient.getTrackedVariation(
  'board-header-filtering-experiment',
  false,
);
const isBoardHeaderFilterEnabled = featureFlagClient.get(
  'ecosystem.board-header-filter',
  false,
);
const isBCRebrandActive = featureFlagClient.getTrackedVariation(
  'nusku.rename-bc-premium',
  false,
);

module.exports = t.renderable(function ({
  canRename,
  orgLogoUrl,
  orgLogoUrl2x,
  isStandard,
  hasBusinessClass,
  isBusinessClass,
  isRetiredBusinessClass,
  isEnterprise,
  orgDisplayName,
  name,
  orgName,
  isLoggedIn,
  isAdmin,
  isMember,
  isPrivateTeam,
  isUntitled,
  canJoin,
  canInviteMembers,
  selfJoin,
  canAssign,
  showCopyButton,
  boardCardCount,
  isPrivateTeamForEnterpriseVisibleBoard,
  isTemplate,
  starTooltipKey,
  currentBoardView,
}) {
  const boardType = isStandard
    ? 'STA'
    : isBusinessClass
    ? 'BC'
    : isEnterprise
    ? 'ENT'
    : 'Free';

  const classes = {
    'board-header-btn': true,
    'mod-board-name': true,
    'inline-rename-board': true,
    'js-rename-board': canRename,
    'no-edit': !canRename,
    'should-rename': isUntitled && canRename,
  };

  const displayNameClasses = {
    'board-header-btn': true,
    'board-header-btn-org-name': true,
    'js-open-org-menu': true,
    'board-header-btn-without-icon': !orgLogoUrl,
  };

  const boardViewButtonIconClasses = t.classify({
    'icon-sm': true,
    'board-header-btn-icon': true,
    'icon-calendar': currentBoardView === 'calendar',
    'icon-map': currentBoardView === 'map',
    'icon-list': currentBoardView === 'list',
  });

  const isPluginCleanupEnabled = featureFlagClient.get(
    'ecosystem.pup-header-cleanup',
    false,
  );

  t.div('.js-board-views-btn-container', () =>
    t.a(
      '.board-header-btn',
      { href: '#' },
      t.span({ class: 'board-views-btn-new-pill' }),
      () => t.span({ class: boardViewButtonIconClasses }),
      t.span({ class: 'board-views-btn-text-label' }),
      t.span({ class: 'board-views-btn-dropdown-icon' }),
    ),
  );

  t.div({ href: '#', class: t.classify(classes) }, function () {
    t.h1(
      '.js-board-editing-target.board-header-btn-text',
      { dir: 'auto' },
      () => t.text(name),
    );

    return t.input('.board-name-input.js-board-name-input', {
      'aria-label': name,
      spellcheck: 'false',
      dir: 'auto',
      maxLength: 512,
      value: name,
    });
  });

  if (isTemplate) {
    t.div('.board-header-btn-template-badge.js-board-template-badge');
  }

  if (isLoggedIn) {
    t.a(
      '.board-header-btn.js-star-board',
      {
        href: '#',
        title: t.l(starTooltipKey),
        'aria-label': t.l('star-or-unstar-board'),
      },
      () => t.icon('star', { class: 'board-header-btn-icon' }),
    );
  }

  t.div(
    '.js-board-header-btn-org-wrapper.board-header-btn-org-wrapper',
    function () {
      if (orgDisplayName && orgName) {
        t.span('.board-header-btn-divider');
        t.a(
          {
            href: `/${orgName}`,
            class: t.classify(displayNameClasses),
            data: { boardtype: boardType },
          },
          function () {
            if (orgLogoUrl) {
              t.div('.board-header-btn-name-org-logo-container', () =>
                t.img({
                  class: 'board-header-btn-name-org-logo',
                  src: orgLogoUrl,
                  srcSet: `${orgLogoUrl} 1x, ${orgLogoUrl2x} 2x`,
                }),
              );
            }
            return t.span('.board-header-btn-text', function () {
              t.text(orgDisplayName);
              if (!isBCRebrandActive || isRetiredBusinessClass) {
                t.span('.org-label', () => t.text(boardType));
              }
            });
          },
        );
        t.span('.board-header-btn-divider');
      }

      t.div('.board-header-btns.mod-left', function () {
        if (!orgDisplayName && !isTemplate) {
          t.span('.board-header-btn-divider');
          if (
            (isMember && isPrivateTeam) ||
            isPrivateTeamForEnterpriseVisibleBoard
          ) {
            t.span(
              '.board-header-btn.board-header-btn-without-icon.board-header-btn-text.no-edit',
              () => t.format('private-workspace'),
            );
            return t.span('.board-header-btn-divider');
          } else if (!isPrivateTeam && !isTemplate) {
            t.span('#workspaces-preamble-board-header-button');
            return t.span('.board-header-btn-divider');
          }
        }
      });

      return t.a('.board-header-btn.perms-btn.js-change-vis', {
        href: '#',
        id: 'permission-level',
      });
    },
  );

  t.span('.board-header-btn-divider');

  t.div('.board-header-btns.mod-left', function () {
    t.div('.board-header-facepile.js-fill-facepile', {
      class: t.classify({ 'js-list-draggable-board-members': canAssign }),
    });

    t.a(
      '#member-count.board-header-btn.board-header-btn-member-count.js-open-show-all-board-members.js-fill-board-member-count',
      { href: '#' },
      function () {},
    );
    t.span('#member-count-notifications');

    if (canInviteMembers) {
      t.span('#workspaces-preamble-invite-button');
    }

    if (canJoin && !isTemplate) {
      return t.a(
        '.board-header-btn.board-header-btn-without-icon.board-header-btn-join-board.js-join-board',
        { href: '#', title: t.l('workspace-members-can-join-this-board') },
        () =>
          // hovertext to replace helper
          t.span('.board-header-btn-text', () => t.format('join-board')),
      );
    }
  });

  t.div('.board-header-btns.mod-right', function () {
    if (!isInFilteringExperiment && !isBoardHeaderFilterEnabled) {
      t.a(
        '.board-header-btn.mod-filter-indicator.hide.js-filter-cards-indicator.board-header-btn-without-icon',
        { href: '#' },
        function () {
          t.span('.board-header-btn-text', () =>
            t.text(localizeCount('search-results', boardCardCount)),
          );
          return t.icon('close', {
            class: 'board-header-btn-icon-close js-filter-card-clear',
          });
        },
      );
    }

    if (isPluginCleanupEnabled) {
      t.span('.js-pup-dropdown-list-btn board-header-btn-react-container');
    }

    t.a(
      '.board-header-btn.sub-btn.hide.js-board-header-subscribed',
      { href: '#' },
      function () {
        t.icon('subscribe', { class: 'board-header-btn-icon' });
        return t.span('.board-header-btn-text', () => t.format('watch'));
      },
    );

    t.span('.js-calendar-board-btn board-header-btn-react-container');

    t.a('.board-header-btn.hide.js-map-btn', { href: '#' }, function () {
      t.span('.icon-sm.icon-location.board-header-btn-icon');
      return t.span('.board-header-btn-text', () => t.format('map'));
    });

    t.span('.js-butler-header-btns board-header-btn-react-container');
    if (!isPluginCleanupEnabled) {
      t.span('.js-plugin-header-btns');
    }

    if (isLoggedIn && showCopyButton && !isTemplate) {
      t.a('.board-header-btn.js-copy-board', { href: '#' }, function () {
        t.icon('board', { class: 'board-header-btn-icon' });
        return t.span('.board-header-btn-text', () => t.format('copy-board'));
      });
    }

    if (isBoardHeaderFilterEnabled) {
      t.span('.board-header-btn-divider');

      t.span(
        '.js-board-header-filter-btn-container board-header-btn-react-container',
      );
    } else {
      if (isInFilteringExperiment) {
        t.a(
          '.board-header-btn.js-header-filter-btn',
          { href: '#' },
          function () {
            t.icon('filter', { class: 'board-header-btn-icon' });
            t.span('.board-header-filter-btn-text', () => {
              return t.format('filter');
            });
            return t.span(
              '.board-header-filter-count.js-filter-cards-count',
              () => {
                return t.text(asNumber(boardCardCount));
              },
            );
          },
        );
      }
    }

    return t.a(
      '.board-header-btn.mod-show-menu.js-show-sidebar',
      { href: '#' },
      function () {
        t.icon('overflow-menu-horizontal', { class: 'board-header-btn-icon' });
        return t.span('.board-header-btn-text', () => t.format('show-menu'));
      },
    );
  });

  t.div('#workspaces-auto-name-alert');

  return t.span('#board-header-notification');
});
