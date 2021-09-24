'use es6';

import dispatcher from 'dispatcher/dispatcher';
import { Map as ImmutableMap, List, Set as ImmutableSet, fromJS, Iterable } from 'immutable';
import { ASSOCIATIONS } from '../actions/ActionNamespaces';
import { OBJECT_ASSOCIATION_SUCCEEDED, OBJECT_DISASSOCIATION_SUCCEEDED, QUOTES_CREATE_SUCCEEDED } from 'crm_data/actions/ActionTypes';
import { DEAL } from 'customer-data-objects/constants/ObjectTypes';
import { defineLazyKeyStore, registerLazyKeyService } from 'crm_data/store/LazyKeyStore';
import { fetchFirstPage } from './AssociationsFirstPageAPI';
import { getDealId, getQuoteId } from 'customer-data-objects/quote/model/QuoteModel';
import { DEAL_TO_QUOTE } from 'crm_data/associations/AssociationTypes';

function isIterable(ids) {
  return Iterable.isIterable(ids) || Array.isArray(ids);
}

var idTransform = function idTransform(key) {
  if (ImmutableMap.isMap(key)) {
    return key;
  }

  var objectType = key.objectType,
      objectId = key.objectId,
      associationType = key.associationType;
  return ImmutableMap({
    objectType: objectType,
    associationType: associationType,
    objectId: String(objectId)
  });
};

registerLazyKeyService({
  idTransform: idTransform,
  namespace: ASSOCIATIONS,
  fetch: fetchFirstPage
});
export default defineLazyKeyStore({
  idTransform: idTransform,
  namespace: ASSOCIATIONS,
  idIsValid: function idIsValid(key) {
    if (!key) {
      return false;
    }

    var objectType = key.objectType,
        objectId = key.objectId;
    return objectType && objectId;
  }
}).defineName('AssociationsStore').defineResponseTo(QUOTES_CREATE_SUCCEEDED, function (state, newQuote) {
  if (!newQuote) {
    return state;
  }

  var dealId = getDealId(newQuote);
  var key = idTransform({
    objectType: DEAL,
    objectId: dealId,
    associationType: DEAL_TO_QUOTE
  });

  if (!state.has(key)) {
    // if deal isn't in the store, it isn't being viewed,
    // so don't unnecessarily fetch it
    return state;
  }

  return state.updateIn([key, 'results'], function () {
    var associatedQuotes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : List();
    return associatedQuotes.concat(getQuoteId(newQuote));
  });
}).defineResponseTo(OBJECT_ASSOCIATION_SUCCEEDED, function (state, _ref) {
  var objectId = _ref.objectId,
      associationsAdded = _ref.associationsAdded,
      fromObjectType = _ref.fromObjectType,
      toObjectType = _ref.toObjectType;
  var stateWithAddedAssociations = state;
  var key = idTransform({
    objectType: fromObjectType,
    objectId: objectId,
    associationType: fromObjectType + "_TO_" + toObjectType
  });

  if (state.has(key)) {
    stateWithAddedAssociations = state.updateIn([key, 'results'], List(), function (ids) {
      return ids.concat(fromJS(associationsAdded));
    });
  } // Update the inverse association if it exists in the state


  return associationsAdded.reduce(function (acc, id) {
    key = idTransform({
      objectType: toObjectType,
      objectId: id,
      associationType: toObjectType + "_TO_" + fromObjectType
    });

    if (!acc.has(key)) {
      return acc;
    }

    return acc.updateIn([key, 'results'], List(), function (ids) {
      return ids.concat(fromJS([+objectId]));
    });
  }, stateWithAddedAssociations);
}).defineResponseTo(OBJECT_DISASSOCIATION_SUCCEEDED, function (state, _ref2) {
  var objectId = _ref2.objectId,
      associationsRemoved = _ref2.associationsRemoved,
      fromObjectType = _ref2.fromObjectType,
      toObjectType = _ref2.toObjectType;
  var stateWithRemovedAssociations = state;
  var key = idTransform({
    objectType: fromObjectType,
    objectId: objectId,
    associationType: fromObjectType + "_TO_" + toObjectType
  });
  var associationsRemovedIterable = isIterable(associationsRemoved) ? associationsRemoved : [associationsRemoved];

  if (state.has(key)) {
    stateWithRemovedAssociations = state.updateIn([key, 'results'], function (ids) {
      return ImmutableSet(ids).subtract(associationsRemovedIterable).toList();
    });
  } // Update the inverse association if it exists in the state


  return associationsRemovedIterable.reduce(function (acc, removedAssociationId) {
    key = idTransform({
      objectType: toObjectType,
      objectId: removedAssociationId,
      associationType: toObjectType + "_TO_" + fromObjectType
    });

    if (!acc.has(key)) {
      return acc;
    }

    return acc.updateIn([key, 'results'], function (ids) {
      return ids.filterNot(function (id) {
        return id === +objectId;
      });
    });
  }, stateWithRemovedAssociations);
}).register(dispatcher);