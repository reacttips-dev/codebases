'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _OBJECT_SEARCH_CONFIG;

import { COMPANY, CONTACT, DEAL, EDITABLE_DEAL, ENGAGEMENT, LINE_ITEM, PRODUCT_FOLDER, PRODUCT, QUOTE, REVENUE_DEAL_MERGE, TASK, TICKET } from 'reference-resolvers/constants/ReferenceObjectTypes';
import http from 'hub-http/clients/apiClient';
import { Map as ImmutableMap, List } from 'immutable';
import { formatToReferencesList } from 'reference-resolvers/lib/formatReferences';
import compose from 'transmute/compose';
import curry from 'transmute/curry';
import get from 'transmute/get';
import getIn from 'transmute/getIn';
import hasIn from 'transmute/hasIn';
import updateIn from 'transmute/updateIn';
import { formatContactName } from 'reference-resolvers/formatters/formatContacts';
import { formatCompanyName } from 'reference-resolvers/formatters/formatCompanies';
var SEARCH_API = 'contacts/search/v1/search/';
var addSortBy = curry(function (property, searchQuery) {
  searchQuery = searchQuery.toJS();

  if (searchQuery.sorts == null || searchQuery.sorts.length === 0) {
    return Object.assign({}, searchQuery, {
      sorts: [{
        property: property,
        order: 'ASC'
      }]
    });
  }

  return searchQuery;
});
var withIdField = curry(function (idField, ids) {
  return {
    count: ids.length,
    filterGroups: [{
      filters: [{
        property: idField,
        operator: 'IN',
        values: ids
      }]
    }]
  };
});
var formatResults = curry(function (resultsKey, getters, response) {
  var offset = response.offset,
      count = response.total,
      results = response[resultsKey];
  var hasMore = Object.prototype.hasOwnProperty.call(response, 'has-more') ? response['has-more'] : response.hasMore;
  return ImmutableMap({
    hasMore: hasMore,
    offset: offset,
    count: count,
    results: formatToReferencesList(getters, results)
  });
});
var formatResultsWithFilter = curry(function (resultsKey, getters, filters, response) {
  var results = response[resultsKey];
  var filteredResults = results.filter(function (result) {
    return filters(result) === 'true';
  });
  return formatResults(resultsKey, getters, Object.assign({}, response, _defineProperty({}, resultsKey, filteredResults)));
});
var findNamedProperty = curry(function (propertyName, properties) {
  return properties.find(function (p) {
    return get('name', p) === propertyName;
  });
});
export var OBJECT_SEARCH_CONFIGS = (_OBJECT_SEARCH_CONFIG = {}, _defineProperty(_OBJECT_SEARCH_CONFIG, CONTACT, {
  url: SEARCH_API + "contacts",
  adapter: {
    mapIds: withIdField('vid'),
    mapQuery: function mapQuery(searchQuery) {
      return searchQuery.update('sorts', function () {
        var sorts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : List();
        return sorts.push({
          property: 'createdate',
          order: 'DESC'
        }).push({
          property: 'vid',
          order: 'DESC'
        });
      }).toJS();
    },
    mapResponse: formatResults('contacts', {
      getId: get('vid'),
      getLabel: formatContactName
    })
  }
}), _defineProperty(_OBJECT_SEARCH_CONFIG, COMPANY, {
  url: SEARCH_API + "companies",
  adapter: {
    mapIds: withIdField('companyId'),
    mapQuery: addSortBy('createdate'),
    mapResponse: formatResults('companies', {
      getId: get('company-id'),
      getLabel: formatCompanyName
    })
  }
}), _defineProperty(_OBJECT_SEARCH_CONFIG, DEAL, {
  url: SEARCH_API + "deals",
  adapter: {
    mapIds: withIdField('dealId'),
    mapQuery: addSortBy('createdate'),
    mapResponse: formatResults('deals', {
      getId: get('dealId'),
      getLabel: getIn(['properties', 'dealname', 'value'])
    })
  }
}), _defineProperty(_OBJECT_SEARCH_CONFIG, EDITABLE_DEAL, {
  // Returns only deals that the current user can edit
  url: SEARCH_API + "deals?requestAction=EDIT",
  adapter: {
    mapIds: withIdField('dealId'),
    mapQuery: addSortBy('createdate'),
    mapResponse: formatResults('deals', {
      getId: get('dealId'),
      getLabel: getIn(['properties', 'dealname', 'value'])
    })
  }
}), _defineProperty(_OBJECT_SEARCH_CONFIG, ENGAGEMENT, {
  url: SEARCH_API + "engagements",
  adapter: {
    mapIds: withIdField('engagement.id'),
    mapQuery: addSortBy('engagement.createdAt'),
    mapResponse: formatResults('engagements', {
      getId: getIn(['engagement', 'id']),
      getLabel: function getLabel(res) {
        var _res$metadata = res.metadata,
            text = _res$metadata.text,
            body = _res$metadata.body,
            subject = _res$metadata.subject,
            title = _res$metadata.title,
            type = res.engagement.type;
        var label = text || body;

        if (['EMAIL', 'INCOMING_EMAIL', 'TASK'].includes(type)) {
          label = subject;
        } else if (type === 'MEETING' && title) {
          label = title;
        }

        var normalizedLabel = label ? String(label).replace(/<\/?[^>]+(>|$)/g, '').replace(/&nbsp;/g, ' ').replace(/&#x27;/g, "'").replace(/&#8230;/, '…').replace(/&quot;/, '"') : '';
        return normalizedLabel.length > 200 ? normalizedLabel.slice(0, 200) + "\u2026" : normalizedLabel;
      }
    })
  }
}), _defineProperty(_OBJECT_SEARCH_CONFIG, TASK, {
  url: SEARCH_API + "engagements",
  adapter: {
    mapIds: withIdField('engagement.id'),
    mapQuery: function mapQuery(query) {
      var taskFilter = new ImmutableMap({
        operator: 'EQ',
        property: 'engagement.type',
        value: 'TASK'
      });
      var onlyTasksFilter = updateIn(['filterGroups'], function () {
        var groups = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new List();
        return updateIn([0, 'filters'], function () {
          var filters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new List();
          return filters.concat([taskFilter]);
        }, groups);
      });
      return addSortBy('engagement.createdAt', onlyTasksFilter(query));
    },
    mapResponse: formatResults('engagements', {
      getId: getIn(['engagement', 'id']),
      getLabel: function getLabel(res) {
        return getIn(['metadata', 'subject'], res) || getIn(['metadata', 'body'], res);
      },
      getDescription: function getDescription(res) {
        // if the label is "using" the 'subject', use the body
        return hasIn(['metadata', 'subject'], res) ? getIn(['metadata', 'body'], res) : undefined;
      }
    })
  }
}), _defineProperty(_OBJECT_SEARCH_CONFIG, TICKET, {
  url: SEARCH_API + "services/tickets?includeAllValues=true&allPropertiesFetchMode=latest_version",
  adapter: {
    mapIds: withIdField('hs_ticket_id'),
    mapQuery: addSortBy('createdate'),
    mapResponse: formatResults('results', {
      getId: get('objectId'),
      getLabel: getIn(['properties', 'subject', 'value'])
    })
  }
}), _defineProperty(_OBJECT_SEARCH_CONFIG, PRODUCT, {
  url: SEARCH_API + "products?includeAllValues=true",
  adapter: {
    mapIds: withIdField('objectId'),
    mapQuery: addSortBy('createdate'),
    mapResponse: formatResults('results', {
      getId: get('objectId'),
      getLabel: getIn(['properties', 'name', 'value'])
    })
  }
}), _defineProperty(_OBJECT_SEARCH_CONFIG, PRODUCT_FOLDER, {
  url: 'folders/v1/search/products?includeAllValues=true',
  adapter: {
    mapIds: withIdField('folderId'),
    mapQuery: function mapQuery(query) {
      var FOLDER_TYPE = 2;
      var folderFilter = new ImmutableMap({
        operator: 'EQ',
        property: 'type',
        value: FOLDER_TYPE
      });
      var addProductFoldersFilter = updateIn(['filterGroups'], function () {
        var groups = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new List();
        return updateIn([0, 'filters'], function () {
          var filters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new List();
          return filters.concat([folderFilter]);
        }, groups);
      });
      return addSortBy('createdate', addProductFoldersFilter(query));
    },
    mapResponse: formatResults('results', {
      getId: get('folderId'),
      getLabel: get('name')
    })
  }
}), _defineProperty(_OBJECT_SEARCH_CONFIG, LINE_ITEM, {
  url: SEARCH_API + "lineitems?includeAllValues=true",
  adapter: {
    mapIds: withIdField('objectId'),
    mapQuery: addSortBy('createdate'),
    mapResponse: formatResults('results', {
      getId: get('objectId'),
      getLabel: getIn(['properties', 'name', 'value'])
    })
  }
}), _defineProperty(_OBJECT_SEARCH_CONFIG, QUOTE, {
  url: SEARCH_API + "quotes?includeAllValues=true",
  adapter: {
    mapIds: withIdField('quoteId'),
    mapQuery: addSortBy('createdate'),
    mapResponse: formatResults('results', {
      getId: get('quoteId'),
      getLabel: compose(get('value'), findNamedProperty('hs_title'), get('properties'))
    })
  }
}), _defineProperty(_OBJECT_SEARCH_CONFIG, REVENUE_DEAL_MERGE, {
  url: SEARCH_API + "deals",
  adapter: {
    mapIds: withIdField('dealId'),
    mapQuery: addSortBy('createdate'),
    mapResponse: formatResultsWithFilter('deals', {
      getId: get('dealId'),
      getLabel: getIn(['properties', 'dealname', 'value'])
    }, getIn(['properties', 'is_open', 'value']))
  }
}), _OBJECT_SEARCH_CONFIG);
export var createGetObjectsByIds = function createGetObjectsByIds(_ref) {
  var httpClient = _ref.httpClient;
  return curry(function (objectType, ids) {
    var _OBJECT_SEARCH_CONFIG2 = OBJECT_SEARCH_CONFIGS[objectType],
        url = _OBJECT_SEARCH_CONFIG2.url,
        adapter = _OBJECT_SEARCH_CONFIG2.adapter;
    var query = adapter.mapIds(ids);
    return httpClient.post(url, {
      data: query
    }).then(adapter.mapResponse).then(get('results'));
  });
};
export var getObjectsByIds = createGetObjectsByIds({
  httpClient: http
});
export var createSearchObjects = function createSearchObjects(_ref2) {
  var httpClient = _ref2.httpClient;
  return curry(function (objectType, originalQuery) {
    var _OBJECT_SEARCH_CONFIG3 = OBJECT_SEARCH_CONFIGS[objectType],
        url = _OBJECT_SEARCH_CONFIG3.url,
        adapter = _OBJECT_SEARCH_CONFIG3.adapter;
    var query = adapter.mapQuery(originalQuery);
    return httpClient.post(url, {
      data: query
    }).then(adapter.mapResponse);
  });
};
export var searchObjects = createSearchObjects({
  httpClient: http
});