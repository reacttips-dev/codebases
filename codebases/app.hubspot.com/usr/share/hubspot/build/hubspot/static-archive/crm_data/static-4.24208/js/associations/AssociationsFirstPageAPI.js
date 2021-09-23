'use es6';

import * as ImmutableAPI from 'crm_data/api/ImmutableAPI';
import AssociationTypeToAssociationTypeId from 'crm_data/associations/AssociationTypeToAssociationTypeId';
import { Map as ImmutableMap, Set as ImmutableSet, List } from 'immutable';
export var LIMIT_PER_TYPE = 100;
var API = 'associations/v1/associations/';

var getFirstPageRequestBody = function getFirstPageRequestBody(keys) {
  return keys.reduce(function (acc, key) {
    var objectType = key.get('objectType');
    var associationType = AssociationTypeToAssociationTypeId.get(key.get('associationType'));

    if (acc.objectIdsByType && acc.objectIdsByType[objectType]) {
      acc.objectIdsByType[objectType] = acc.objectIdsByType[objectType].add(key.get('objectId'));
    } else {
      acc.objectIdsByType[objectType] = ImmutableSet([key.get('objectId')]);
    }

    if (!acc.associationTypeIdsByCategory.HUBSPOT_DEFINED.includes(associationType)) {
      acc.associationTypeIdsByCategory.HUBSPOT_DEFINED.push(associationType);
    }

    return acc;
  }, {
    objectIdsByType: {},
    associationTypeIdsByCategory: {
      HUBSPOT_DEFINED: []
    }
  });
};

var formatFirstPageResponse = function formatFirstPageResponse(response) {
  var associations = response.reduce(function (acc, result) {
    var objectId = "" + result.get('fromObjectId');
    var objectType = result.get('fromObjectType');
    var associationType = AssociationTypeToAssociationTypeId.findKey(function (associationId) {
      return associationId === result.get('associationTypeId');
    });
    return acc.set(ImmutableMap({
      objectType: objectType,
      associationType: associationType,
      objectId: objectId
    }), result.get('results'));
  }, ImmutableMap());
  return associations.map(function (association) {
    return association.update('results', function (idList) {
      return idList.reverse();
    });
  });
};

export function fetchFirstPage(keys) {
  var isFetchingOneTypeAndId = keys.groupBy(function (value) {
    return List([value.get('objectId'), value.get('objectType')]);
  }).size === 1;

  if (isFetchingOneTypeAndId) {
    var body = getFirstPageRequestBody(keys);
    return ImmutableAPI.post(API + "first-page-batch?limitPerType=" + LIMIT_PER_TYPE, body).then(formatFirstPageResponse);
  } else {
    var idsByAssociationType = keys.groupBy(function (value) {
      return value.get('associationType');
    }); // The batch endpoint only allows for 100 requests per type

    var groupedIdsByType = idsByAssociationType.flatMap(function (list) {
      return list.groupBy(function (item, index) {
        return List([item.get('associationType'), Math.floor(index / 100)]);
      });
    });
    var requests = groupedIdsByType.map(function (id) {
      var body = getFirstPageRequestBody(id);
      return ImmutableAPI.post(API + "first-page-batch?limitPerType=" + LIMIT_PER_TYPE, body);
    }); // WARNING: Do not swap this out for native promises
    // This only works if using Q because of done()

    return Promise.all(requests.valueSeq().toArray()).then(function (responses) {
      return responses.reduce(function (acc, response) {
        return acc.concat(response);
      }, List());
    }).then(formatFirstPageResponse);
  }
}