'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _dynamicFilterFamilyD;

import * as DSAssetFamilies from 'customer-data-filters/filterQueryFormat/DSAssetFamilies/DSAssetFamilies';
import invariant from 'react-utils/invariant';
var dynamicFilterFamilyDefinitions = (_dynamicFilterFamilyD = {}, _defineProperty(_dynamicFilterFamilyD, DSAssetFamilies.IN_LIST, {
  filterFamily: DSAssetFamilies.IN_LIST,
  regex: RegExp(DSAssetFamilies.IN_LIST + "-[0-9][-][0-9]+"),
  make: function make(id) {
    return DSAssetFamilies.IN_LIST + "-" + id;
  },
  parse: function parse(filterFamily) {
    return filterFamily.replace(DSAssetFamilies.IN_LIST + "-", '');
  }
}), _defineProperty(_dynamicFilterFamilyD, DSAssetFamilies.INTEGRATION, {
  filterFamily: DSAssetFamilies.INTEGRATION,
  regex: RegExp(DSAssetFamilies.INTEGRATION + "-[0-9]+"),
  make: function make(id) {
    return DSAssetFamilies.INTEGRATION + "-" + id;
  },
  parse: function parse(filterFamily) {
    return filterFamily.replace(DSAssetFamilies.INTEGRATION + "-", '');
  }
}), _defineProperty(_dynamicFilterFamilyD, DSAssetFamilies.IMPORT, {
  filterFamily: DSAssetFamilies.IMPORT,
  regex: RegExp(DSAssetFamilies.IMPORT + "-[0-9][-][0-9]+"),
  make: function make(id) {
    return DSAssetFamilies.IMPORT + "-" + id;
  },
  parse: function parse(filterFamily) {
    return filterFamily.replace(DSAssetFamilies.IMPORT + "-", '');
  }
}), _defineProperty(_dynamicFilterFamilyD, DSAssetFamilies.CUSTOM_BEHAVIORAL_EVENT, {
  filterFamily: DSAssetFamilies.CUSTOM_BEHAVIORAL_EVENT,
  regex: RegExp(DSAssetFamilies.CUSTOM_BEHAVIORAL_EVENT + "-[0-9][-][0-9]+"),
  make: function make(id) {
    return DSAssetFamilies.CUSTOM_BEHAVIORAL_EVENT + "-" + id;
  },
  parse: function parse(filterFamily) {
    return filterFamily.replace(DSAssetFamilies.CUSTOM_BEHAVIORAL_EVENT + "-", '');
  }
}), _defineProperty(_dynamicFilterFamilyD, DSAssetFamilies.CUSTOM_BEHAVIORAL_EVENT_TYPE, {
  filterFamily: DSAssetFamilies.CUSTOM_BEHAVIORAL_EVENT_TYPE,
  regex: RegExp(DSAssetFamilies.CUSTOM_BEHAVIORAL_EVENT_TYPE + "-[0-9][-][0-9]+"),
  make: function make(id) {
    return DSAssetFamilies.CUSTOM_BEHAVIORAL_EVENT_TYPE + "-" + id;
  },
  parse: function parse(filterFamily) {
    return filterFamily.replace(DSAssetFamilies.CUSTOM_BEHAVIORAL_EVENT_TYPE + "-", '');
  }
}), _dynamicFilterFamilyD);
var dynamicFilterFamilies = Object.values(dynamicFilterFamilyDefinitions);

var getDefinitionByFilterFamily = function getDefinitionByFilterFamily(value) {
  return dynamicFilterFamilies.find(function (dff) {
    return dff.filterFamily === value;
  });
};

var getDefinitionByRegexMatch = function getDefinitionByRegexMatch(value) {
  return dynamicFilterFamilies.find(function (_ref) {
    var regex = _ref.regex;
    return regex.test(value);
  });
};

var filterFamilySupportsDynamic = function filterFamilySupportsDynamic(filterFamily) {
  return !!getDefinitionByFilterFamily(filterFamily);
};
/**
 * Given a filterFamily, attempts to derive the base filter family of the
 * filter family if it is in a dynamic filter family
 * ex) IN_LIST-0-2 -> IN_LIST
 */


var getDynamicFilterFamilyBasis = function getDynamicFilterFamilyBasis(filterFamily) {
  var definition = getDefinitionByRegexMatch(filterFamily);
  return definition ? definition.filterFamily : undefined;
};

var makeDynamicFilterFamily = function makeDynamicFilterFamily(filterFamilyBasis, filterFamily) {
  var dynamicFilterFamily = getDefinitionByFilterFamily(filterFamilyBasis);
  invariant(dynamicFilterFamily, "Cannot create a dynamic filter family instance of non-dynamic filterFamily: \"" + filterFamilyBasis + "\".");
  return dynamicFilterFamily.make(filterFamily);
};

var parseDynamicFilterFamilyId = function parseDynamicFilterFamilyId(filterFamilyBasis, filterFamily) {
  var dynamicFilterFamily = getDefinitionByFilterFamily(filterFamilyBasis);
  invariant(dynamicFilterFamily, "Cannot parse id from filter family instance of non-dynamic filterFamily: \"" + filterFamilyBasis + "\".");
  return dynamicFilterFamily.parse(filterFamily);
};
/**
 * Returns true if the filterFamily passes the regex of the dynamic
 * filter family based on the filter family basis supplied
 */


var testDynamicFilterFamily = function testDynamicFilterFamily(filterFamilyBasis, filterFamily) {
  var dynamicFilterFamily = getDefinitionByFilterFamily(filterFamilyBasis);
  invariant(dynamicFilterFamily, "Cannot test if filter family is instance of non-dynamic filterFamily: \"" + filterFamilyBasis + "\".");
  return dynamicFilterFamily.regex.test(filterFamily);
};

export { filterFamilySupportsDynamic, getDynamicFilterFamilyBasis, makeDynamicFilterFamily, parseDynamicFilterFamilyId, testDynamicFilterFamily };