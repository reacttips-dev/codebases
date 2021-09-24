import getOrigin from 'unified-navigation-ui/utils/getOrigin';
import { escape } from 'unified-navigation-ui/utils/escape';
import { getPortalId } from 'unified-navigation-ui/js/utils/getPortalId';
import { text } from 'unified-navigation-ui/js/utils/NavI18n';
import { formatName } from '../../../js/utils/NavI18n';
export function userPreferencesTemplate() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$avatarUrl = _ref.avatarUrl,
      avatarUrl = _ref$avatarUrl === void 0 ? 'https://static.hsappstatic.net/salesImages/static-1.362/avatars/default-avatar.png' : _ref$avatarUrl,
      _ref$firstName = _ref.firstName,
      firstName = _ref$firstName === void 0 ? '' : _ref$firstName,
      _ref$lastName = _ref.lastName,
      lastName = _ref$lastName === void 0 ? '' : _ref$lastName,
      _ref$userEmail = _ref.userEmail,
      userEmail = _ref$userEmail === void 0 ? '…' : _ref$userEmail;

  return "\n  <div class=\"userpreferences\">\n  <a data-tracking=\"click\" id=\"userPreferences\" " + ("href=\"" + getOrigin() + "/user-preferences/" + (getPortalId() ? getPortalId() : '') + "\"") + ">\n    <img class=\"nav-avatar\" src=\"" + encodeURI(avatarUrl) + "\">\n    <div class=\"user-info\">\n      <div class=\"user-info-name\">" + (escape(formatName({
    firstName: firstName,
    lastName: lastName
  })) || '…') + "</div>\n      <div class=\"user-info-email\">" + escape(userEmail) + "</div>\n      <div class=\"user-info-preferences\">" + text('nav.tools.profileAndPreferences', {
    defaultValue: 'Profile & Preferences'
  }) + "</div>\n    </div>\n  </a>\n</div>\n  ";
}