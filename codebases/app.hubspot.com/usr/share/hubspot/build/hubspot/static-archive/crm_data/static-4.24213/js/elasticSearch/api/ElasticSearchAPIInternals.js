'use es6';

import { fromJS, Map as ImmutableMap } from 'immutable';
import isEmpty from 'transmute/isEmpty';
import memoize from 'transmute/memoize';
import { DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import { connectPromiseSingle } from 'crm_data/flux/connectPromiseSingle';
import { send } from 'crm_data/api/ImmutableAPI';
import { POST } from 'crm_data/constants/HTTPVerbs';
import { replaceSpecialTypes } from 'crm_data/filters/FilterPlaceholderResolver';
import DealStageStore from 'crm_data/deals/DealStageStore';
import TicketsPipelinesStagesStore from 'crm_data/tickets/TicketsPipelinesStagesStore';
import { elasticSearchApiInfo, elasticSearchApiUrl } from 'crm_data/elasticSearch/api/ElasticSearchAPIInfo';
import { isEligible } from 'crm_data/crmSearch/isEligible';
import { getPropertiesToFetch } from '../../views/PropertiesToFetch';
import { maybeDecorateQueryWithPipelinePermissions } from './maybeDecorateQueryWithPipelinePermissions';
import { CONTACT } from 'customer-data-objects/constants/ObjectTypes';
import PortalIdParser from 'PortalIdParser';
export var REQUEST_OPTIONS = {
  type: POST,
  timeout: 60000
};
var fetchDealStages = connectPromiseSingle(DealStageStore, function (dealStages) {
  return dealStages.isEmpty();
});
var fetchTicketStages = connectPromiseSingle(TicketsPipelinesStagesStore, function (ticketStages) {
  return ticketStages.isEmpty();
});
export var getNormalizer = memoize(function (objectType) {
  var api = elasticSearchApiInfo(objectType);
  var isEligibleForCrmSearch = isEligible(objectType);
  var Record = api.Record;
  var idAccessor = isEligibleForCrmSearch ? ['objectId'] : Record._idKey;
  var idSetter = Record._idKey;
  return function () {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ImmutableMap();
    var objectsById = data.reduce(function (map, obj) {
      var objWithId = obj.setIn(idSetter, obj.getIn(idAccessor));

      if (objectType === CONTACT && isEligibleForCrmSearch) {
        objWithId = objWithId // crm search only indexes canonical objects; after a merge the 'losing' objects
        // are dropped from the ES index. the objectId of a result from crm search can be
        // assumed to be its canonical id
        .set('canonical-vid', obj.getIn(idAccessor)) // crm search only returns results from the current portal
        .set('portal-id', PortalIdParser.get()); // The following fields returned by contacts search are explicitly not normalized:
        // * is-contact - we rely on the default value `true` in ContactRecord
        // * merged-vids - unused
        // * identity-profiles - unused
        // * merge-audits - unused
      }

      return map.set(objWithId.getIn(idSetter), Record.fromJS(objWithId));
    }, ImmutableMap());

    if (objectsById.size > 0) {
      api.updateStore(objectsById);
    }

    return data.toList().map(function (obj) {
      return obj.getIn(idAccessor);
    });
  };
});
export var getSearchResultsHandler = memoize(function (objectType) {
  var api = elasticSearchApiInfo(objectType);
  return function (data) {
    var normalize = getNormalizer(objectType);
    return fromJS(data).updateIn([api.dataKey], normalize).set('_results', data.getIn([api.dataKey]));
  };
});
export var decoratePropertiesToFetch = function decoratePropertiesToFetch(objectType) {
  var searchQuery = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var properties = getPropertiesToFetch(objectType, searchQuery);

  if (!isEmpty(searchQuery.properties) || isEmpty(properties)) {
    return searchQuery;
  }

  return Object.assign({}, searchQuery, {
    properties: properties
  });
};

var fetchSearchResults = function fetchSearchResults(objectType, searchQuery, queryParams) {
  searchQuery = searchQuery.toJS();

  if (searchQuery.filterGroups) {
    searchQuery.filterGroups = searchQuery.filterGroups.map(function (filterGroup) {
      filterGroup.filters = replaceSpecialTypes(filterGroup.filters);
      return filterGroup;
    });
  }

  return send(REQUEST_OPTIONS, elasticSearchApiUrl(objectType, queryParams), decoratePropertiesToFetch(objectType, searchQuery)).then(getSearchResultsHandler(objectType));
};

export var search = function search(objectType, searchQuery, queryParams) {
  if (!elasticSearchApiInfo(objectType)) {
    return undefined;
  }

  var queryWithPipelinePermissions = maybeDecorateQueryWithPipelinePermissions(objectType, searchQuery);

  var fetch = function fetch() {
    return fetchSearchResults(objectType, queryWithPipelinePermissions, queryParams);
  };

  if (objectType === DEAL) {
    return fetchDealStages().then(fetch);
  }

  if (objectType === TICKET) {
    return fetchTicketStages().then(fetch);
  }

  return fetch();
};
var onlyShowEditableParam = {
  requestAction: 'EDIT'
};
export var searchEditable = function searchEditable(objectType, searchQuery) {
  return search(objectType, searchQuery, onlyShowEditableParam);
};