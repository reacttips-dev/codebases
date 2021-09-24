import { getConfig } from 'unified-navigation-ui/config';
import each from 'unified-navigation-ui/utils/each';
import navQuerySelector from 'unified-navigation-ui/utils/navQuerySelector';
import { addDesktopEventListener, addMobileEventListener } from 'unified-navigation-ui/utils/eventListeners';
import { navigationTemplate } from 'unified-navigation-ui/html/jsTemplates/navigationTemplate';
import setupNavInteractions from './interactions/setupNavInteractions';
import setupDesktopInteractions from './interactions/setupDesktopInteractions';
import setupMobileInteractions from './interactions/setupMobileInteractions';
import { setTranslations } from 'unified-navigation-ui/js/utils/NavI18n';
import isApp from 'unified-navigation-ui/js/utils/isApp';
import loadDependentScripts from 'unified-navigation-ui/js/utils/loadDependentScripts';
import { userIsEnrolledInOnboarding } from 'unified-navigation-ui/js/utils/onboardingUtils';
import { loadNavigation } from 'unified-navigation-ui/js/utils/loadDependentScripts';

function getNavEl() {
  return document.getElementById('hs-nav-v4');
}

var PANEL_PADDING = 32; // = upper + lower padding on a nav dropdown

var NAV_ITEM_HEIGHT = 38;

function isCondensed(children) {
  return children.length > 8; // Home link + 7 dropdowns
}

export function addExtraFields(children, currentPath) {
  var onHomePage = false;
  each(children, function (primaryNavItem) {
    if (!primaryNavItem.children) {
      if (primaryNavItem.id === 'home' && currentPath.indexOf(primaryNavItem.path) === 0) {
        primaryNavItem.currentPage = true;
        onHomePage = true;
      }

      return;
    }

    each(primaryNavItem.children, function (secondaryNavItemGroup) {
      var minHeight = 0;

      if (currentPath.indexOf(secondaryNavItemGroup.path) === 0 && !onHomePage) {
        primaryNavItem.currentPage = true;
      }

      if (!secondaryNavItemGroup.children) {
        return;
      }

      each(secondaryNavItemGroup.children, function (secondaryNavItem) {
        if (currentPath.indexOf(secondaryNavItem.path) === 0 && !onHomePage) {
          primaryNavItem.currentPage = true;
        }

        if (!secondaryNavItem.children) {
          return;
        }

        var tertiaryHeight = PANEL_PADDING + NAV_ITEM_HEIGHT * secondaryNavItem.children.length;

        if (tertiaryHeight > minHeight) {
          minHeight = tertiaryHeight;
        }

        each(secondaryNavItem.children, function (navItem) {
          if (currentPath.indexOf(navItem.path) === 0 && !onHomePage) {
            primaryNavItem.currentPage = true;
          }
        });
      });
      primaryNavItem.minHeight = minHeight;
    });
  });
  return children;
}

function setupMarketplace() {
  var marketplace = navQuerySelector('.marketplace-topNav');

  var onClick = function onClick() {
    if (marketplace) {
      if (marketplace.classList.contains('active')) {
        marketplace.classList.remove('active');
      } else {
        marketplace.classList.add('active');
      }
    }
  };

  addDesktopEventListener(marketplace, 'click', onClick);
  addMobileEventListener(marketplace, 'click', onClick);
}

export default function renderNav(callback) {
  function render(resp) {
    var children = resp.children,
        translations = resp.translations,
        user = resp.user,
        portal = resp.portal,
        isAccurate = resp.isAccurate;
    var userId = user.id,
        firstName = user.firstName,
        lastName = user.lastName,
        userEmail = user.email,
        avatarUrl = user.avatarUri,
        scopes = user.scopes,
        attributes = user.attributes,
        displayLanguage = user.displayLanguage;
    var accountName = portal.hubAccountNameOrDomain,
        portalType = portal.portalType,
        gates = portal.gates;
    var isDevPortal = portalType === 'DEV';
    var isEnrolledInOnboarding = userIsEnrolledInOnboarding(attributes, userId);
    translations['LANG_FROM_NAVCONFIG'] = displayLanguage;
    setTranslations(translations);
    getNavEl().innerHTML = navigationTemplate({
      accountName: accountName,
      avatarUrl: avatarUrl,
      hasFilterGate: gates.indexOf('search:checkbox-filters') > -1,
      isApp: isApp(),
      isCondensed: isCondensed(children),
      isDevPortal: isDevPortal,
      navItems: addExtraFields(children, window.location.pathname),
      isAccurate: isAccurate
    });
    document.dispatchEvent(new CustomEvent('hsNavV4Rendered'));
    setupNavInteractions();
    setupDesktopInteractions();
    setupMobileInteractions();
    setupMarketplace();
    loadDependentScripts(scopes);
    callback(); // Sometimes doesn't work in IE

    import(
    /* WebpackChunkName: "nav-deferred" */
    'unified-navigation-ui/NavDeferred').then(function (mod) {
      return mod.default;
    }).then(function (NavDeferred) {
      return new NavDeferred().start({
        accountName: accountName,
        avatarUrl: avatarUrl,
        gates: gates,
        isDevPortal: isDevPortal,
        scopes: scopes,
        userEmail: userEmail,
        userId: userId,
        firstName: firstName,
        lastName: lastName,
        attributes: attributes,
        isEnrolledInOnboarding: isEnrolledInOnboarding
      });
    });
  }

  var configCallback = function configCallback(resp) {
    // should be remove after
    var newNavGates = ['navigation:global-navigation-v1', 'navigation:global-navigation-v2', 'navigation:global-navigation-v3', 'navigation:global-navigation-v4'];
    var newNavScope = resp.portal.gates.filter(function (gate) {
      return newNavGates.includes(gate);
    });

    if (newNavScope.length) {
      loadNavigation();
      return;
    }

    if (!getNavEl()) {
      setTimeout(function () {
        configCallback(resp);
      }, 10);
      return;
    }

    render(resp);

    try {
      window.hubspot.nav.promise.resolve();
    } catch (e) {
      console.log(e);
    }
  };

  getConfig(configCallback);
}