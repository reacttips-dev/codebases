'use es6';

import http from 'hub-http/clients/apiClient';
import { fromJS, List, Map as ImmutableMap } from 'immutable';
import ViewRecord from 'customer-data-objects/view/ViewRecord';
import { generatePath } from 'react-router-dom';
import { makeQuickFetchedRequest } from '../../../utils/makeQuickFetchedRequest';
import Raven from 'Raven';
var BASE_URL = '/sales/v3/views';
export var parseAttribute = function parseAttribute(value) {
  if (value == null) {
    return List();
  }

  try {
    if (typeof value === 'string') {
      return fromJS(JSON.parse(value)) || List();
    } else if (value.toJSON != null) {
      return fromJS(value.toJSON());
    } else {
      return value;
    }
  } catch (e) {
    return List();
  }
};
export var parseView = function parseView(view) {
  return ViewRecord.fromJS(view).update('columns', parseAttribute).update('state', parseAttribute).update('filters', parseAttribute);
};
export var parseResponse = function parseResponse(_ref) {
  var results = _ref.results;
  return results.reduce(function (views, view) {
    return views.set(String(view.id), parseView(view));
  }, ImmutableMap());
};
var quickFetchedViews = makeQuickFetchedRequest('views', function (objectTypeId) {
  return http.get(generatePath(BASE_URL + "/:objectTypeId", {
    objectTypeId: objectTypeId
  }), {
    query: {
      count: 20000
    }
  });
});
export var fetchViews = function fetchViews(objectTypeId) {
  return quickFetchedViews(objectTypeId).then(parseResponse);
};
export var writeView = function writeView(_ref2) {
  var view = _ref2.view;

  if (!view.name) {
    // HACK: This instant try/catch block is intentional! We're using it to
    // capture a stack trace so that we can figure out where and how these are being called.
    // Please do not remove it!
    try {
      throw new Error("View name was falsy! Expected a string but got " + view.name);
    } catch (error) {
      Raven.captureException(error, {
        extra: {
          view: view
        }
      });
      return Promise.reject(error);
    }
  }

  return http.put(generatePath(BASE_URL + "/:viewId", {
    viewId: view.id
  }), {
    data: view
  });
};
export var delView = function delView(viewId) {
  return http.delete(generatePath(BASE_URL + "/:viewId", {
    viewId: viewId
  }));
};
export var createView = function createView(_ref3) {
  var view = _ref3.view;

  if (!view.name) {
    // HACK: This instant try/catch block is intentional! We're using it to
    // capture a stack trace so that we can figure out where and how these are being called.
    // Please do not remove it!
    try {
      throw new Error("View name was falsy! Expected a string but got " + view.name);
    } catch (error) {
      Raven.captureException(error, {
        extra: {
          view: view
        }
      });
      return Promise.reject(error);
    }
  }

  return http.post(BASE_URL, {
    data: view
  }).then(parseView);
};
export var getDoesViewExist = function getDoesViewExist(_ref4) {
  var objectTypeId = _ref4.objectTypeId,
      name = _ref4.name;
  return http.get(generatePath('sales/v3/views/is-name-used/:objectTypeId/:name', {
    objectTypeId: objectTypeId,
    name: name
  }));
};