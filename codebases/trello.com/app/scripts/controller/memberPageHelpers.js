const { Auth } = require('app/scripts/db/auth');
const { TrelloStorage } = require('@trello/storage');
const { navigate } = require('app/scripts/controller/navigate');

module.exports.isMemberOfOrg = function (orgname) {
  // Dependency required at call site to avoid import cycles, do not lift to top of module
  const { ModelCache } = require('app/scripts/db/model-cache');

  const me = ModelCache.get('Member', Auth.myId());
  const orgs = me && me.getSortedOrgs();
  return orgs.find((org) => org.get('name') === orgname);
};

module.exports.headerOptsForHome = function ({ orgname, modelCache }) {
  if (!orgname || !modelCache) {
    return {};
  }
  const organization = modelCache.findOne('Organization', 'name', orgname);
  if (
    organization &&
    organization.get('idEnterprise') &&
    organization.getEnterprise()
  ) {
    const enterprise = organization.getEnterprise();
    const prefs = enterprise.get('prefs');
    return {
      headerBrandingColor: prefs && prefs.brandingColor,
      headerBrandingLogo: enterprise.getHeaderLogo(),
      headerBrandingName: enterprise.get('displayName'),
    };
  } else {
    return {};
  }
};

const getHomeLastTabStorageKey = () => `home_${Auth.myId()}_last_tab_2`;

const getHomeDefaultTab = function () {
  return this.getMemberBoardsUrl(Auth.myUsername(), null, true);
};

const getHomeLastTab = function () {
  TrelloStorage.unset(`home_${Auth.myId()}_last_tab`); // Clean up old key

  const defaultTab = getHomeDefaultTab.call(this);
  const lastHomeTab = TrelloStorage.get(getHomeLastTabStorageKey());

  // eslint-disable-next-line eqeqeq
  if (lastHomeTab == null) {
    return defaultTab;
  }

  if (
    !(
      lastHomeTab === '/' ||
      lastHomeTab.endsWith('/boards') ||
      lastHomeTab.endsWith('/home') ||
      lastHomeTab.endsWith('/getting-started')
    )
  ) {
    // Clear out any invalid values
    TrelloStorage.unset(getHomeLastTabStorageKey());
    return defaultTab;
  }

  return lastHomeTab;
};

const redirectHomeToDefaultTab = function () {
  TrelloStorage.unset(getHomeLastTabStorageKey());
  return navigate(getHomeDefaultTab.call(this), {
    trigger: true,
    replace: true,
  });
};

module.exports.getHomeLastTabStorageKey = getHomeLastTabStorageKey;
module.exports.getHomeDefaultTab = getHomeDefaultTab;
module.exports.getHomeLastTab = getHomeLastTab;
module.exports.redirectHomeToDefaultTab = redirectHomeToDefaultTab;
