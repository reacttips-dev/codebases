'use es6'; // Determines what operators can be used for a given property type

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _DSAssetFamilies$SURV, _DSAssetFamilies$ADS_, _DSAssetFamilies$INTE, _DSAssetFamilies$CUST, _ImmutableMap, _ImmutableMap2;

import * as DSAssetFamilies from 'customer-data-filters/filterQueryFormat/DSAssetFamilies/DSAssetFamilies';
import * as Operators from 'customer-data-filters/filterQueryFormat/operator/Operators';
import { BOOLEAN, DATE, DATE_TIME, ENUMERATION, NUMBER, STRING } from 'customer-data-objects/property/PropertyTypes';
import { Map as ImmutableMap, OrderedSet, Set as ImmutableSet } from 'immutable';
import { PRIVACY_CONSENT } from '../listSegClassic/ListSegConstants';
import { getDynamicFilterFamilyBasis } from '../../filterQueryFormat/DynamicFilterFamilies';
import getIn from 'transmute/getIn';
var dateDefaults = OrderedSet.of(Operators.Equal, Operators.After, Operators.Before, Operators.AfterDate, Operators.BeforeDate, Operators.InRange, Operators.NotInRange, Operators.GreaterRolling, Operators.LessRolling, Operators.Known, Operators.NotKnown, Operators.UpdatedInLastXDays, Operators.NotUpdatedInLastXDays, Operators.UpdatedAfter, Operators.UpdatedBefore);
var nonPropertyDateDefaults = OrderedSet.of(Operators.Equal, Operators.BeforeDate, Operators.AfterDate, Operators.InRange, Operators.NotInRange, Operators.GreaterRolling, Operators.LessRolling, Operators.Known, Operators.NotKnown, Operators.UpdatedInLastXDays, Operators.NotUpdatedInLastXDays);
var FamilyAndTypeToOperator = ImmutableMap((_ImmutableMap = {}, _defineProperty(_ImmutableMap, DSAssetFamilies.SURVEY_MONKEY_QUESTION, (_DSAssetFamilies$SURV = {}, _defineProperty(_DSAssetFamilies$SURV, ENUMERATION, OrderedSet.of(Operators.In, Operators.NotIn, Operators.Known, Operators.NotKnown)), _defineProperty(_DSAssetFamilies$SURV, NUMBER, OrderedSet.of(Operators.Equal, Operators.NotEqual, Operators.Less, Operators.LessOrEqual, Operators.Greater, Operators.GreaterOrEqual, Operators.Known, Operators.NotKnown)), _defineProperty(_DSAssetFamilies$SURV, STRING, OrderedSet.of(Operators.EqualAny, Operators.NotEqualAny, Operators.ContainAny, Operators.NotContainAny, Operators.StartsWithAny, Operators.EndsWithAny, Operators.Known, Operators.NotKnown)), _defineProperty(_DSAssetFamilies$SURV, DATE_TIME, OrderedSet.of(Operators.Equal, Operators.BeforeDate, Operators.AfterDate, Operators.InRange, Operators.NotInRange, Operators.GreaterRolling, Operators.LessRolling)), _DSAssetFamilies$SURV)), _defineProperty(_ImmutableMap, DSAssetFamilies.ADS_PROPERTY, (_DSAssetFamilies$ADS_ = {}, _defineProperty(_DSAssetFamilies$ADS_, DATE, OrderedSet.of(Operators.Less, Operators.Greater, Operators.InRange, Operators.NotInRange, Operators.GreaterThanRolling, Operators.LessThanRolling)), _defineProperty(_DSAssetFamilies$ADS_, DATE_TIME, OrderedSet.of(Operators.Less, Operators.Greater, Operators.InRange, Operators.NotInRange, Operators.GreaterThanRolling, Operators.LessThanRolling)), _defineProperty(_DSAssetFamilies$ADS_, ENUMERATION, OrderedSet.of(Operators.EqualAny, Operators.Known)), _defineProperty(_DSAssetFamilies$ADS_, STRING, OrderedSet.of(Operators.EqualAny, Operators.ContainAny, Operators.StartsWithAny, Operators.EndsWithAny, Operators.Known)), _DSAssetFamilies$ADS_)), _defineProperty(_ImmutableMap, DSAssetFamilies.INTEGRATION, (_DSAssetFamilies$INTE = {}, _defineProperty(_DSAssetFamilies$INTE, BOOLEAN, OrderedSet.of(Operators.Equal, Operators.NotEqual, Operators.Known, Operators.NotKnown, Operators.UpdatedInLastXDays, Operators.NotUpdatedInLastXDays)), _defineProperty(_DSAssetFamilies$INTE, DATE, nonPropertyDateDefaults), _defineProperty(_DSAssetFamilies$INTE, DATE_TIME, nonPropertyDateDefaults), _defineProperty(_DSAssetFamilies$INTE, ENUMERATION, OrderedSet.of(Operators.In, Operators.NotIn, Operators.Known, Operators.NotKnown, Operators.UpdatedInLastXDays, Operators.NotUpdatedInLastXDays)), _defineProperty(_DSAssetFamilies$INTE, NUMBER, OrderedSet.of(Operators.Equal, Operators.NotEqual, Operators.Less, Operators.LessOrEqual, Operators.Greater, Operators.GreaterOrEqual, Operators.Known, Operators.NotKnown, Operators.UpdatedInLastXDays, Operators.NotUpdatedInLastXDays)), _defineProperty(_DSAssetFamilies$INTE, STRING, OrderedSet.of(Operators.EqualAny, Operators.NotEqualAny, Operators.ContainAny, Operators.NotContainAny, Operators.StartsWithAny, Operators.EndsWithAny, Operators.Known, Operators.NotKnown, Operators.UpdatedInLastXDays, Operators.NotUpdatedInLastXDays)), _DSAssetFamilies$INTE)), _defineProperty(_ImmutableMap, DSAssetFamilies.CUSTOM_BEHAVIORAL_EVENT_TYPE, (_DSAssetFamilies$CUST = {}, _defineProperty(_DSAssetFamilies$CUST, BOOLEAN, OrderedSet.of(Operators.Equal, Operators.NotEqual, Operators.Known, Operators.NotKnown, Operators.UpdatedInLastXDays, Operators.NotUpdatedInLastXDays)), _defineProperty(_DSAssetFamilies$CUST, DATE, nonPropertyDateDefaults), _defineProperty(_DSAssetFamilies$CUST, DATE_TIME, nonPropertyDateDefaults), _defineProperty(_DSAssetFamilies$CUST, ENUMERATION, OrderedSet.of(Operators.In, Operators.NotIn, Operators.Known, Operators.NotKnown, Operators.UpdatedInLastXDays, Operators.NotUpdatedInLastXDays)), _defineProperty(_DSAssetFamilies$CUST, NUMBER, OrderedSet.of(Operators.Equal, Operators.NotEqual, Operators.Less, Operators.LessOrEqual, Operators.Greater, Operators.GreaterOrEqual, Operators.Known, Operators.NotKnown, Operators.UpdatedInLastXDays, Operators.NotUpdatedInLastXDays)), _defineProperty(_DSAssetFamilies$CUST, STRING, OrderedSet.of(Operators.EqualAny, Operators.NotEqualAny, Operators.ContainAny, Operators.NotContainAny, Operators.StartsWithAny, Operators.EndsWithAny, Operators.Known, Operators.NotKnown, Operators.UpdatedInLastXDays, Operators.NotUpdatedInLastXDays)), _DSAssetFamilies$CUST)), _ImmutableMap));
var TypeToOperator = ImmutableMap((_ImmutableMap2 = {}, _defineProperty(_ImmutableMap2, BOOLEAN, OrderedSet.of(Operators.Equal, Operators.NotEqual, Operators.Known, Operators.NotKnown, Operators.EverEqual, Operators.NeverEqual, Operators.UpdatedInLastXDays, Operators.NotUpdatedInLastXDays, Operators.UpdatedAfter, Operators.UpdatedBefore)), _defineProperty(_ImmutableMap2, DATE, dateDefaults), _defineProperty(_ImmutableMap2, DATE_TIME, dateDefaults), _defineProperty(_ImmutableMap2, ENUMERATION, OrderedSet.of(Operators.In, Operators.NotIn, Operators.Known, Operators.NotKnown, Operators.EverIn, Operators.NeverIn, Operators.EqualAll, Operators.NotEqualAll, Operators.ContainAll, Operators.NotContainAll, Operators.EverEqualAll, Operators.NeverEqualAll, Operators.EverContainedAll, Operators.NeverContainedAll, Operators.UpdatedInLastXDays, Operators.NotUpdatedInLastXDays, Operators.UpdatedAfter, Operators.UpdatedBefore)), _defineProperty(_ImmutableMap2, NUMBER, OrderedSet.of(Operators.Equal, Operators.NotEqual, Operators.Less, Operators.LessOrEqual, Operators.Greater, Operators.GreaterOrEqual, Operators.Known, Operators.NotKnown, Operators.EverEqual, Operators.NeverEqual, Operators.UpdatedInLastXDays, Operators.NotUpdatedInLastXDays, Operators.UpdatedAfter, Operators.UpdatedBefore)), _defineProperty(_ImmutableMap2, STRING, OrderedSet.of(Operators.EqualAny, Operators.NotEqualAny, Operators.ContainAny, Operators.NotContainAny, Operators.StartsWithAny, Operators.EndsWithAny, Operators.Known, Operators.NotKnown, Operators.EverEqualAny, Operators.NeverEqualAny, Operators.EverContained, Operators.NeverContained, Operators.UpdatedInLastXDays, Operators.NotUpdatedInLastXDays, Operators.UpdatedAfter, Operators.UpdatedBefore)), _defineProperty(_ImmutableMap2, DSAssetFamilies.CTA, OrderedSet.of(Operators.CtaHasClicked, Operators.CtaHasNotClicked, Operators.CtaHasSeen, Operators.CtaHasNotSeen)), _defineProperty(_ImmutableMap2, DSAssetFamilies.GOTO_WEBINAR_WEBINAR, OrderedSet.of(Operators.WebinarHasAttended, Operators.WebinarNotHasAttended, Operators.WebinarHasRegistered, Operators.WebinarNotHasRegistered)), _defineProperty(_ImmutableMap2, DSAssetFamilies.IN_LIST, OrderedSet.of(Operators.ListIsMember, Operators.ListIsNotMember)), _defineProperty(_ImmutableMap2, DSAssetFamilies.IMPORT, OrderedSet.of(Operators.InImport, Operators.NotInImport)), _defineProperty(_ImmutableMap2, DSAssetFamilies.PAGE_VIEW, OrderedSet.of(Operators.PageViewEqual, Operators.PageViewNotEqual, Operators.PageViewContain, Operators.PageViewNotContain, Operators.PageViewMatchRegex, Operators.PageViewNotMatchRegex)), _defineProperty(_ImmutableMap2, DSAssetFamilies.SURVEY_MONKEY_SURVEY, OrderedSet.of(Operators.SurveyMonkeyHasResponded, Operators.SurveyMonkeyNotHasResponded)), _defineProperty(_ImmutableMap2, DSAssetFamilies.FORM, OrderedSet.of(Operators.FormFilledOut, Operators.FormNotFilledOut)), _defineProperty(_ImmutableMap2, DSAssetFamilies.EVENT, OrderedSet.of(Operators.EventCompleted, Operators.EventNotCompleted)), _defineProperty(_ImmutableMap2, DSAssetFamilies.EMAIL_SUBSCRIPTION, OrderedSet.of(Operators.EmailSubscriptionOptIn, Operators.EmailSubscriptionOptOut, Operators.EmailSubscriptionNotOpted)), _defineProperty(_ImmutableMap2, DSAssetFamilies.EMAIL_CAMPAIGN, OrderedSet.of(Operators.EmailOpened, Operators.EmailLinkClicked, Operators.EmailMarked, Operators.EmailOpenedButLinkNotClicked, Operators.EmailOpenedButNotReplied, Operators.EmailReplied, Operators.EmailReceived, Operators.EmailReceivedButNotOpened, Operators.EmailSent, Operators.EmailSentButNotReceived, Operators.EmailUnsubscribed, Operators.EmailBounced)), _defineProperty(_ImmutableMap2, DSAssetFamilies.WORKFLOW, OrderedSet.of(Operators.WorkflowActive, Operators.WorkflowNotActive, Operators.WorkflowCompleted, Operators.WorkflowNotCompleted, Operators.WorkflowEnrolled, Operators.WorkflowNotEnrolled, Operators.WorkflowMetGoal, Operators.WorkflowNotMetGoal)), _defineProperty(_ImmutableMap2, DSAssetFamilies.ASSOCIATION, OrderedSet.of(Operators.Equal)), _ImmutableMap2));
var gatedOperatorsByType = ImmutableMap();

var getGatedOperatorsForType = function getGatedOperatorsForType(type, getIsUngated) {
  var gatedOperators = gatedOperatorsByType.get(type) || ImmutableMap();
  return OrderedSet().withMutations(function (mutableSet) {
    return gatedOperators.reduce(function (blockedOperators, _ref) {
      var gateName = _ref.gateName,
          operators = _ref.operators;

      if (!getIsUngated(gateName)) {
        operators.forEach(function (operator) {
          return blockedOperators.add(operator);
        });
      }

      return blockedOperators;
    }, mutableSet);
  });
};

var privacyConcentOperators = OrderedSet.of(Operators.PrivacyConsentCompleted, Operators.PrivacyConsentNotCompleted);
export var getObjectSegOperatorsForType = function getObjectSegOperatorsForType(type, family, getIsUngated) {
  var filterFamilyName = getDynamicFilterFamilyBasis(family) || family;
  var typeName = getDynamicFilterFamilyBasis(type) || type;
  var typeOperators;
  var gatedOperators = ImmutableSet();

  if (family === DSAssetFamilies.CONTACT_PROPERTY && type === PRIVACY_CONSENT) {
    return privacyConcentOperators;
  }

  if (FamilyAndTypeToOperator.has(filterFamilyName)) {
    typeOperators = getIn([filterFamilyName, type], FamilyAndTypeToOperator);
  } else if (TypeToOperator.has(type)) {
    typeOperators = TypeToOperator.get(type);
    gatedOperators = getGatedOperatorsForType(type, getIsUngated);
  } else if (TypeToOperator.has(typeName)) {
    typeOperators = TypeToOperator.get(typeName);
    gatedOperators = getGatedOperatorsForType(typeName, getIsUngated);
  }

  if (typeOperators && gatedOperators) {
    typeOperators = typeOperators.subtract(gatedOperators);
  }

  return typeOperators;
};