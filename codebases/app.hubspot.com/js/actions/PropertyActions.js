'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { Map as ImmutableMap } from 'immutable';
import identity from 'transmute/identity';
import { createAction } from 'flux-actions';
import * as SequenceEditorActionTypes from 'SequencesUI/constants/SequenceEditorActionTypes';
import PropertyApi from 'SalesTemplateEditor/api/PropertyApi';
import getPropertiesWithDefaults from 'draft-plugins/utils/getPropertiesWithDefaults';
import { flattenPropertyList } from 'draft-plugins/utils/propertyUtils';
export var fetchPropertiesSucceeded = createAction(SequenceEditorActionTypes.PROPERTIES_FETCH_SUCCEEDED, identity);
var _currentlyFetching = false;
export var fetchProperties = function fetchProperties() {
  return function (dispatch) {
    if (!_currentlyFetching) {
      _currentlyFetching = true;
      Promise.all([PropertyApi.fetchContactProperties(), PropertyApi.fetchCompanyProperties(), PropertyApi.fetchDealProperties(), PropertyApi.fetchTicketProperties()]).then(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 4),
            contactProperties = _ref2[0],
            companyProperties = _ref2[1],
            dealProperties = _ref2[2],
            ticketProperties = _ref2[3];

        var properties = ImmutableMap({
          contactProperties: contactProperties,
          companyProperties: companyProperties,
          dealProperties: dealProperties,
          ticketProperties: ticketProperties
        });
        var propertiesWithDefaults = getPropertiesWithDefaults(properties);
        var flattenedProperties = propertiesWithDefaults.map(flattenPropertyList);
        dispatch(fetchPropertiesSucceeded({
          properties: properties,
          flattenedProperties: flattenedProperties
        }));
      }).finally(function () {
        _currentlyFetching = false;
      });
    }
  };
};