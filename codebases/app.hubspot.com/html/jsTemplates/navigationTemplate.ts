import { escape } from 'unified-navigation-ui/utils/escape';
import { homeLinkTemplate } from './homeLinkTemplate';
import filter from '../templates/icons/search/filter';
import { arrow_down_icon } from '../templates/icons/arrow_down_icon';
import { arrow_right_icon } from '../templates/icons/arrow_right_icon';
import { close_icon } from '../templates/icons/close_icon';
import { marketplace_icon } from '../templates/icons/marketplace_icon';
import { primaryLinkTemplate } from './primaryLinkTemplate';
import { primaryMobileLinkTemplate } from './primaryMobileLinkTemplate';
import { marketplaceMenuTemplate } from './marketplaceMenuTemplate';
import search_icon from '../templates/icons/search_icon';
import settings_icon from '../templates/icons/settings_icon';
import notification_icon from '../templates/icons/notifications_icon';
import { text } from 'unified-navigation-ui/utils/NavI18n';
import { getPortalId } from 'unified-navigation-ui/js/utils/getPortalId';
import { alertTemplate } from './alertTemplate';
export var navigationTemplate = function navigationTemplate() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      accountName = _ref.accountName,
      avatarUrl = _ref.avatarUrl,
      _ref$hasFilterGate = _ref.hasFilterGate,
      hasFilterGate = _ref$hasFilterGate === void 0 ? true : _ref$hasFilterGate,
      isApp = _ref.isApp,
      isCondensed = _ref.isCondensed,
      isDevPortal = _ref.isDevPortal,
      _ref$navItems = _ref.navItems,
      navItems = _ref$navItems === void 0 ? [] : _ref$navItems,
      passText = _ref.text,
      _ref$isAccurate = _ref.isAccurate,
      isAccurate = _ref$isAccurate === void 0 ? true : _ref$isAccurate;

  return "\n  <nav id=\"navbar\" role=\"navigation\" " + (isCondensed ? 'class="condensed"' : '') + ">\n  <div class=\"navbar-inner\" style=\"display: none;\">\n  <div>\n  <div class=\"desktop-nav-left-container\">\n  <div class=\"nav-left\">\n  <div aria-label=\"HubSpot Navigation\" role=\"menubar\" class=\"nav-links\">\n  <ul class=\"primary-links\">\n  " + navItems.map(function (item, i) {
    var entry = '';

    if (i === 0) {
      entry += "\n          <li role=\"none\" class=\"home link " + (!isDevPortal && item.currentPage ? 'currentPage' : '') + "\">" + homeLinkTemplate(item) + "</li>\n          ";

      if (isDevPortal) {
        entry += primaryLinkTemplate(item);
      }
    } else {
      entry += primaryLinkTemplate(item);
    }

    return entry;
  }).join('') + "\n  </ul>\n  </div>\n  </div>\n  </div>\n\n  <div class=\"mobile-nav-left-container\" style=\"display: none;\">\n  <div class=\"nav-left\">\n  " + navItems.map(function (item, i) {
    var entries = '';

    if (i === 0) {
      entries += homeLinkTemplate(item);
      entries += "<div class=\"menu\"><span>Menu</span> " + arrow_down_icon + "</div>";
    }

    return entries;
  }).join('') + "\n  </div>\n  <div class=\"breadcrumbs\">\n  <a class=\"menu-crumb\">Menu</a> " + arrow_right_icon + "\n  <a class=\"secondary-crumb-text\">" + (passText ? escape(passText) : '') + "</a>\n  <div class=\"tertiary-crumb\">\n  " + arrow_right_icon + "\n  <a class=\"tertiary-crumb-text\">" + (passText ? escape(passText) : '') + "</a>\n  </div>\n  <a class=\"close-menu\">\n  " + close_icon + "\n  </a>\n  </div>\n  <div aria-label=\"HubSpot Navigation\" role=\"menubar\" class=\"nav-links\">\n  <ul class=\"primary-links\">\n  " + navItems.map(function (item, i) {
    var entries = '';

    if (i) {
      entries += primaryMobileLinkTemplate(item);
    }

    return entries;
  }).join('') + "\n  </ul>\n  </div>\n  </div>\n  </div>\n  <div class=\"navtools\">\n  " + (!isDevPortal ? "\n  <div class=\"navSearch-v2\">\n  <div class=\"navSearch-inputWrapper\">\n  <input data-tracking=\"focus\" type=\"text\" id=\"navSearch-input\" class=\"navSearch-input\" autocomplete=\"off\" maxLength=\"200\">\n  <a class=\"primary-link primary-link--icon navSearch-icon\">\n  " + search_icon(escape(text('nav.icons.search', {
    defaultValue: 'Search'
  })) || undefined) + "\n  </a>\n  <button class=\"navSearch-input-button hidden\"></button>\n  " + (hasFilterGate ? "<div class=\"navSearch-input-filter\"><div class=\"filter-icon\">" + filter + "</div><span class=\"navSearch-filter-label\">" + text('nav.search.filter', {
    defaultValue: 'Filter'
  }) + "</span><span class=\"navSearch-filter-counter\"></span><div class=\"arrow-icon\">" + arrow_down_icon + "</div></div>\n         <div class=\"navSearch-filter-checkboxes hidden\"></div>" : '') + "\n  </div>\n  <div class=\"navSearch-container\"></div>\n  </div>\n  " : '') + "\n\n  <div class=\"marketplace-topNav\">\n  <button data-tracking=\"click\" id=\"nav-marketplace-menu\" class=\"primary-link primary-link--icon\">\n  " + marketplace_icon + "\n  </button>\n  " + marketplaceMenuTemplate({
    isDevPortal: isDevPortal
  }) + "\n  </div>\n  <div class=\"settings\">\n  <a data-tracking=\"click\" id=\"navSetting\" href=\"/user-preferences/" + (getPortalId() || '') + "\" class=\"primary-link primary-link--icon\">\n  " + settings_icon(text('nav.icons.settings', {
    defaultValue: 'Settings'
  })) + "\n  </a>\n  </div>\n  " + (isApp ? " <div class=\"navNotifications\">\n  <button data-tracking=\"click\" id=\"navNotifications\" class=\"primary-link primary-link--icon\">\n  " + notification_icon(text('nav.icons.notification', {
    defaultValue: 'Notifications'
  })) + "</button></div>" : '') + "\n  <div class=\"tool-divider\"></div>\n  <div id=\"account-menu-container\" class=\"user-account expandable\">\n  <button data-tracking=\"click\" id=\"account-menu\" class=\"primary-link\" aria-haspopup=\"true\"\n  aria-expanded=\"false\">\n  <img class=\" nav-avatar \" src=\"" + (avatarUrl ? encodeURI(avatarUrl) : '') + " \">\n  <span class=\"account-name \">" + (accountName ? escape(accountName) : '') + "</span>\n  " + arrow_down_icon + "\n  </button>\n  <div class=\"accountexpansion expansion\">\n  </div>\n  </div></div></div></nav>" + (!isAccurate ? alertTemplate({
    level: 'danger',
    title: escape(text('nav.alerts.inaccurateNav.title', {
      defaultValue: 'Sorry. The server was unable to accurately determine what tools you have access to.'
    })),
    dangerouslySetDescription: escape(text('nav.alerts.inaccurateNav.description', {
      defaultValue: 'Please check our system status for outages:'
    })),
    link: 'https://status.hubspot.com/',
    linkText: escape(text('nav.alerts.inaccurateNav.linkText', {
      defaultValue: 'HubSpot Status'
    }))
  }) : '');
};