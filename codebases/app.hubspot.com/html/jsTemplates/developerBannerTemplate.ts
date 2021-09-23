import { text } from 'unified-navigation-ui/js/utils/NavI18n';
import { external_link_icon_with_fill } from '../templates/icons/external_link_icon';
export var developerBannerTemplate = function developerBannerTemplate(_ref) {
  var url = _ref.url;
  return "<div class=\"developer-banner-alert hs-nav-v4-alert hs-nav-v4-alert--info\">\n    <b>" + text('nav.alerts.developer.title', {
    defaultValue: 'This is an app developer account.'
  }) + "</b>\n    <span class=\"developer-banner-message\">\n    " + text('nav.alerts.developer.description', {
    defaultValue: 'Learn about the different HubSpot account types and what each one is used for in this'
  }) + "\n    " + ("<a target=\"_blank\" href=\"" + url + "\"><b>" + text('nav.alerts.developer.linkText', {
    defaultValue: 'developer doc.'
  }) + "</b><span class=\"external-logo\">" + external_link_icon_with_fill('#33475b') + "</span></a>") + "\n    </span>\n  </div>";
};