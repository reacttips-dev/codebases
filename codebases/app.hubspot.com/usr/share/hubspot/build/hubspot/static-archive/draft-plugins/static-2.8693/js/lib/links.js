'use es6';

import PortalIdParser from 'PortalIdParser';
import { getFullUrl } from 'hubspot-url-utils';
var baseHubSpotUrl = getFullUrl('app');
export var getSnippetsUrl = function getSnippetsUrl(portalId) {
  return baseHubSpotUrl + "/snippets/" + portalId;
};
export var getNewSnippetsUrl = function getNewSnippetsUrl(portalId) {
  return baseHubSpotUrl + "/snippets/" + portalId + "/new";
};
export var getDocumentsUrl = function getDocumentsUrl() {
  var portalId = PortalIdParser.get();
  return baseHubSpotUrl + "/presentations/" + portalId;
};
export var getKnowledgeUrl = function getKnowledgeUrl(portalId) {
  return baseHubSpotUrl + "/knowledge/" + portalId;
};
export var getMeetingsUrl = function getMeetingsUrl() {
  return baseHubSpotUrl + "/meetings/" + PortalIdParser.get();
};
/* eslint-env commonjs */
// This temporary hack ensures module system compatibility.
// Read more at go/treeshaking

if (!!module && !!module.exports) {
  module.exports.default = Object.assign({}, module.exports);
}