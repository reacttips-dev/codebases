'use es6';

import PortalIdParser from 'PortalIdParser';
import { getFullUrl } from 'hubspot-url-utils';
var baseHubSpotUrl = getFullUrl('api');
export var getSignedSrc = function getSignedSrc(fileManagerId) {
  var portalId = PortalIdParser.get();
  return baseHubSpotUrl + "/filemanager/api/v2/files/" + fileManagerId + "/signed-url-redirect?portalId=" + portalId;
};
export var isPrivateFile = function isPrivateFile(fileObject) {
  return fileObject.meta && fileObject.meta.allows_anonymous_access === false;
};