'use es6';

import Raven from 'Raven';
import PortalIdParser from 'PortalIdParser'; // Network errors to isolate into groups regardless of URL

var GROUPED_NETWORK_CODES = ['403'];

function stripPortalId(str) {
  var portalId = PortalIdParser.get();
  var portalIdRegex = new RegExp(portalId, 'g');
  return str.replace(portalIdRegex, '<portal_id>');
}

function stripUserId(str) {
  var userIdRegex = /\/(?:user)\/(\d+)?(?:\/|$)/;
  var parsedUserId = userIdRegex.exec(str);
  var userId = parsedUserId && parsedUserId.length && parsedUserId.length > 1 ? parsedUserId[1] : undefined;
  var userIdReplace = new RegExp(userId, 'g');
  return userId ? str.replace(userIdReplace, '<user_id>') : str;
}

function stripQueryParams(url) {
  return url.replace(/\?.*$/, '');
}

function cleanseUrl(url) {
  return stripUserId(stripPortalId(stripQueryParams(url)));
}
/**
 * Group all specified network errors together. Portal and user ids removed
 * to assist grouping
 */


export function catchAndRethrowNetworkError(error) {
  var code = error.errorCode || error.status;

  if (error.options && error.options.url) {
    var cleansedUrl = cleanseUrl(error.options.url);

    if (error.message === "can't access dead object") {
      Raven.captureMessage(error, {
        fingerprint: [cleansedUrl],
        message: error.message
      });
    } else if (code) {
      Raven.captureMessage(error, {
        fingerprint: GROUPED_NETWORK_CODES.includes(code.toString()) ? [code] : [cleansedUrl, code],
        message: code + ": " + cleansedUrl
      });
    }
  }

  throw error;
}