import { text } from 'unified-navigation-ui/js/utils/NavI18n';
import { external_link_icon_with_fill } from '../templates/icons/external_link_icon';
export var iedDeprecatedBannerTemplate = function iedDeprecatedBannerTemplate() {
  return "<div class=\"hs-nav-v4-alert--warning\" style=\"padding: 12px 20px 0\">\n    <div style=\"display: inline-block; width: 80%\">\n      <b>" + text('nav.alerts.ieDeprecated.title', {
    defaultValue: 'HubSpot will no longer support Internet Explorer 11.'
  }) + "</b>\n      <p class=\"ieDeprecated-banner-message\">\n      " + text('nav.alerts.ieDeprecated.description', {
    defaultValue: 'Update your browser to avoid performance issues in HubSpot.'
  }) + "\n      " + ("<a style=\"color: rgb(46, 63, 80)\" target=\"_blank\" href=\"https://knowledge.hubspot.com/resources/which-browsers-are-supported-by-hubspot#update-your-web-browsers\"><b>" + text('nav.alerts.ieDeprecated.linkText', {
    defaultValue: 'Learn how.'
  }) + "</b><span class=\"external-logo\">" + external_link_icon_with_fill('rgb(46, 63, 80)') + "</span></a>") + "\n      </p>\n    </div>\n    <div style=\"display:inline-block; width: 19%; text-align:right;\">\n    <button data-ieDismissButton>" + text('nav.alerts.ieDeprecated.dismiss', {
    defaultValue: 'Dismiss'
  }) + "</button>\n    </div>\n  </div>";
};