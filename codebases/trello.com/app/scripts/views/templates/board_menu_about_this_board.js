// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'board_menu_about_this_board',
);

const actionsPartial = t.renderable(function (canComment, canVote, headerKey) {
  if (canComment || canVote) {
    return t.div('.about-this-board-actions-section', function () {
      t.h2('.small-caps', () => t.format(headerKey));
      return t.ul('.pop-over-list.inset', function () {
        if (canComment) {
          t.li(function () {
            t.span('.icon-sm.icon-comment');
            return t.format('comment-on-cards');
          });
        }
        if (canVote) {
          return t.li(function () {
            t.span('.icon-sm.icon-vote');
            return t.format('vote-on-cards');
          });
        }
      });
    });
  }
});

module.exports = t.renderable(function ({
  isLoggedIn,
  isAdmin,
  isNonAdminMember,
  canComment,
  canVote,
  commentHeader,
  votingHeader,
  permissionsHierarchy,
  isTemplate,
}) {
  if (isTemplate && !(isNonAdminMember || isAdmin)) {
    // is admin or member of template
    t.div('.js-search-input-view');
    t.hr();
  }

  // Admin/s profiles
  t.div('.about-this-board-section', function () {
    t.div('.window-module-title.window-module-title-no-divider', function () {
      t.span('.icon-member.icon-lg.window-module-title-icon');
      return t.h3('.u-inline-block', () => t.format('board-admins'));
    });

    // Single admin
    t.div('.js-made-by');

    // Multi admin
    return t.div('.about-this-board-multi-admin', function () {
      t.div('.js-made-by-facepile');
      return t.a(
        '.admin-count.about-this-board-pile-button.pile.js-fill-board-admin-count',
        { href: '#' },
        () => t.span('.admin-count-notifications'),
      );
    });
  });

  // Copy & View counts
  t.div('.js-view-copy-count');

  // Description
  t.div('.about-this-board-section.about-this-board-desc', () =>
    t.div('.js-fill-atb-desc.about-this-board-description-content'),
  );

  // Commenting and voting permissions
  if (!isTemplate && !isNonAdminMember && (canComment || canVote)) {
    return t.div('.about-this-board-section', function () {
      t.hr();
      if (isAdmin) {
        if (permissionsHierarchy === 'equal') {
          actionsPartial(canComment, canVote, commentHeader);
        } else if (permissionsHierarchy === 'comment') {
          actionsPartial(canComment, null, commentHeader);
          actionsPartial(null, canVote, votingHeader);
        } else {
          actionsPartial(null, canVote, votingHeader);
          actionsPartial(canComment, null, commentHeader);
        }
        return t.a('.quiet-button.js-change-permissions', { href: '#' }, () =>
          t.span(() => t.format('change-permissions')),
        );
      } else {
        return actionsPartial(canComment, canVote, 'any-trello-user-can');
      }
    });
  }
});
