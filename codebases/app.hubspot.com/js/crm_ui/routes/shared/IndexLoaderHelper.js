'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { Map as ImmutableMap, fromJS } from 'immutable';
import { connectPromiseSingle } from 'crm_data/flux/connectPromiseSingle';
import PropertiesStore from 'crm_data/properties/PropertiesStore';
import PropertyGroupsStore from 'crm_data/properties/PropertyGroupsStore';
import ViewsStore from '../../flux/views/ViewsStore';
import DefaultViewStore from 'crm_data/views/DefaultViewStore';
import UserSettingsStore, { FETCH_FAILED_KEY, FETCH_FAILED_VALUE } from 'crm_data/settings/UserSettingsStore';
import UserPortalSettingsKeys from 'crm_data/settings/UserPortalSettingsKeys';
import RouterContainer from '../../../containers/RouterContainer';
import getDefaultViewId from '../../views/getDefaultViewId';
import { stringify } from 'hub-http/helpers/params';
import pluck from 'transmute/pluck';
import ViewsActions from '../../flux/views/ViewsActions';
import { EMPTY, isLoading } from 'crm_data/flux/LoadingStatus';
import Raven from 'Raven';
import { createErrorOverlay } from '../../error/createErrorOverlay';
import { getFetchRequiredFilterPlaceholderResolverData, fetchSettings } from 'crm_data/filters/FilterPlaceholderResolver';
import AssociationDefinitionStore from '../../../associations/stores/AssociationDefinitionStore';
import { normalizeTypeId } from '../../../utils/normalizeTypeId';
export var getJsonFilters = function getJsonFilters(value) {
  try {
    return fromJS(JSON.parse(decodeURIComponent(value)));
  } catch (err) {
    Raven.captureException(err, {
      extra: {
        value: value
      }
    });
    return fromJS(JSON.parse(value));
  }
};

var getFavoriteSettingsKey = function getFavoriteSettingsKey(objectType) {
  return UserPortalSettingsKeys["COLUMN_FAVS_" + objectType];
};

var fetchFavoriteColumns = connectPromiseSingle({
  stores: [UserSettingsStore],
  deref: function deref(_ref) {
    var objectType = _ref.objectType;
    var store = UserSettingsStore.get(); // please keep UserSettingsStore.get() here rather than UserSettingsStore.get(key) for https://hubspot.slack.com/archives/C80DDL2N7/p1603731957204800

    var failed = store.get(FETCH_FAILED_KEY) === FETCH_FAILED_VALUE;
    var value = UserSettingsStore.get(getFavoriteSettingsKey(objectType));

    if (failed) {
      return EMPTY;
    } else {
      return value;
    }
  }
});
var fetchProperties = connectPromiseSingle({
  stores: [PropertiesStore, PropertyGroupsStore],
  deref: function deref(_ref2) {
    var objectType = _ref2.objectType;
    return PropertiesStore.get(objectType);
  }
});
var fetchViews = connectPromiseSingle({
  stores: [ViewsStore],
  deref: function deref(_ref3) {
    var objectType = _ref3.objectType;
    return ViewsStore.get(ImmutableMap({
      objectType: objectType
    }));
  }
});
var fetchDefaultViewId = connectPromiseSingle({
  stores: [DefaultViewStore],
  deref: function deref(_ref4) {
    var objectType = _ref4.objectType;
    var defaultViewId = DefaultViewStore.get(objectType);

    if (isLoading(defaultViewId)) {
      return defaultViewId;
    }

    return defaultViewId || getDefaultViewId(objectType);
  }
});
var fetchAssociations = connectPromiseSingle({
  stores: [AssociationDefinitionStore],
  deref: function deref(_ref5) {
    var objectType = _ref5.objectType;
    var objectTypeId = normalizeTypeId(objectType);
    return AssociationDefinitionStore.get(objectTypeId);
  }
});
var PARAM_ALLOWLIST = ['associatedcompanyid', 'associations.company', 'associations.contact', 'formSubmissions.formId', 'hs_parent_company_id'];

var handleRouteChange = function handleRouteChange(baseUrl, query) {
  var url = baseUrl + "?" + stringify(query);
  RouterContainer.get().navigate(url, {
    replace: true,
    trigger: true
  });
};

var addQueryParamFilters = function addQueryParamFilters(filters, query) {
  Object.keys(query).forEach(function (key) {
    var value = query[key];

    if (value && PARAM_ALLOWLIST.indexOf(key) !== -1) {
      filters = filters.filter(function (filter) {
        return filter.get('property') !== key;
      });

      if (key === 'formSubmissions.formId') {
        filters = filters.push(fromJS({
          operator: 'IN',
          property: key,
          values: [value]
        }));
      } else {
        filters = filters.push(fromJS({
          operator: 'EQ',
          property: key,
          value: value
        }));
      }
    }

    if (key === 'filters') {
      try {
        var jsonFilters = getJsonFilters(value);
        var filterProperties = pluck('property', jsonFilters);
        filters = filters.filter(function (filter) {
          return filterProperties.indexOf(filter.get('property')) === -1;
        });
        filters = filters.concat(jsonFilters);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('JSON parse failed', e);
      }
    }
  });
  return filters;
};

export default function (options, callback) {
  var _options = options,
      objectType = _options.objectType,
      getRouteURL = _options.getRouteURL;
  var _options2 = options,
      viewIdParam = _options2.viewIdParam,
      query = _options2.query;

  if (viewIdParam && typeof viewIdParam !== 'string') {
    query = viewIdParam;
    viewIdParam = undefined;
  }

  var normalizedQuery = Object.keys(query).reduce(function (acc, key) {
    var normalizedKey = key.replace('-', '.');
    acc[normalizedKey] = query[key];
    return acc;
  }, {});

  var onError = function onError(error) {
    var errorCode = error && error.errorCode ? error.errorCode : 500;
    createErrorOverlay(String(errorCode));
  };

  var onSuccess = function onSuccess(_ref6) {
    var _ref7 = _slicedToArray(_ref6, 7),
        views = _ref7[0],
        defaultViewId = _ref7[1],
        favoriteColumns = _ref7[2],
        properties = _ref7[3],
        __settings = _ref7[4],
        __filterPlaceholderValues = _ref7[5],
        associations = _ref7[6];

    var viewId = viewIdParam || defaultViewId;
    var view = views.get(viewId);

    if (!views.has(defaultViewId)) {
      defaultViewId = getDefaultViewId(objectType);
    }

    var defaultView = views.get(defaultViewId);

    if (viewIdParam !== viewId || !view) {
      if (!view && defaultViewId) {
        viewId = defaultViewId;
        view = defaultView;
      }

      handleRouteChange(getRouteURL(viewId), normalizedQuery);
    }

    var filters = view.get('filters');
    var newFilters = addQueryParamFilters(filters, normalizedQuery);

    if (filters !== newFilters) {
      view = view.set('filters', newFilters);
      options = fromJS({
        viewId: viewId,
        objectType: objectType,
        filters: newFilters
      });
      ViewsActions.changeFilters(options);
      var hadQueryFilters = false;
      PARAM_ALLOWLIST.forEach(function (param) {
        if (normalizedQuery[param]) {
          normalizedQuery[param] = undefined;
          hadQueryFilters = true;
        }
      });

      if (normalizedQuery.filters) {
        normalizedQuery.filters = undefined;
        hadQueryFilters = true;
      }

      if (hadQueryFilters) {
        handleRouteChange(getRouteURL(viewId), normalizedQuery);
      }
    }

    callback({
      associations: associations,
      favoriteColumns: favoriteColumns,
      normalizedQuery: normalizedQuery,
      properties: properties,
      view: view,
      viewId: viewId,
      views: views
    });
  };

  Promise.all([fetchViews({
    objectType: objectType
  }), fetchDefaultViewId({
    objectType: objectType
  }), fetchFavoriteColumns({
    objectType: objectType
  }), fetchProperties({
    objectType: objectType
  }), fetchSettings(), getFetchRequiredFilterPlaceholderResolverData(objectType)(), fetchAssociations({
    objectType: objectType
  })]).then(onSuccess, onError).done();
}