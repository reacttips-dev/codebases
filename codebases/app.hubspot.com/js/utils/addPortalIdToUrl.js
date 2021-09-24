'use es6';

export default function addPortalIdToUrl(currentUrl, portalId) {
  // get and separate the base route (currently "/contacts") from the rest of the path, then add the base route back with the PortalId to the path
  var baseRouteRegex = /^\/contacts[/]*/;
  var baseRouteMatch = currentUrl.match(baseRouteRegex)[0];
  var remainingcurrentUrl = currentUrl.split(baseRouteMatch)[1];
  return "/contacts/" + portalId + "/" + remainingcurrentUrl;
}