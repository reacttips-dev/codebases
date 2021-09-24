import { escape } from 'unified-navigation-ui/utils/escape';
import getOrigin from 'unified-navigation-ui/utils/getOrigin';
import { getPortalId } from 'unified-navigation-ui/js/utils/getPortalId';
import { assets_icon } from '../templates/icons/assets_icon';
import { integrations_icon } from '../templates/icons/integrations_icon';
import { solutions_icon } from '../templates/icons/solutions_icon';
import { text } from 'unified-navigation-ui/utils/NavI18n';
export var marketplaceMenuTemplate = function marketplaceMenuTemplate() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      isDevPortal = _ref.isDevPortal;

  return "<div class=\"marketplace-menu expansion\">\n<div class=\"marketplace-menu-header\">" + escape(text('nav.tools.marketplaces', {
    defaultValue: 'Marketplaces'
  })) + "</div>\n<a data-tracking=\"click\" id=\"nav-marketplace-apps\" class=\"marketplace-menu-box\" href=\"" + getOrigin() + "/ecosystem/" + getPortalId() + "/marketplace/apps?source=topNav\">\n  " + integrations_icon + "\n  <span>\n  <div class=\"header\">" + text('nav.marketplaces.app.title', {
    defaultValue: 'App Marketplace'
  }) + "</div>\n    <div class=\"description\">" + escape(text('nav.marketplaces.app.body', {
    defaultValue: 'Find apps to integrate with HubSpot'
  })) + "</div>\n  </span>\n</a>\n" + (!isDevPortal ? "<a data-tracking=\"click\" id=\"nav-marketplace-assets\" class=\"marketplace-menu-box\" href=\"" + getOrigin() + "/ecosystem/" + getPortalId() + "/marketplace/assets?source=topNav\">\n  " + assets_icon + "\n  <span>\n    <div class=\"header\">" + escape(text('nav.marketplaces.asset.title', {
    defaultValue: 'Asset Marketplace'
  })) + "</div>\n    <div class=\"description\">" + escape(text('nav.marketplaces.asset.body', {
    defaultValue: 'Find themes, modules, and templates'
  })) + "</div>\n  </span>\n</a>" : '') + "\n<a data-tracking=\"click\" id=\"nav-marketplace-solutions\" class=\"marketplace-menu-box\" href=\"" + getOrigin() + "/ecosystem/" + getPortalId() + "/marketplace/solutions?source=topNav\">\n  " + solutions_icon + "\n  <span>\n    <div class=\"header\">" + escape(text('nav.marketplaces.solutions.title', {
    defaultValue: 'Solutions Directory'
  })) + "</div>\n    <div class=\"description\">" + escape(text('nav.marketplaces.solutions.body', {
    defaultValue: 'Find your perfect service provider match'
  })) + "</div>\n  </span>\n</a>\n" + (!isDevPortal ? "<div class=\"marketplace-menu-manage\">" + escape(text('nav.marketplaces.manage', {
    defaultValue: 'Manage'
  })) + "</div>\n<a data-tracking=\"click\" id=\"nav-marketplace-connected-apps\" class=\"marketplace-menu-link\" href=\"" + getOrigin() + "/integrations-settings/" + getPortalId() + "/installed?source=topNav\">\n  <span>" + escape(text('nav.marketplaces.connectedApps', {
    defaultValue: 'Connected apps'
  })) + "</span>\n<a data-tracking=\"click\" id=\"nav-marketplace-downloads\" class=\"marketplace-menu-link\" href=\"" + getOrigin() + "/marketplace-settings/" + getPortalId() + "/downloads?source=topNav\">\n  <span>" + escape(text('nav.marketplaces.marketplaceDownloads', {
    defaultValue: 'Marketplace downloads'
  })) + "</span>\n</a>" : '') + "\n</div>";
};