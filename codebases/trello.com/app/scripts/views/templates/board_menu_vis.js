// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'board_menu_vis',
);

module.exports = t.renderable(function ({
  current,
  isNewBoard,
  canChange,
  mustChange,
  hasSuperAdmins,
  hasOrg,
  orgName,
  privateRestricted,
  orgRestricted,
  enterpriseRestricted,
  publicRestricted,
  hasEnterprise,
  enterpriseName,
  isTemplate,
  isOrgPremium,
  isTeamlessOwnedBoard,
}) {
  if (mustChange) {
    if (orgName) {
      t.p('.quiet', () => t.format('illegal org visibility', { orgName }));
    } else if (isTeamlessOwnedBoard && enterpriseName) {
      t.p('.quiet', () =>
        t.format('illegal teamless visibility', { enterpriseName }),
      );
    }
  }
  const orgLevel =
    hasEnterprise && enterpriseName && !isTeamlessOwnedBoard
      ? 'with enterprise'
      : hasSuperAdmins
      ? 'with super admins'
      : hasOrg
      ? 'with organization'
      : 'without organization';

  const permissionLevels = {
    private: {
      iconClass: 'icon-private',
      restricted: privateRestricted,
      invalid: !isOrgPremium && isTemplate,
    },
    org: {
      iconClass: 'icon-organization',
      restricted: orgRestricted,
      invalid: isNewBoard && !hasOrg,
    },
    enterprise: {
      iconClass: 'icon-enterprise',
      restricted: hasEnterprise && enterpriseRestricted,
      noEnterprise: !hasEnterprise,
      invalid: isNewBoard && !hasOrg,
    },
    public: {
      iconClass: 'icon-public',
      restricted: publicRestricted,
    },
  };

  if (isTeamlessOwnedBoard) {
    delete permissionLevels.org;
    delete permissionLevels.enterprise;
  }

  return (() => {
    const result = [];
    for (const permissionLevel in permissionLevels) {
      const { restricted, invalid, iconClass, noEnterprise } = permissionLevels[
        permissionLevel
      ];
      result.push(
        t.li(function () {
          const disabled = restricted || invalid || !canChange || noEnterprise;
          return t.a(
            '.js-select',
            {
              class: t.classify({ disabled: disabled }),
              href: '#',
              name: permissionLevel,
            },
            function () {
              t.span('.icon-sm.vis-icon', { class: iconClass }, function () {});
              t.check(current === permissionLevel, permissionLevel);
              return t.span('.sub-name', function () {
                const args =
                  enterpriseName && !isTeamlessOwnedBoard
                    ? { enterpriseName, orgName }
                    : orgName
                    ? { orgName }
                    : {};

                const templateSubtext = isTemplate ? 'is template ' : '';
                t.format(
                  [
                    'permission subtext',
                    `${templateSubtext}${orgLevel}`,
                    permissionLevel,
                  ],
                  args,
                );

                if (canChange && restricted) {
                  t.raw(' ');
                  return t.span('.error', function () {
                    if (isNewBoard) {
                      return t.format([
                        'illegal visibility',
                        hasOrg ? 'create' : 'create teamless',
                      ]);
                    } else {
                      return t.format([
                        'illegal visibility',
                        hasOrg ? 'change' : 'change teamless',
                      ]);
                    }
                  });
                }
              });
            },
          );
        }),
      );
    }
    return result;
  })();
});
