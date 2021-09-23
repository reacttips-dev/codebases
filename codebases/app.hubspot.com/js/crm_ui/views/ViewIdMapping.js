'use es6'; // This duplicates the view ids declared in sales.proto
// https://git.hubteam.com/HubSpot/Sales/blob/master/SalesCore/src/main/protobuf/sales.proto#L22-40

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
var mapping = {
  my: -1,
  all: -2,
  uncontacted: -3,
  recently_assigned: -4,
  my_month: -5,
  closed_month: -6,
  favorites: -7,
  hidden: -8,
  needs_action: -9,
  needs_follow_up: -10,
  unassigned: -11,
  event_overdue: -12,
  // Prioritization filters:
  event_this_week: -13,
  event_today: -14,
  event_none: -15,
  activity_none: -16,
  activity_recent: -17
};
var reverseMapping = Object.keys(mapping).reduce(function (acc, key) {
  return Object.assign({}, acc, _defineProperty({}, String(mapping[key]), key));
}, {});
export var get = function get(viewId) {
  return Object.prototype.hasOwnProperty.call(mapping, viewId) ? mapping[viewId] : viewId;
};
export var lookup = function lookup(viewId) {
  return Object.prototype.hasOwnProperty.call(reverseMapping, viewId) ? reverseMapping[viewId] : viewId;
};