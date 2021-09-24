import isQA from './isQA';
import { isHublet, getHublet } from './hublet';
import { getPortalId } from 'unified-navigation-ui/js/utils/getPortalId';
export default function getElevatedJitaAccessLink(userEmail, accountName, scopes) {
  if (scopes.indexOf('nav-elevated-jita-access') === -1) {
    return undefined;
  }

  var params = {
    jitaType: 'ELEVATED',
    email: encodeURIComponent(userEmail),
    jitaDuration: isQA() ? 1440 : 60,
    loginPortalId: getPortalId(),
    loginPortalName: encodeURIComponent(accountName),
    loginRedirectUrl: encodeURIComponent(window.location.href)
  };
  var hubletSuffix = isHublet() ? "-" + getHublet() : '';
  var elevatedJitaUrl = "https://tools" + hubletSuffix + ".hubteam" + (isQA() ? 'qa' : '') + ".com/login/jita?";
  return Object.keys(params).reduce(function (url, param) {
    return "" + url + param + "=" + params[param] + "&";
  }, elevatedJitaUrl);
}