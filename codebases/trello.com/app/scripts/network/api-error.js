/* eslint-disable
    default-case,
    eqeqeq,
    no-empty,
    no-unreachable,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { makeErrorEnum } = require('app/scripts/lib/make-error-enum');
const assert = require('app/scripts/lib/assert');
const {
  localizeServerError,
} = require('app/scripts/lib/localize-server-error');
const { featureFlagClient } = require('@trello/feature-flag-client');

const ApiError = makeErrorEnum('API', [
  'Unauthorized',
  'Unauthenticated',
  'Unconfirmed',
  'Timeout',
  'NoResponse',
  'NotFound',
  'PreconditionFailed',
  'Server',
  'BadRequest',
  'Conflict',
  'TooManyRequests',
  'Other',
]);

ApiError.prototype.localizedMessage = function () {
  return localizeServerError(this.message);
};

ApiError.messageFromJSON = function (json) {
  return json?.message || json?.error;
};

ApiError.parseErrorMessage = function (xhrResponse) {
  const { responseJSON, responseText, statusText } = xhrResponse;
  // Server is inconsistent w.r.t. error message formatting. It may send a JSON
  // response with the error nested in responseJSON. It may also send a string
  // in responseText.
  //
  // This establishes a hierarchy for parsing the multiple options. It
  // first looks for the JSON nested fields, then responseText. It falls
  // back to statusText as a last resort.
  return ApiError.messageFromJSON(responseJSON) || responseText || statusText;
};

ApiError.fromResponse = function (statusCode, originalText) {
  if (featureFlagClient.get('feplat.updated-error-from-response', false)) {
    return ApiError.newFromResponse(statusCode, originalText);
  }
  let text;
  if (originalText != null) {
    text = originalText.toLowerCase().trim();
  } else {
    assert(statusCode === 0, 'Received a response without any content!');
  }

  switch (statusCode) {
    case 0:
      return ApiError.NoResponse();
      break;
    case 400:
      switch (text) {
        case 'invalid token': // [INVALID TOKEN]
          return ApiError.Unauthenticated();
        default:
          return ApiError.BadRequest(originalText);
      }
    case 401:
      switch (text) {
        case 'invalid token':
        case 'invalid cookie token':
          return ApiError.Unauthenticated();
        case 'unauthorized permission requested':
        case 'unauthorized organization.':
        case 'unauthorized card permission requested':
          return ApiError.Unauthorized(originalText);
        case 'confirm to view':
          return ApiError.Unconfirmed();
      }
      break;
    case 403:
      switch (text) {
        case 'user not logged in or invalid token.': // [WTF]
          return ApiError.Unauthenticated();
        default:
          return ApiError.Unauthorized(originalText);
      }
    case 404:
      return ApiError.NotFound(originalText);
    case 408:
      return ApiError.Timeout(originalText);
    case 409:
      return ApiError.Conflict(originalText);
    case 412:
      return ApiError.PreconditionFailed(originalText);
    case 449:
      try {
        const parsed = JSON.parse(originalText);
        return ApiError.fromResponse(
          parsed.originalStatus,
          parsed.originalMessage,
        );
      } catch (error) {}
      break;
  }
  // nothing to do if we failed to parse, this will go throug the "other"
  // path below

  if (500 <= statusCode && statusCode < 600) {
    return ApiError.Server(originalText);
  } else {
    return ApiError.Other(`${statusCode}: ${originalText}`);
  }
};

function textFromHtml(html) {
  return html
    .replace(/<(style|script)[^>]*>[\s\S]*?<\/\1>|<[^>]+>/gi, ' ')
    .replace(/ *\n\s*/g, '\n')
    .replace(/ {2,}/g, ' ')
    .trim()
    .substr(0, 256);
}

ApiError.newFromResponse = function (statusCode, originalText) {
  if (originalText?.startsWith('{')) {
    // Often we've used parseErrorMessage before this is called, but
    // not always

    try {
      const parsed = JSON.parse(originalText);

      if (statusCode === 449) {
        // Handle the Subrequest Failed response, which wraps errors
        const { originalStatus, originalMessage } = parsed;
        return ApiError.fromResponse(originalStatus, originalMessage);
      } else {
        const message = ApiError.messageFromJSON(parsed);
        if (message) {
          return ApiError.fromResponse(statusCode, message);
        }
      }
    } catch (ex) {}
  }

  if (originalText?.startsWith('<')) {
    // We've gotten an HTML error page, probably a Sleepy Taco or the Atlassian
    // "moving mountains" error, or a third party proxy blocking the request
    return originalText.includes('http://www.trellostatus.com/') ||
      originalText.includes('https://trello.status.atlassian.com/')
      ? ApiError.Server('Trello Unavailable')
      : originalText.includes('https://status.atlassian.com/')
      ? ApiError.Server('Atlassian Unavailable')
      : ApiError.Server(
          `Unrecognized HTML error page: ${textFromHtml(originalText)}`,
        );
  }

  let text;
  if (originalText != null) {
    text = originalText.toLowerCase().trim();
  } else {
    assert(statusCode === 0, 'Received a response without any content!');
  }

  switch (statusCode) {
    case 0:
      return ApiError.NoResponse();
    case 400:
      switch (text) {
        case 'invalid token': // [INVALID TOKEN]
          return ApiError.Unauthenticated();
        default:
          return ApiError.BadRequest(originalText);
      }
    case 401:
      switch (text) {
        case 'invalid token':
        case 'invalid cookie token':
          return ApiError.Unauthenticated();
        case 'confirm to view':
          return ApiError.Unconfirmed();
        default:
          return ApiError.Unauthorized(originalText);
      }
    case 403:
      switch (text) {
        case 'user not logged in or invalid token.': // [WTF]
          return ApiError.Unauthenticated();
        default:
          return ApiError.Unauthorized(originalText);
      }
    case 404:
      return ApiError.NotFound(originalText);
    case 408:
      return ApiError.Timeout(originalText);
    case 409:
      return ApiError.Conflict(originalText);
    case 412:
      return ApiError.PreconditionFailed(originalText);
    case 429:
      return ApiError.TooManyRequests(originalText);
    default:
      if (500 <= statusCode && statusCode < 600) {
        return ApiError.Server(originalText);
      } else {
        return ApiError.Other(`${statusCode}: ${originalText}`);
      }
  }
};

module.exports.ApiError = ApiError;

// [INVALID TOKEN]
//
// The server is *very inconsistent* about this particular error.
//
// Usually it comes down as a "401: invalid token", but it frequently comes
// as "400: invalid token". But that error can also refer to [the actual token
// resource](https://trello.com/docs/api/token/), so we're *assuming* the more
// likely thing here because there's no way to distinguish what the server
// actually meant.

// [WTF]
//
// Somehow POST /1/cards/:idCard/markAssociatedNotificationsRead sends a
// completely different response from every other routes, and it sends a 403,
// even though it should be a 401. Hopefully this will be fixed at some point,
// but it happens right now.
