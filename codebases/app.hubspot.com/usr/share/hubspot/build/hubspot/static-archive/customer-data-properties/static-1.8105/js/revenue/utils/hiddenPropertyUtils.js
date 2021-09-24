'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _ImmutableMap;

import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import { CLOSED_LOST_REASON_PROPERTY, COMPETITORS_PROPERTY, RIP_OUT_PROPERTY, WHO_DID_WE_LOSE_TO_PROPERTY, APPLICABLE_ONBOARDING_GOALS_PROPERTY } from 'customer-data-properties/revenue/RevenueConstants';

function hasPropertyValue(propertyName, propertiesByType, changedInSession) {
  var completed = propertiesByType.completed;
  var isPreviouslyCompleted = ImmutableSet(completed).map(function (property) {
    return property.name;
  }).contains(propertyName);
  var isChangedInSession = ImmutableSet(changedInSession).contains(propertyName);
  return isPreviouslyCompleted || isChangedInSession;
}

function shouldHideWhoWeLostTo(propertiesByType, changedInSession) {
  return !hasPropertyValue(CLOSED_LOST_REASON_PROPERTY, propertiesByType, changedInSession);
}

function shouldHideRipOut(propertiesByType, changedInSession) {
  return !hasPropertyValue(COMPETITORS_PROPERTY, propertiesByType, changedInSession);
}

function shouldHideApplicableOnboarding() {
  return true;
}

var HIDDEN_PROPERTY_REQUIREMENTS_MAP = ImmutableMap((_ImmutableMap = {}, _defineProperty(_ImmutableMap, WHO_DID_WE_LOSE_TO_PROPERTY, shouldHideWhoWeLostTo), _defineProperty(_ImmutableMap, RIP_OUT_PROPERTY, shouldHideRipOut), _defineProperty(_ImmutableMap, APPLICABLE_ONBOARDING_GOALS_PROPERTY, shouldHideApplicableOnboarding), _ImmutableMap));
export function shouldHideProperty(propertyName, propertiesByType, changedInSession) {
  if (HIDDEN_PROPERTY_REQUIREMENTS_MAP.has(propertyName)) {
    var propertyFunction = HIDDEN_PROPERTY_REQUIREMENTS_MAP.get(propertyName);
    return propertyFunction(propertiesByType, changedInSession);
  }

  return false;
}