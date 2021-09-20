/* eslint-disable @trello/disallow-filenames */
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Util } = require('app/scripts/lib/util');
const _ = require('underscore');

const {
  GOLD_RECOMMENDATION,
  GOLD_UPGRADE,
} = require('app/scripts/data/gold-banners');

const {
  ORG_TYPE_BUSINESS_CLASS,
  ORG_TYPE_ENTERPRISE,
} = require('app/scripts/data/org-types');

const PAID_ORG_TYPES = [ORG_TYPE_ENTERPRISE, ORG_TYPE_BUSINESS_CLASS];

const BANNER_TYPES = {
  ENTERPRISE_UPGRADE: {
    type: 'ENTERPRISE_UPGRADE',
    heading: 'welcome heading ent',
    teamheading: 'welcome heading-team ent',
    subheading: 'welcome subheading-get set up',
    isUpgrade: true,
    orgType: ORG_TYPE_ENTERPRISE,
    doesIncludeGold: true,
    tips: [
      {
        key: 'tip-power-ups',
        url:
          'https://trello.com/power-ups?utm_source=welcome-banner&utm_medium=inapp&utm_term=ent-upgrade-member',
      },
      {
        key: 'tip-team playbooks',
        url:
          'https://trello.com/teams?utm_source=welcome-banner&utm_medium=inapp&utm_term=ent-upgrade-member',
      },
      {
        key: 'tip-enterprise guide',
        url:
          'https://trello.com/guide/enterprise?utm_source=welcome-banner&utm_medium=inapp&utm_term=ent-upgrade-member',
      },
    ],
  },
  ENTERPRISE_UPGRADE_ADMIN: {
    type: 'ENTERPRISE_UPGRADE_ADMIN',
    heading: 'welcome heading ent',
    teamheading: 'welcome heading-team ent',
    subheading: 'welcome subheading-get set up',
    orgType: ORG_TYPE_ENTERPRISE,
    doesIncludeGold: true,
    isUpgrade: true,
    tips: [
      {
        key: 'tip-set up enterprise',
        url:
          'https://trello.com/guide/enterprise/enduser?utm_source=welcome-banner&utm_medium=inapp&utm_term=ent-upgrade-admin',
      },
      {
        key: 'tip-power-ups',
        url:
          'https://trello.com/guide/enterprise/enduser?utm_source=welcome-banner&utm_medium=inapp&utm_term=ent-upgrade-admin',
      },
      {
        key: 'tip-sso',
        url:
          'https://trello.com/guide/enterprise/sysadmin?utm_source=welcome-banner&utm_medium=inapp&utm_term=ent-upgrade-admin',
      },
    ],
  },
};

Object.keys(BANNER_TYPES).forEach((bannerType, i) => {
  return (BANNER_TYPES[bannerType].precedence = i);
});

// This is to make sure we only show banners to people who joined after
// the team banners were released. This prevented us from having to do
// a ginormous backfill to mark banners as dismissed for our existing users
const isNewMember = (member) => {
  return Util.idToDate(member.id) > 1493824588000;
};

const getBannerId = (orgType, idOrg) => {
  return ['team-boards-page', orgType, idOrg, 'banner'].join('-');
};

const getOrgBanner = (member, org) => {
  const idBCBanner = getBannerId(ORG_TYPE_BUSINESS_CLASS, org.id);

  const isMemberNew = isNewMember(member);
  const orgDisplayName = org.attributes[org.nameAttr];

  if (org.belongsToRealEnterprise()) {
    const idEnterprise = org.get('idEnterprise');

    const idEnterpriseBanner = getBannerId(ORG_TYPE_ENTERPRISE, idEnterprise);
    const isEnterpriseAdmin =
      member.get('idEnterprisesAdmin').indexOf(idEnterprise) >= 0;

    const hasUpgradedOrg = member.isDismissed(idBCBanner) || isMemberNew;

    const props = (() => {
      switch (true) {
        case isEnterpriseAdmin:
          return BANNER_TYPES.ENTERPRISE_UPGRADE_ADMIN;
        case !isEnterpriseAdmin && hasUpgradedOrg:
          return BANNER_TYPES.ENTERPRISE_UPGRADE;
        default:
          return null;
      }
    })();

    if (props === null) {
      return null;
    }

    return _.extend(
      {
        id: idEnterpriseBanner,
        idBannersToDismiss: [idEnterpriseBanner, idBCBanner],
        orgDisplayName,
        bannerViewedEvent: {
          bannerName: 'enterpriseUpgradeBanner',
          source: 'memberHomeScreen',
          containers: {
            enterprise: {
              id: idEnterprise,
            },
            workspace: {
              id: org.id,
            },
          },
          attributes: {
            type: props.type,
          },
        },
      },
      props,
    );
  } else {
    return null;
  }
};

module.exports.getTeamBanner = (member) => {
  const orgBanners = member.organizationList.map((org) =>
    getOrgBanner(member, org),
  );

  const banners = _.chain(orgBanners)
    .compact()
    .reject((banner) => member.isDismissed(banner.id));

  const bannerToDisplay = _.chain(banners)
    .sortBy((banner) => banner.precedence)
    .first()
    .value();

  const idBannersToDismiss = _.chain(banners)
    .pluck('idBannersToDismiss')
    .flatten()
    .value();

  // Members of Enterprise and Business Class teams are automatically
  // made gold members, so make sure that the gold banner gets dismissed
  // along with banners for those
  if (
    bannerToDisplay &&
    Array.from(PAID_ORG_TYPES).includes(bannerToDisplay.orgType)
  ) {
    idBannersToDismiss.push(GOLD_UPGRADE);
    idBannersToDismiss.push(GOLD_RECOMMENDATION);
  }

  return { bannerToDisplay, idBannersToDismiss };
};
