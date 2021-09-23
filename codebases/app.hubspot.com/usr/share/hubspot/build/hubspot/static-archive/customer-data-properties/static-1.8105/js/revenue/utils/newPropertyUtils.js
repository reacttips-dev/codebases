'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _ImmutableMap;

import { Map as ImmutableMap } from 'immutable';
import { COMPETITOR_PROPERTY_EXPIRY, COMPETITORS_PROPERTY, RIP_OUT_PROPERTY, WHO_DID_WE_LOSE_TO_PROPERTY } from '../RevenueConstants';
var NEW_PROPERTIES_EXPIRATION_MAP = ImmutableMap((_ImmutableMap = {}, _defineProperty(_ImmutableMap, COMPETITORS_PROPERTY, COMPETITOR_PROPERTY_EXPIRY), _defineProperty(_ImmutableMap, RIP_OUT_PROPERTY, COMPETITOR_PROPERTY_EXPIRY), _defineProperty(_ImmutableMap, WHO_DID_WE_LOSE_TO_PROPERTY, COMPETITOR_PROPERTY_EXPIRY), _ImmutableMap));
export function shouldIncludeNewBadge(propertyName) {
  if (NEW_PROPERTIES_EXPIRATION_MAP.has(propertyName)) {
    return new Date() < new Date(NEW_PROPERTIES_EXPIRATION_MAP.get(propertyName));
  }

  return false;
}