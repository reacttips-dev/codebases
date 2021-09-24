'use es6';

import DefaultFavoriteProperties from 'crm_data/constants/DefaultFavoriteProperties';
import { fromJS, List } from 'immutable';
import { lookup } from 'crm_schema/constants/CRMTypes';
import { get, post } from 'crm_data/api/JITASafeAPI';
import { VISIT } from 'customer-data-objects/constants/ObjectTypes';

var _getURL = function _getURL(objectType) {
  return "sales/v1/favorites/" + lookup[objectType];
};

var _getDefaultsURL = function _getDefaultsURL(objectType) {
  return _getURL(objectType) + "/defaults";
};

export var getFavoriteDefaults = function getFavoriteDefaults(objectType) {
  var defaults = DefaultFavoriteProperties[objectType];

  if (defaults == null) {
    return null;
  }

  return fromJS(defaults.map(function (property, i) {
    return {
      property: property,
      displayOrder: i + 1
    };
  }));
};
export var getObjectCreatorFavorites = function getObjectCreatorFavorites(_ref) {
  var objectType = _ref.objectType;

  if (objectType === VISIT) {
    return Promise.resolve(List());
  }

  return get(_getURL(objectType)).then(function (result) {
    if (result == null || result.size <= 0) {
      return List();
    }

    return result;
  });
};
export var fetch = function fetch(_ref2) {
  var objectType = _ref2.objectType;
  // for VISITs, just fall back to favorite defaults instead of a full fetch
  var request = objectType !== VISIT ? get(_getURL(objectType)) : Promise.resolve(List());
  return request.then(function (result) {
    if (result == null || result.size <= 0) {
      return getFavoriteDefaults(objectType);
    }

    return result;
  });
};
export var save = function save(_ref3) {
  var objectType = _ref3.objectType,
      favorites = _ref3.favorites;
  return post(_getURL(objectType), favorites);
};
export var fetchDefaults = function fetchDefaults(_ref4) {
  var objectType = _ref4.objectType;

  if (objectType === VISIT) {
    return Promise.resolve(List());
  }

  return get(_getDefaultsURL(objectType));
};
export var saveDefaults = function saveDefaults(_ref5) {
  var objectType = _ref5.objectType,
      defaults = _ref5.defaults;
  return post(_getDefaultsURL(objectType), defaults);
};