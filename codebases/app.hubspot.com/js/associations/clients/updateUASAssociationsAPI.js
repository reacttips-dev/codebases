'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import http from 'hub-http/clients/apiClient';
import { logCallingError } from 'calling-error-reporting/report/error';
import difference from 'transmute/difference';

var getUpdatableAssociationsData = function getUpdatableAssociationsData(_ref) {
  var universalAssociationRecord = _ref.universalAssociationRecord,
      toObjectId = _ref.toObjectId,
      engagementId = _ref.engagementId;
  return {
    associationCategory: universalAssociationRecord.get('associationCategory'),
    associationTypeId: universalAssociationRecord.get('associationTypeId'),
    fromObjectId: engagementId,
    toObjectId: toObjectId
  };
};

var updateAssociations = function updateAssociations(_ref2) {
  var data = _ref2.data,
      updatedAssociations = _ref2.updatedAssociations,
      associationsFromContext = _ref2.associationsFromContext,
      _ref2$remove = _ref2.remove,
      remove = _ref2$remove === void 0 ? false : _ref2$remove;
  return http.put("associations-writes/v1/associations" + (remove ? '/delete' : ''), {
    data: data
  }).catch(function (error) {
    logCallingError({
      errorMessage: 'Error updating associated records to engagement.',
      extraData: {
        error: error,
        updatedAssociations: updatedAssociations,
        associationsFromContext: associationsFromContext
      }
    });
    return {
      failures: data.map(function (association) {
        return {
          association: association,
          failReason: 'API_FAILURE'
        };
      })
    };
  }).then(function (response) {
    if (!response) {
      return {
        failures: []
      };
    }

    var failures = [];

    if (response.failures) {
      failures = response.failures;
    } else if (response.createFailures) {
      failures = response.createFailures;
    }

    return {
      failures: failures.map(function (failure) {
        var association = failure.association,
            failReason = failure.failReason;
        var objectTypeData = updatedAssociations.find(function (value) {
          var associationCategory = value.get('associationCategory');
          var associationTypeId = value.get('associationTypeId');
          var hasOptionRecord = !!value.getIn(['associationOptionRecords', "" + association.toObjectId]);
          return associationCategory === association.associationCategory && associationTypeId === association.associationTypeId && hasOptionRecord;
        });
        return {
          deleted: remove,
          failReason: failReason,
          objectId: association.toObjectId,
          objectTypeId: objectTypeData && objectTypeData.get('toObjectTypeId')
        };
      })
    };
  });
};

export var updateUASAssociationsAPI = function updateUASAssociationsAPI(_ref3) {
  var updatedAssociations = _ref3.updatedAssociations,
      associationsFromContext = _ref3.associationsFromContext,
      engagementId = _ref3.engagementId;
  var associatedRecordTypeUpdates = difference(associationsFromContext, updatedAssociations);
  var additive = [];
  var subtractive = [];
  associatedRecordTypeUpdates.forEach(function (universalAssociationRecord, objectTypeId) {
    var updatedAssociationsByType = updatedAssociations.getIn([objectTypeId, 'associationOptionRecords']);
    var associationsFromContextByType = associationsFromContext.getIn([objectTypeId, 'associationOptionRecords']);
    var updatedRecords = difference(associationsFromContextByType, updatedAssociationsByType);
    updatedRecords.forEach(function (universalAssociationOptionRecord, toObjectId) {
      var updatableAssociation = getUpdatableAssociationsData({
        universalAssociationRecord: universalAssociationRecord,
        engagementId: engagementId,
        toObjectId: toObjectId
      });

      if (universalAssociationOptionRecord.get('isSelected')) {
        additive.push(updatableAssociation);
        return;
      }

      subtractive.push(updatableAssociation);
    });
  });
  var requests = [];
  var defaultResponse = Promise.resolve({
    failures: []
  });
  var additiveRequest = additive.length ? updateAssociations({
    data: additive,
    updatedAssociations: updatedAssociations,
    associationsFromContext: associationsFromContext
  }) : defaultResponse;
  var subtractiveRequest = subtractive.length ? updateAssociations({
    data: subtractive,
    updatedAssociations: updatedAssociations,
    associationsFromContext: associationsFromContext,
    remove: true
  }) : defaultResponse;
  requests.push(additiveRequest);
  requests.push(subtractiveRequest);
  return Promise.all(requests).then(function (responses) {
    var _responses = _slicedToArray(responses, 2),
        additiveResponse = _responses[0],
        subtractiveResponse = _responses[1];

    return {
      createFailures: additiveResponse.failures,
      deleteFailures: subtractiveResponse.failures
    };
  });
};