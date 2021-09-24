import { text } from 'unified-navigation-ui/js/utils/NavI18n';
import getOrigin from 'unified-navigation-ui/utils/getOrigin';
export var sandboxBannerTemplate = function sandboxBannerTemplate(_ref) {
  var url = _ref.url;
  return "<div class=\"sandbox-banner-alert hs-nav-v4-alert hs-nav-v4-alert--warning\">\n    <b>" + text('nav.alerts.sandbox.title', {
    defaultValue: 'This is a Sandbox account'
  }) + "</b>\n    <span class=\"sandbox-banner-message\">\n      " + (url ? "<a href=\"" + getOrigin() + "/sandboxes/" + url + "\">" + text('nav.alerts.sandbox.linkText', {
    defaultValue: 'Return to my production account.'
  }) + "</a>" : "" + text('nav.alerts.sandbox.somethingWentWrong', {
    defaultValue: 'Something went wrong finding the url for your production account. Please reload the page to try again.'
  })) + "\n    </span>\n  </div>";
};