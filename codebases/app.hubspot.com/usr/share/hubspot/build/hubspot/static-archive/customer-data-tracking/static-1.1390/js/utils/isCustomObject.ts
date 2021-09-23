// meta type for custom objects, see:
// https://git.hubteam.com/HubSpot/InboundDbMeta/blob/f47f397615d3473d25371d55249fcefd4d2e9679/InboundDbCore/src/main/java/com/hubspot/inbounddb/base/MetaType.java#L10
var PORTAL_SPECIFIC = 2;
export var isCustomObject = function isCustomObject(objectTypeId) {
  var match = objectTypeId.match(/^(\d+)-(\d+)$/);
  return Boolean(match && Number(match[1]) === PORTAL_SPECIFIC);
};