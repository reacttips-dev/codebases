'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import * as ImmutableAPI from 'crm_data/api/ImmutableAPI';
import { lookup } from 'crm_schema/constants/CRMTypes';
import getDefaultViewId from '../../views/getDefaultViewId';
import { TASK, VISIT } from 'customer-data-objects/constants/ObjectTypes';
import ViewRecord from 'customer-data-objects/view/ViewRecord';
import { QUEUE, STANDARD } from 'customer-data-objects/view/ViewTypes';
import PortalIdParser from 'PortalIdParser';
import { fromJS, List, Map as ImmutableMap } from 'immutable';
import { isObjectTypeId, ObjectTypesToIds } from 'customer-data-objects/constants/ObjectTypeIds';
import { setDefaultView } from 'crm_data/views/DefaultViewAPI';
import { TASK_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
var ATTRIBUTES_REQUIRING_PARSING = ['columns', 'state', 'filters'];
var ROOT_URI = 'sales/v2/settings/views';
var V3_ROOT_URI = 'sales/v3/views';

var URI = function URI(objectType) {
  var objectTypeString = lookup[objectType];
  return ROOT_URI + "/" + objectTypeString;
};

export var getShouldUseV3Backend = function getShouldUseV3Backend(objectType) {
  return ![VISIT, TASK].includes(objectType);
};

var toSaveableJSON = function toSaveableJSON(view) {
  ATTRIBUTES_REQUIRING_PARSING.forEach(function (attr) {
    if (view[attr] != null) {
      view[attr] = JSON.stringify(view[attr]);
    }
  });
  delete view.filterGroups;
  delete view.modified;
  view.portalId = PortalIdParser.get();
  return view;
};

var toJSONWithTypeId = function toJSONWithTypeId(view, objectTypeId) {
  var _toSaveableJSON = toSaveableJSON(view.toJS()),
      __collectionType = _toSaveableJSON.collectionType,
      jsonView = _objectWithoutProperties(_toSaveableJSON, ["collectionType"]);

  return Object.assign({}, jsonView, {
    objectTypeId: objectTypeId
  });
};

var parseInner = function parseInner(value) {
  if (value != null) {
    if (typeof value === 'string') {
      return fromJS(JSON.parse(value)) || List();
    } else if (value.toJSON != null) {
      return fromJS(value.toJSON());
    } else {
      return value;
    }
  } else {
    return List();
  }
};

var parseView = function parseView(view) {
  ATTRIBUTES_REQUIRING_PARSING.forEach(function (attr) {
    view = view.set(attr, parseInner(view.get(attr)));
  });
  return view;
};

export var parseResults = function parseResults(objectType, results) {
  return results.reduce(function (map, view) {
    if (objectType === TASK || objectType === TASK_TYPE_ID) {
      view = view.set('type', QUEUE);
    } else {
      view = view.set('type', STANDARD);
    }

    return map.set("" + view.get('id'), ViewRecord.fromJS(parseView(view)));
  }, ImmutableMap());
};
export var fetch = function fetch(objectType) {
  if (getShouldUseV3Backend(objectType)) {
    var objectTypeId = ObjectTypesToIds[objectType] || objectType;
    return ImmutableAPI.get(V3_ROOT_URI + "/" + encodeURIComponent(objectTypeId), {
      count: 20000
    }).then(function (response) {
      return {
        views: parseResults(objectTypeId, response.get('results'))
      };
    });
  }

  return ImmutableAPI.get(URI(objectType)).then(function (results) {
    var viewRecords = parseResults(objectType, results.get('views'));
    return {
      objectType: objectType,
      views: viewRecords,
      defaultViewId: results.get('defaultView') || getDefaultViewId(objectType)
    };
  });
};
export var update = function update(_ref) {
  var objectType = _ref.objectType,
      view = _ref.view;

  if (getShouldUseV3Backend(objectType)) {
    var objectTypeId = ObjectTypesToIds[objectType] || objectType;
    return ImmutableAPI.put(V3_ROOT_URI + "/" + encodeURIComponent(view.get('id')), toJSONWithTypeId(view, objectTypeId)).then(function (response) {
      return parseResults(objectTypeId, List.of(response));
    });
  }

  var url = ROOT_URI + "/" + encodeURIComponent(view.get('id'));
  view = view.toJS();
  view.collectionType = lookup[objectType];
  view = toSaveableJSON(view);
  return ImmutableAPI.put(url, view).then(function (result) {
    return parseResults(objectType, List.of(result));
  });
};
export var create = function create(_ref2) {
  var objectType = _ref2.objectType,
      view = _ref2.view;

  if (getShouldUseV3Backend(objectType)) {
    var objectTypeId = ObjectTypesToIds[objectType] || objectType;
    return ImmutableAPI.post(V3_ROOT_URI, toJSONWithTypeId(view, objectTypeId)).then(function (response) {
      return parseResults(objectTypeId, List.of(response));
    });
  }

  view = view.toJS();
  view.collectionType = lookup[objectType];
  view = toSaveableJSON(view);
  return ImmutableAPI.post(ROOT_URI + "/", view, function (results) {
    return parseResults(objectType, fromJS([results]));
  });
};
export var delWithV3Backend = function delWithV3Backend(viewId) {
  return ImmutableAPI.del(V3_ROOT_URI + "/" + encodeURIComponent(viewId));
};
export var del = function del(_ref3) {
  var objectType = _ref3.objectType,
      viewId = _ref3.viewId;

  if (getShouldUseV3Backend(objectType)) {
    return delWithV3Backend(viewId);
  }

  return ImmutableAPI.del(ROOT_URI + "/" + encodeURIComponent(viewId));
};
export var makeDefault = function makeDefault(objectType, viewId) {
  if (isObjectTypeId(objectType)) {
    return setDefaultView({
      objectTypeId: objectType,
      viewId: viewId
    });
  }

  var objectTypeString = lookup[objectType];
  return ImmutableAPI.put(ROOT_URI + "/" + objectTypeString + "/default/" + viewId);
};