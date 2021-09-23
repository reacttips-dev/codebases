'use es6';

import { ASSOCIATIONS_REFRESH_QUEUED, OBJECT_ASSOCIATION_SUCCEEDED, OBJECT_DISASSOCIATION_SUCCEEDED } from 'crm_data/actions/ActionTypes';
import { associateObject, disassociateCrmObject, disassociateObject, fetch } from 'crm_data/associations/AssociationsAPI';
import { dispatchImmediate, dispatchQueue } from 'crm_data/dispatch/Dispatch';
import { CONTACT_TO_COMPANY, COMPANY_TO_CONTACT, CONTACT_TO_DEAL, DEAL_TO_CONTACT, DEAL_TO_COMPANY, COMPANY_TO_DEAL, ENGAGEMENT_TO_COMPANY, ENGAGEMENT_TO_CONTACT, ENGAGEMENT_TO_DEAL, ENGAGEMENT_TO_TICKET } from 'crm_data/associations/AssociationTypes';
import { DISASSOCIATE_CONTACT_AND_COMPANY, ASSOCIATE_CONTACT_AND_DEAL, DISASSOCIATE_CONTACT_AND_DEAL, ASSOCIATE_UNIVERSAL_ASSOCIATION_AND_ENGAGEMENT, ASSOCIATE_ALL_UNIVERSAL_ASSOCIATIONS_AND_ENGAGEMENT, DISASSOCIATE_UNIVERSAL_ASSOCIATION_AND_ENGAGEMENT } from 'crm_schema/association/AssociationActionTypes';
import { List, Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import { ASSOCIATIONS } from '../actions/ActionNamespaces';
var UPDATED = ASSOCIATIONS + "_UPDATED";

var addAssociationsToCachedRecords = function addAssociationsToCachedRecords(associationType, subjectId, objectIds, fromObjectType, toObjectType) {
  objectIds.forEach(function (objectId) {
    switch (associationType) {
      case CONTACT_TO_COMPANY:
      case COMPANY_TO_DEAL:
        dispatchImmediate("ASSOCIATE_" + fromObjectType + "_AND_" + toObjectType, {
          subjectId: objectId,
          objectId: subjectId
        });
        break;

      case COMPANY_TO_CONTACT:
      case DEAL_TO_CONTACT:
      case DEAL_TO_COMPANY:
        dispatchImmediate("ASSOCIATE_" + toObjectType + "_AND_" + fromObjectType, {
          subjectId: subjectId,
          objectId: objectId
        });
        break;

      case CONTACT_TO_DEAL:
        dispatchImmediate(ASSOCIATE_CONTACT_AND_DEAL, {
          subjectId: objectId,
          objectId: +subjectId
        });
        break;

      case ENGAGEMENT_TO_COMPANY:
      case ENGAGEMENT_TO_CONTACT:
      case ENGAGEMENT_TO_DEAL:
      case ENGAGEMENT_TO_TICKET:
        dispatchImmediate("ASSOCIATE_" + toObjectType + "_AND_" + fromObjectType, {
          subjectId: subjectId,
          objectIds: List([objectId]),
          objectType: toObjectType
        });
        break;

      default:
        break;
    }
  });
};

var removeAssociationsFromCachedRecords = function removeAssociationsFromCachedRecords(associationType, subjectId, objectId, fromObjectType, toObjectType) {
  switch (associationType) {
    case COMPANY_TO_CONTACT:
    case DEAL_TO_CONTACT:
    case DEAL_TO_COMPANY:
      dispatchImmediate("DISASSOCIATE_" + toObjectType + "_AND_" + fromObjectType, {
        subjectId: subjectId,
        objectId: objectId
      });
      break;

    case COMPANY_TO_DEAL:
      dispatchImmediate("DISASSOCIATE_" + fromObjectType + "_AND_" + toObjectType, {
        subjectId: objectId,
        objectId: +subjectId
      });
      break;

    case CONTACT_TO_COMPANY:
      dispatchImmediate(DISASSOCIATE_CONTACT_AND_COMPANY, {
        subjectId: objectId,
        objectId: subjectId
      });
      break;

    case CONTACT_TO_DEAL:
      dispatchImmediate(DISASSOCIATE_CONTACT_AND_DEAL, {
        subjectId: objectId,
        objectId: +subjectId
      });
      break;

    case ENGAGEMENT_TO_COMPANY:
    case ENGAGEMENT_TO_CONTACT:
    case ENGAGEMENT_TO_DEAL:
    case ENGAGEMENT_TO_TICKET:
      dispatchImmediate("DISASSOCIATE_" + toObjectType + "_AND_" + fromObjectType, {
        subjectId: subjectId,
        objectIds: List([objectId]),
        objectType: toObjectType
      });
      break;

    default:
      return null;
  }

  return null;
};

function onAssociationSuccess(_ref) {
  var associationType = _ref.associationType,
      subjectId = _ref.subjectId,
      objectIds = _ref.objectIds,
      fromObjectType = _ref.fromObjectType,
      toObjectType = _ref.toObjectType;
  dispatchImmediate(OBJECT_ASSOCIATION_SUCCEEDED, {
    objectId: subjectId,
    associationsAdded: objectIds,
    fromObjectType: fromObjectType,
    toObjectType: toObjectType
  });
  addAssociationsToCachedRecords(associationType, subjectId, objectIds, fromObjectType, toObjectType);
}

export function associate(subjectId, objectIds, fromObjectType, toObjectType, associationTypeId // Optional parameter to specify a primary or unlabeled ID
) {
  var associationType = fromObjectType + "_TO_" + toObjectType;
  return associateObject({
    subjectId: subjectId,
    objectIds: objectIds,
    associationType: associationType,
    associationTypeId: associationTypeId
  }).then(function () {
    onAssociationSuccess({
      associationType: associationType,
      subjectId: subjectId,
      objectIds: objectIds,
      fromObjectType: fromObjectType,
      toObjectType: toObjectType
    });
  });
}
export function onDisassociationSuccess(_ref2) {
  var associationType = _ref2.associationType,
      subjectId = _ref2.subjectId,
      objectId = _ref2.objectId,
      fromObjectType = _ref2.fromObjectType,
      toObjectType = _ref2.toObjectType;
  dispatchImmediate(OBJECT_DISASSOCIATION_SUCCEEDED, {
    objectId: subjectId,
    associationsRemoved: objectId,
    fromObjectType: fromObjectType,
    toObjectType: toObjectType
  });
  removeAssociationsFromCachedRecords(associationType, subjectId, objectId, fromObjectType, toObjectType);
}
export function disassociate(subjectId, objectId, fromObjectType, toObjectType) {
  var associationType = fromObjectType + "_TO_" + toObjectType;
  return disassociateObject({
    subjectId: subjectId,
    objectId: objectId,
    associationType: associationType
  }).then(function () {
    onDisassociationSuccess({
      associationType: associationType,
      subjectId: subjectId,
      objectId: objectId,
      fromObjectType: fromObjectType,
      toObjectType: toObjectType
    });
  });
} // TODO
// This only has to live until https://git.hubteam.com/HubSpot/CRM-Issues/issues/1292 is fixed
// Then we can link all association cards to the filtered table

export function fetchMoreAssociations(objectType, objectId, associationObjectType, offset, currentassociationIds) {
  var associationType = objectType + "_TO_" + associationObjectType;
  var key = ImmutableMap({
    objectType: objectType,
    objectId: objectId,
    associationType: associationType,
    offset: offset
  });
  return fetch(key).then(function (data) {
    var oldResults = List(currentassociationIds);
    var newResults = oldResults.concat(data.get('results'));
    var newResponse = ImmutableMap().set(key.delete('offset'), data.merge({
      results: newResults
    }));
    dispatchImmediate(UPDATED, newResponse);
  });
}
export var updateEngagementsStoreWithUniversalAssociations = function updateEngagementsStoreWithUniversalAssociations(_ref3) {
  var engagementId = _ref3.engagementId,
      universalAssociationMap = _ref3.universalAssociationMap;
  dispatchQueue(ASSOCIATE_ALL_UNIVERSAL_ASSOCIATIONS_AND_ENGAGEMENT, {
    engagementId: engagementId,
    universalAssociationMap: universalAssociationMap
  });
};
export var associateUniversalAssociation = function associateUniversalAssociation(_ref4) {
  var engagementId = _ref4.engagementId,
      objectId = _ref4.objectId,
      updatedAssociationRecord = _ref4.updatedAssociationRecord;
  var associationTypeId = updatedAssociationRecord.get('associationTypeId');
  var associationCategory = updatedAssociationRecord.get('associationCategory');
  return associateObject({
    subjectId: engagementId,
    objectIds: [objectId],
    associationTypeId: associationTypeId,
    associationCategory: associationCategory
  }).then(function () {
    dispatchImmediate(ASSOCIATE_UNIVERSAL_ASSOCIATION_AND_ENGAGEMENT, {
      engagementId: engagementId,
      updatedAssociationRecord: updatedAssociationRecord
    });
  });
};
export var disassociateUniversalAssociation = function disassociateUniversalAssociation(_ref5) {
  var engagementId = _ref5.engagementId,
      objectId = _ref5.objectId,
      updatedAssociationRecord = _ref5.updatedAssociationRecord;
  var associationTypeId = updatedAssociationRecord.get('associationTypeId');
  var associationCategory = updatedAssociationRecord.get('associationCategory');
  return disassociateCrmObject({
    engagementId: engagementId,
    objectId: objectId,
    associationTypeId: associationTypeId,
    associationCategory: associationCategory
  }).then(function () {
    dispatchImmediate(DISASSOCIATE_UNIVERSAL_ASSOCIATION_AND_ENGAGEMENT, {
      engagementId: engagementId,
      updatedAssociationRecord: updatedAssociationRecord
    });
  });
};
export var refreshAssociations = function refreshAssociations(_ref6) {
  var objectId = _ref6.objectId,
      objectType = _ref6.objectType,
      associationObjectType = _ref6.associationObjectType;
  dispatchQueue(ASSOCIATIONS_REFRESH_QUEUED, ImmutableSet([ImmutableMap({
    objectId: objectId,
    objectType: objectType,
    associationType: objectType + "_TO_" + associationObjectType
  })]));
};