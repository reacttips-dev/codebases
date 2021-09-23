'use es6';

import { PROPERTIES_FETCH_STARTED, PROPERTIES_FETCH_SUCCEEDED, PROPERTIES_FETCH_FAILED } from './propertiesActionTypes';
import { getProperties } from '../api/propertiesAPI';
export var fetchPropertiesAction = function fetchPropertiesAction(objectTypeId) {
  return function (dispatch) {
    dispatch({
      type: PROPERTIES_FETCH_STARTED,
      payload: {
        objectTypeId: objectTypeId
      }
    });
    return getProperties(objectTypeId).then(function (properties) {
      dispatch({
        type: PROPERTIES_FETCH_SUCCEEDED,
        payload: {
          properties: properties,
          objectTypeId: objectTypeId
        }
      });
    }).catch(function (err) {
      dispatch({
        type: PROPERTIES_FETCH_FAILED,
        payload: {
          objectTypeId: objectTypeId
        }
      });
      throw err;
    });
  };
};