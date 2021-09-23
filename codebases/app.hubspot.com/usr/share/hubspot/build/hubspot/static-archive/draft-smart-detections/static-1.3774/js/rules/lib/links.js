'use es6';

import { getFullUrl } from 'hubspot-url-utils';
import PortalIdParser from 'PortalIdParser';
var portalId = PortalIdParser.get();
var baseHubSpotUrl = getFullUrl('app');

var documents = function documents() {
  return baseHubSpotUrl + "/presentations/" + portalId;
};

var meetings = function meetings() {
  return baseHubSpotUrl + "/meetings/" + portalId;
};

var meetingsNew = function meetingsNew() {
  return baseHubSpotUrl + "/meetings/" + portalId + "/link/new";
};

export default {
  documents: documents,
  meetings: meetings,
  meetingsNew: meetingsNew
};