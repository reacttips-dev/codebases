// front-end equivalent to https://git.hubteam.com/HubSpot/InboundDb/blob/master/InboundDbBase/src/main/java/com/hubspot/inbounddb/base/MultiValuePropertyHelper.java
'use es6';

import identity from 'transmute/identity';
import { List } from 'immutable';
var SEPARATOR = ';';
export function parsePropertyValueToList(value) {
  if (!value) {
    return List();
  }

  return List(value.split(SEPARATOR)).map(function (result) {
    return result.trim();
  }).filter(identity);
}
export function formatListToPropertyValue(valueList) {
  return valueList ? valueList.join(SEPARATOR) : '';
}