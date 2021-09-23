import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { NavEventType, dispatchNavEvent } from 'unified-navigation-ui/deferred/analytics/navEvent';
import navQuerySelector from 'unified-navigation-ui/utils/navQuerySelector';
import { GET } from 'unified-navigation-ui/utils/API';
import attachHoverTriangleListener from 'unified-navigation-ui/utils/hoverTriangle';
import { accountListTemplate } from 'unified-navigation-ui/html/jsTemplates/accountsTemplate';
import { addDesktopEventListener, addMobileEventListener } from 'unified-navigation-ui/utils/eventListeners';
import getElevatedJitaAccessLink from 'unified-navigation-ui/utils/getElevatedJitaAccessLink';
import { userIsEnrolledInOnboarding } from 'unified-navigation-ui/utils/onboardingUtils';
import { getCachedOnboardingProgress } from 'unified-navigation-ui/utils/onboardingProgressUtils';
import { alertTemplate } from 'unified-navigation-ui/html/jsTemplates/alertTemplate';
import { userPreferencesTemplate } from 'unified-navigation-ui/html/jsTemplates/facenav/userPreferencesTemplate';
import { accountMenuTemplate } from '../../../html/jsTemplates/accountMenuTemplate';
import { text } from 'unified-navigation-ui/utils/NavI18n';
import { getPortalId } from 'unified-navigation-ui/js/utils/getPortalId';
var cachedAccounts;

function getAccountsCallback(_ref) {
  var basicAccounts = _ref.basicAccounts,
      pinnedAccountIds = _ref.pinnedAccountIds;
  var filteredAccounts = basicAccounts.filter(function (account) {
    return account.id.toString() !== getPortalId();
  });
  var pinnedAccounts = pinnedAccountIds.filter(function (accountId) {
    return accountId !== getPortalId();
  }).map(function (pinnedId) {
    return basicAccounts.filter(function (account) {
      return account.id === pinnedId;
    })[0];
  }).filter(function (account) {
    return !!account;
  });
  var otherAccounts = filteredAccounts.filter(function (account) {
    return pinnedAccounts.indexOf(account) === -1;
  }).sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });
  var combinedAccounts = [].concat(_toConsumableArray(pinnedAccounts), _toConsumableArray(otherAccounts));
  cachedAccounts = combinedAccounts;
  var accountSwitcherList = navQuerySelector('.navAccountSwitcher-list-wrapper');
  accountSwitcherList.innerHTML = accountListTemplate(cachedAccounts);

  if (cachedAccounts.length > 0) {
    var accountsNode = navQuerySelector('.navAccounts');
    accountsNode.classList.add('navAccounts-nonEmpty');
  }

  dispatchNavEvent(NavEventType.ACCOUNTS);
}

function showCachedAccounts() {
  var accountSwitcherList = navQuerySelector('.navAccountSwitcher-list-wrapper');
  accountSwitcherList.innerHTML = accountListTemplate(cachedAccounts);

  if (cachedAccounts.length > 1) {
    var accountSwitcher = navQuerySelector('#navAccountSwitcher');
    accountSwitcher.classList.add('navAccountSwitcher-nonEmpty');
  }
}

var getAccounts = function getAccounts() {
  if (cachedAccounts) {
    showCachedAccounts();
    return;
  }

  var portalParam = getPortalId() ? "?portalId=" + getPortalId() : '';
  var path = "/accounts/v1/basic-accounts/pinned" + portalParam;
  var cb = getAccountsCallback;
  GET(path, cb, {
    maxRetries: 5
  });
};

function setupAccountEvents() {
  var link = navQuerySelector('#account-menu');
  link.addEventListener('click', function () {
    if (link.parentElement.classList.contains('active')) {
      link.parentElement.classList.remove('active');
      link.parentElement.querySelector('a').setAttribute('aria-expanded', 'false');
    } else {
      link.parentElement.classList.add('active');
      link.parentElement.querySelector('a').setAttribute('aria-expanded', 'true');
    }
  });
}

export function setupHublessAccountMenu(_ref2) {
  var avatarUrl = _ref2.avatarUrl,
      userEmail = _ref2.userEmail,
      firstName = _ref2.firstName,
      lastName = _ref2.lastName;
  navQuerySelector('#account-menu-container .accountexpansion').innerHTML = accountMenuTemplate({
    userPreferences: userPreferencesTemplate({
      avatarUrl: avatarUrl,
      firstName: firstName,
      lastName: lastName,
      userEmail: userEmail
    })
  });
  setupAccountEvents();
}
export function setupAccountMenu(_ref3) {
  var accountName = _ref3.accountName,
      avatarUrl = _ref3.avatarUrl,
      gates = _ref3.gates,
      userId = _ref3.userId,
      scopes = _ref3.scopes,
      userEmail = _ref3.userEmail,
      firstName = _ref3.firstName,
      lastName = _ref3.lastName,
      attributes = _ref3.attributes,
      isDevPortal = _ref3.isDevPortal;
  var isEnrolledInOnboarding = userIsEnrolledInOnboarding(attributes, userId);
  var initialOnboardingProgress = getCachedOnboardingProgress();
  var hasElevatedJitaAccessScope = scopes.indexOf('nav-elevated-jita-access') > -1;
  var hasElevatedJitaActiveScope = scopes.indexOf('nav-elevated-jita-active') > -1;
  var elevatedJitaAccessLink = getElevatedJitaAccessLink(userEmail, accountName, scopes);
  var alert = hasElevatedJitaAccessScope && (hasElevatedJitaActiveScope ? {
    level: 'warning'
  } : {
    level: 'info',
    title: text('nav.alerts.jitaDefault.title', {
      defaultValue: 'Just-in-time access'
    }),
    linkText: text('nav.alerts.jitaDefault.description', {
      defaultValue: 'Request elevated access'
    }),
    unsafeLink: elevatedJitaAccessLink
  });
  navQuerySelector('#account-menu-container .accountexpansion').innerHTML = accountMenuTemplate({
    accountName: accountName,
    displayOnboardingProgress: isEnrolledInOnboarding,
    initialOnboardingProgress: initialOnboardingProgress,
    maybeAlert: alertTemplate(alert),
    userPreferences: userPreferencesTemplate({
      avatarUrl: avatarUrl,
      firstName: firstName,
      lastName: lastName,
      userEmail: userEmail
    }),
    isDevPortal: isDevPortal,
    isUngatedForAccountDeletion: gates.indexOf('Developers:DeleteAccount') > -1,
    isUngatedForMon505: gates.indexOf('Nav:ReRunMON505') > -1,
    hasProjectAccess: scopes.indexOf('projects-access') > -1
  });
  setupAccountEvents();
}
export function setupAccountList() {
  var accountMenu = navQuerySelector('#account-menu');
  var hubs = navQuerySelector('.navAccounts');

  var loadAccounts = function loadAccounts() {
    getAccounts();
  };

  addDesktopEventListener(accountMenu, 'mouseover', loadAccounts);
  attachHoverTriangleListener(hubs);
}
export function setupAccountListMobile() {
  var accountMenu = navQuerySelector('#account-menu');
  var hubs = navQuerySelector('.navAccounts');

  var loadAccounts = function loadAccounts() {
    getAccounts();
  };

  addMobileEventListener(accountMenu, 'click', loadAccounts);
  addMobileEventListener(hubs, 'click', function () {
    if (hubs.classList.contains('active')) {
      hubs.classList.remove('active');
    } else {
      hubs.classList.add('active');
    }
  });
}