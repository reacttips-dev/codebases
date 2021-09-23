var portalId;
export var getPortalId = function getPortalId() {
  if (portalId || portalId === false) return portalId;
  var portalIdArray = /^\/(?:[A-Za-z0-9-_]*)\/(\d+)(?:\/|$)/.exec(document.location.pathname);
  portalId = portalIdArray && portalIdArray.length > 1 ? portalIdArray[1] : window.hubspot.navigation !== undefined && window.hubspot.navigation.portal !== undefined ? window.hubspot.navigation.portal.portal_id : null;
  return portalId || false;
};