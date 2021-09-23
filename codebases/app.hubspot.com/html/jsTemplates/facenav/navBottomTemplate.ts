import getOrigin from 'unified-navigation-ui/utils/getOrigin';
import { escape } from 'unified-navigation-ui/utils/escape';
import { text } from 'unified-navigation-ui/js/utils/NavI18n';
export function navBottomTemplate() {
  return "<div class=\"navAccountMenu-bottom \">\n  <div class=\"signout \">\n    <a data-tracking=\"click\" id=\"signout\"\n      href=\"" + encodeURI(getOrigin() + "/login-api/v1/logout/all") + "\">" + escape(text('nav.tools.signOut', {
    defaultValue: 'Sign out'
  })) + "</a></div>\n  <div class=\"privacyPolicy\">\n    <a data-tracking=\"click\" id=\"privacyPolicy\"\n      href=\"https://legal.hubspot.com/product-privacy-policy\">" + escape(text('nav.tools.privacy', {
    defaultValue: 'Privacy policy'
  })) + "</a></div>\n</div>";
}