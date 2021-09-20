// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'popover_board_header_org_menu',
);

module.exports = t.renderable(
  ({
    blockTeamlessBoardsEnabled,
    canChangeOrg,
    setOrgNull,
    name,
    products,
    isOrgMember,
    upsellEnabled,
    repackagingGTMEnabled,
    skipReactRender,
  }) =>
    t.ul('.pop-over-list', function () {
      if (canChangeOrg) {
        if (blockTeamlessBoardsEnabled) {
          t.li(() =>
            t.a('.js-change-org', { href: '#' }, function () {
              t.format('change-organization-ellipsis');
            }),
          );
        } else {
          t.li(() =>
            t.a('.js-change-org', { href: '#' }, function () {
              if (setOrgNull) {
                t.format('remove-from-organization');
              }
              if (!setOrgNull) {
                return t.format('change-organization-ellipsis');
              }
            }),
          );
        }
      }
      t.li(() =>
        t.a('.js-view-org', { href: `/${name}` }, () =>
          t.format('view-organization-page'),
        ),
      );
      if (
        (!products.length || repackagingGTMEnabled) &&
        isOrgMember &&
        upsellEnabled &&
        !skipReactRender
      ) {
        return t.li('.divide', () => {
          return t.div({ id: 'upgrade-path-react-component' });
        });
      }
    }),
);
