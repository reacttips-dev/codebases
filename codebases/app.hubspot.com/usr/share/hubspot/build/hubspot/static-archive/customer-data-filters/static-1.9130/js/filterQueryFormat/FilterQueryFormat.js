'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";

var _ignoreValues, _filterFamilyMappingH;

import * as DSAssetFamilies from 'customer-data-filters/filterQueryFormat/DSAssetFamilies/DSAssetFamilies';
import * as ListSegConstants from 'customer-data-filters/converters/listSegClassic/ListSegConstants';
import { CtaHasClicked, CtaHasNotClicked, CtaHasNotSeen, CtaHasSeen } from './operator/Operators';
import { List, Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import { testDynamicFilterFamily } from '../filterQueryFormat/DynamicFilterFamilies';
import And from './logic/And';
import FilterOperatorDescription from './FilterOperatorDescription';
import Or from './logic/Or';
export var getFilterDescription = function getFilterDescription(filterQuery, filterFamily) {
  if (Or.isOr(filterQuery) || And.isAnd(filterQuery)) {
    return filterQuery.get('conditions').reduce(function (acc, query) {
      var description = getFilterDescription(query, filterQuery.get('filterFamily'));

      if (List.isList(description)) {
        return acc.concat(description);
      }

      return acc.push(description);
    }, List());
  }

  return FilterOperatorDescription({
    filterFamily: filterFamily,
    operator: filterQuery
  });
}; // Gets all leaf node conditions and bundles them with the filter family of the
// containing logic group. Return Type: [{filterQuery, filterFamily}, ...]

var getLeafNodeConditionsWithFilterFamily = function getLeafNodeConditionsWithFilterFamily(filterQuery, filterFamily) {
  if (!Or.isOr(filterQuery) && !And.isAnd(filterQuery)) {
    return [{
      filterQuery: filterQuery,
      filterFamily: filterFamily
    }];
  }

  return filterQuery.get('conditions').reduce(function (acc, query) {
    var conditionsWithFilterFamilies = getLeafNodeConditionsWithFilterFamily(query, filterQuery.get('filterFamily'));
    acc.push.apply(acc, _toConsumableArray(conditionsWithFilterFamilies));
    return acc;
  }, []);
};

var noMappingHelper = function noMappingHelper() {
  return [];
};

var ignoreValues = (_ignoreValues = {}, _defineProperty(_ignoreValues, DSAssetFamilies.CONTACT_PROPERTY, ListSegConstants.__PRIVACY_CONSENT), _defineProperty(_ignoreValues, DSAssetFamilies.FORM, ListSegConstants.__ANY_FORM), _defineProperty(_ignoreValues, DSAssetFamilies.GOTO_WEBINAR_WEBINAR, ListSegConstants.__ANY_WEBINAR), _ignoreValues);

var defaultMappingHelper = function defaultMappingHelper(_ref, filterFamily) {
  var value = _ref.field.name;
  return ignoreValues[filterFamily] === value ? [] : [filterFamily, value];
};

var ctaMappingHelper = function ctaMappingHelper(filterQuery) {
  var operatorUsesPlacementFamily = filterQuery instanceof CtaHasNotClicked || filterQuery instanceof CtaHasNotSeen || filterQuery instanceof CtaHasSeen || filterQuery instanceof CtaHasClicked;

  if (!operatorUsesPlacementFamily) {
    return [];
  }

  return filterQuery.value === ListSegConstants.__ANY_CTA ? [DSAssetFamilies.CTA, filterQuery.field.name] : [DSAssetFamilies.CTA_TO_PLACEMENT, filterQuery.value];
}; // Must return an empty array [] or a mapping in the form [key, value]


var filterFamilyMappingHelpers = (_filterFamilyMappingH = {}, _defineProperty(_filterFamilyMappingH, DSAssetFamilies.CTA, ctaMappingHelper), _defineProperty(_filterFamilyMappingH, DSAssetFamilies.PAGE_VIEW, noMappingHelper), _defineProperty(_filterFamilyMappingH, DSAssetFamilies.EMAIL_SUBSCRIPTION, noMappingHelper), _defineProperty(_filterFamilyMappingH, DSAssetFamilies.FORM, defaultMappingHelper), _defineProperty(_filterFamilyMappingH, DSAssetFamilies.GOTO_WEBINAR_WEBINAR, defaultMappingHelper), _defineProperty(_filterFamilyMappingH, DSAssetFamilies.EVENT, defaultMappingHelper), _defineProperty(_filterFamilyMappingH, "DEFAULT", defaultMappingHelper), _filterFamilyMappingH);

var getMappingForCondition = function getMappingForCondition(_ref2) {
  var filterQuery = _ref2.filterQuery,
      filterFamily = _ref2.filterFamily;

  if (testDynamicFilterFamily(DSAssetFamilies.INTEGRATION, filterFamily)) {
    return [DSAssetFamilies.INTEGRATION, filterFamily];
  }

  return Object.prototype.hasOwnProperty.call(filterFamilyMappingHelpers, filterFamily) ? filterFamilyMappingHelpers[filterFamily](filterQuery, filterFamily) : filterFamilyMappingHelpers.DEFAULT(filterQuery, filterFamily);
}; // Returns a Map of Sets of field names keyed by filterFamilies


export var getUniqueFieldIdsByAssetFamily = function getUniqueFieldIdsByAssetFamily(filterQuery) {
  return getLeafNodeConditionsWithFilterFamily(filterQuery).reduce(function (acc, conditionWithFamily) {
    var _getMappingForConditi = getMappingForCondition(conditionWithFamily),
        _getMappingForConditi2 = _slicedToArray(_getMappingForConditi, 2),
        key = _getMappingForConditi2[0],
        value = _getMappingForConditi2[1];

    if (key) {
      var set = acc.has(key) ? acc.get(key).add("" + value) : ImmutableSet.of("" + value);
      return acc.set(key, set);
    }

    return acc;
  }, ImmutableMap());
};
export var getFilterFamilies = function getFilterFamilies(filterQuery) {
  return getLeafNodeConditionsWithFilterFamily(filterQuery).reduce(function (acc, _ref3) {
    var filterFamily = _ref3.filterFamily;
    return acc.add(filterFamily);
  }, ImmutableSet()).toList();
};