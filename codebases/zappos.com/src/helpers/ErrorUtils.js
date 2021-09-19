import queryString from 'query-string';

import AppEnvironment from 'helpers/AppEnvironment';
import { logError } from 'middleware/logger';

function getErrorObjectMessage(error) {
  return error ? error.detailedMessage || error.message || '' : '';
}

export function buildMessage(errorCode, type, errorEventInfo) {
  return `${type || ''}${errorCode ? ` ${errorCode}` : ''}: ${getErrorObjectMessage(errorEventInfo)}`;
}

function fireZfcErrorTracker(msg) {
  if (window && typeof window.onerror === 'function') {
    window.onerror(msg);
  }
}

export function trackError(errorCode, type, errorEventInfo) {
  const formattedMessage = buildMessage(errorCode, type, errorEventInfo);
  if (AppEnvironment.hasZfc) {
    fireZfcErrorTracker(formattedMessage);
  }
  logError(formattedMessage);
}

export function buildErrorQueryStringForMartyPixel(errorCode = '', type = '', errorEventInfo) {
  const { status = '', statusText = '', url = '', detailedMessage = '', extraInformation = '' } = errorEventInfo || {};
  const encodedDetailedMessage = encodeURIComponent(detailedMessage);
  // URL in this case is populated for FetchError type errors which indicate the api call that fetch url that errored.
  // The user's browser URL can be retrieved by looking at the referer header in splunk
  const encodedUrl = encodeURIComponent(url);
  const encodedExtraInformation = encodeURIComponent(extraInformation);
  return `errorType=${type}&errorCode=${errorCode}&extraInformation=${encodedExtraInformation}&status=${status}&detailedMessage=${encodedDetailedMessage}&url=${encodedUrl}&statusText=${statusText}`;
}

export function makeMartyPixelQueryString({ type, subType }, details) {
  return `type=${type}${subType ? `&subType=${subType}` : ''}&${queryString.stringify(details)}`;
}
