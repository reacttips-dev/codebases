'use es6';

import { Map as ImmutableMap, List } from 'immutable';
import { COMPANIES, CONTACTS } from '../../../../constants/dataTypes';
var associationPropertyReferences = ImmutableMap({
  'associations.company': COMPANIES,
  'associations.contact': CONTACTS
});

var fillPropertyReferences = function fillPropertyReferences(spec) {
  return spec.updateIn(['properties', 'references'], ImmutableMap(), function (referencesOverrides) {
    return associationPropertyReferences.set(spec.properties.idProperty, spec.dataType).merge(referencesOverrides);
  });
};

var associationPropertyPaths = ImmutableMap({
  'associations.company': ['associations', 'associatedCompanyIds'],
  'associations.contact': ['associations', 'associatedVids']
});

var fillPropertyResponsePaths = function fillPropertyResponsePaths(spec) {
  return spec.updateIn(['properties', 'responsePaths'], ImmutableMap(), function (responsePathOverrides) {
    return associationPropertyPaths.merge(responsePathOverrides);
  });
};

var fillers = List([fillPropertyReferences, fillPropertyResponsePaths]);
export default (function (spec) {
  return fillers.reduce(function (toFill, filler) {
    return filler(toFill);
  }, spec);
});