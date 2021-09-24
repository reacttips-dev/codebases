'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _ImmutableMap;

import { List, Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import { APPLICABLE_ONBOARDING_GOALS_PROPERTY, BUSINESS_GOALS_PROPERTY, COMPETITORS_PROPERTY, RIP_OUT_PROPERTY } from 'customer-data-properties/revenue/RevenueConstants';

function getRipoutOptions(property, draft) {
  if (draft.has(COMPETITORS_PROPERTY)) {
    var currentValues = new ImmutableSet(draft.get(COMPETITORS_PROPERTY).split(';'));
    return property.get('options').filter(function (option) {
      return currentValues.has(option.get('value'));
    });
  }

  return new List();
}

function getOnboardingOptions(property, draft) {
  if (draft.get(APPLICABLE_ONBOARDING_GOALS_PROPERTY)) {
    var currentValues = new ImmutableSet(draft.get(APPLICABLE_ONBOARDING_GOALS_PROPERTY).split(','));

    if (currentValues) {
      return property.get('options').filter(function (option) {
        return currentValues.has(option.get('value'));
      });
    }

    return property.get('options');
  }

  return new List();
}

var RELATIVE_OPTIONS_REQUIREMENTS_MAP = ImmutableMap((_ImmutableMap = {}, _defineProperty(_ImmutableMap, RIP_OUT_PROPERTY, getRipoutOptions), _defineProperty(_ImmutableMap, BUSINESS_GOALS_PROPERTY, getOnboardingOptions), _ImmutableMap));

var shouldFilterOnboardingGoals = function shouldFilterOnboardingGoals(draft, name) {
  return draft.has(APPLICABLE_ONBOARDING_GOALS_PROPERTY) && RELATIVE_OPTIONS_REQUIREMENTS_MAP.has(name);
};

export function adjustRelativeOptionsIfNeeded(property, draft) {
  if (!shouldFilterOnboardingGoals(draft, property.name) && property.name === BUSINESS_GOALS_PROPERTY) {
    return property;
  }

  if (RELATIVE_OPTIONS_REQUIREMENTS_MAP.has(property.name)) {
    var propertyFunction = RELATIVE_OPTIONS_REQUIREMENTS_MAP.get(property.name);
    return property.set('options', propertyFunction(property, draft));
  }

  return property;
}
export function shouldDisableProperty(property, draft) {
  if (!shouldFilterOnboardingGoals(draft, property.name)) {
    return false;
  }

  if (RELATIVE_OPTIONS_REQUIREMENTS_MAP.has(property.name)) {
    var propertyFunction = RELATIVE_OPTIONS_REQUIREMENTS_MAP.get(property.name);
    return propertyFunction(property, draft).length === 0;
  }

  return false;
}