'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import createAction from './createAction';
import { Map as ImmutableMap } from 'immutable';
import PropertyApi from 'SalesTemplateEditor/api/PropertyApi';
import ActionTypes from 'SalesTemplateEditor/constants/ActionTypes';
import getPropertiesWithDefaults from 'draft-plugins/utils/getPropertiesWithDefaults';
import { flattenPropertyList } from 'draft-plugins/utils/propertyUtils';
var _currentlyFetching = false;
export var fetchProperties = function fetchProperties() {
  return function (dispatch) {
    if (!_currentlyFetching) {
      _currentlyFetching = true;
      dispatch(createAction(ActionTypes.FETCH_PROPERTIES_STARTED));
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
        var flattenedProperties = propertiesWithDefaults.map(function (objectProperties) {
          return flattenPropertyList(objectProperties);
        });
        dispatch(createAction(ActionTypes.FETCH_PROPERTIES_SUCCESS, {
          properties: properties,
          flattenedProperties: flattenedProperties
        }));
      }, function () {
        return dispatch(createAction(ActionTypes.FETCH_PROPERTIES_ERROR));
      }).finally(function () {
        _currentlyFetching = false;
      });
    }
  };
};