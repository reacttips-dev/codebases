'use es6';

import { indexByIdString } from 'customer-data-objects/protocol/Identifiable';
import { List, Map as ImmutableMap } from 'immutable';
import * as ImmutableAPI from '../api/ImmutableAPI';
import { EMPTY } from 'crm_data/constants/LoadingStatus';
import makeBatch from '../api/makeBatch';
import OwnerRecord from 'customer-data-objects/owners/OwnerRecord';
import PaginatedSearchResponse from 'customer-data-objects/search/PaginatedSearchResponse';
import Raven from 'Raven';
import { logError } from 'customer-data-ui-utilities/eventLogging/eventLogger';
export var BASE_PATH = 'owners/v2/owners';

var handleFetchAllError = function handleFetchAllError(error, pagedOffset, usePaged) {
  return logError({
    error: error,
    extraData: {
      pagedOffset: pagedOffset,
      usePaged: usePaged
    }
  });
};

export function fetchAll() {
  var pagedOffset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var usePaged = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (usePaged) {
    return ImmutableAPI.get(BASE_PATH + "/paged", {
      includeSignature: false,
      offset: pagedOffset,
      limit: 500
    }, function (_ref) {
      var results = _ref.results,
          offset = _ref.offset,
          hasMore = _ref.hasMore;
      return {
        owners: List(results.map(OwnerRecord.fromJS)),
        offset: offset,
        hasMore: hasMore
      };
    }).catch(function (error) {
      return handleFetchAllError(error, pagedOffset, usePaged);
    });
  }

  return ImmutableAPI.get("" + BASE_PATH, {
    includeSignature: false
  }, function (owners) {
    return List(owners.map(OwnerRecord.fromJS));
  }).catch(function (error) {
    return handleFetchAllError(error, pagedOffset, usePaged);
  });
}
export function legacyFetchActiveOwners() {
  return fetchAll().then(indexByIdString);
}
export function updateOwner(owner) {
  var ownerId = owner.get('ownerId');
  return ImmutableAPI.put(BASE_PATH + "/id/" + ownerId, owner);
}
export function fetchCurrentOwner() {
  return ImmutableAPI.get(BASE_PATH + "/current/remotes", undefined, OwnerRecord.fromJS).catch(function (error) {
    // a 404 means this is a JITA user
    if (error.status === 404) {
      return EMPTY;
    }

    throw error;
  });
}
export function fetchByEmailFlat(email) {
  var error = new Error('OwnersAPI#fetchByEmailFlat - owner resolved via email alias');
  return ImmutableAPI.get(BASE_PATH + "/email/" + encodeURIComponent(email), {
    includeSignature: false
  }, function (owners) {
    return OwnerRecord.fromJS(owners[0]);
  }).then(function (owner) {
    // Temporarily added to identify all stores/components using this API
    // https://git.hubteam.com/HubSpot/CRM-Issues/issues/3545
    if (!email || !owner.get('email')) {
      return owner;
    }

    if (email.toUpperCase() !== owner.get('email').toUpperCase()) {
      Raven.captureException(error, {
        extra: {
          emailAlias: email,
          ownerEmail: owner.get('email')
        }
      });
    }

    return owner;
  });
}
export var fetchByEmails = makeBatch(fetchByEmailFlat, 'OwnersAPI.fetchByEmailFlat');
export function fetchByEmail(email) {
  return fetchByEmailFlat(email).then(function (owner) {
    return List.of(owner);
  });
}
export function fetchById(ownerId) {
  return ImmutableAPI.get(BASE_PATH + "/" + ownerId, {
    includeSignature: false
  }, OwnerRecord.fromJS);
}
export function fetchByIds(ownerIds) {
  return ImmutableAPI.get(BASE_PATH + "/batch", {
    includeSignature: false,
    ownerId: ownerIds.valueSeq().toJS()
  }, function (json) {
    return ImmutableMap(json).map(OwnerRecord.fromJS);
  });
}
export function fetchByRemoteIdFlat(remoteId) {
  return ImmutableAPI.get(BASE_PATH + "/remoteId/" + remoteId, {
    includeSignature: false
  }, function (owners) {
    return OwnerRecord.fromJS(owners[0]);
  });
}
export var fetchByRemoteIds = makeBatch(fetchByRemoteIdFlat, 'OwnersAPI.fetchByRemoteIdFlat');
export function fetchByRemoteId(remoteId) {
  return fetchByRemoteIdFlat(remoteId).then(function (owner) {
    return List.of(owner);
  });
}
var fromElasticSearch = PaginatedSearchResponse.fromElasticSearch({
  getHasMore: function getHasMore(response) {
    return response.hasMore;
  },
  getObjects: function getObjects(response) {
    return response.results;
  },
  getTotal: function getTotal(response) {
    return response.hasMore ? response.total : response.results.length;
  },
  getObjectId: function getObjectId(owner) {
    return owner.ownerId;
  },
  objectFromJS: OwnerRecord.fromJS
});
export function searchOwners(searchQuery) {
  var count = searchQuery.count,
      offset = searchQuery.offset,
      query = searchQuery.query;
  return ImmutableAPI.get(BASE_PATH + "/search", {
    limit: count,
    offset: offset,
    search: query
  }, fromElasticSearch(searchQuery));
}
export var searchOwnersBatch = makeBatch(searchOwners, 'OwnersAPI.searchOwners');