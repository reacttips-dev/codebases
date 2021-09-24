'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { Set as ImmutableSet, List } from 'immutable';
import { dispatchImmediate, dispatchSafe, dispatchQueue } from 'crm_data/dispatch/Dispatch';
import * as ActionTypes from 'crm_data/actions/ActionTypes';
import { create, update, remove } from 'crm_data/lineItems/LineItemsAPI';
import { LINE_ITEM } from 'customer-data-objects/constants/ObjectTypes';
import { getId } from 'customer-data-objects/model/ImmutableModel';
import flattenN from 'transmute/flattenN';
import { chunk } from '../utils/chunk';
export function createLineItems(_ref) {
  var lineItemsToAdd = _ref.lineItemsToAdd,
      associatedObjectId = _ref.associatedObjectId,
      associatedObjectType = _ref.associatedObjectType;
  dispatchSafe(ActionTypes.LINE_ITEMS_CREATE_STARTED);
  var chunks = chunk(lineItemsToAdd, 100);
  return Promise.all(chunks.map(function (lineItems) {
    return create(lineItems, associatedObjectId, associatedObjectType);
  })).then(function (lineItemsAddedChunks) {
    var lineItemsAdded = flattenN(1, List(lineItemsAddedChunks));
    dispatchImmediate(ActionTypes.LINE_ITEMS_CREATE_SUCCEEDED, lineItemsAdded);
    var lineItemIdsToAdd = lineItemsAdded.map(function (lineItem) {
      return getId(lineItem);
    });
    dispatchImmediate(ActionTypes.OBJECT_ASSOCIATION_SUCCEEDED, {
      objectId: associatedObjectId,
      associationsAdded: lineItemIdsToAdd,
      fromObjectType: associatedObjectType,
      toObjectType: LINE_ITEM
    });
    return lineItemsAdded;
  }).catch(function (error) {
    dispatchImmediate(ActionTypes.LINE_ITEMS_CREATE_FAILED);
    throw error;
  });
}
export function removeLineItems(_ref2) {
  var lineItemsToRemove = _ref2.lineItemsToRemove,
      associatedObjectId = _ref2.associatedObjectId,
      associatedObjectType = _ref2.associatedObjectType;
  dispatchSafe(ActionTypes.LINE_ITEMS_DELETE_STARTED);
  var chunks = chunk(lineItemsToRemove, 100);
  return Promise.all(chunks.map(remove)).then(function () {
    dispatchImmediate(ActionTypes.LINE_ITEMS_DELETE_SUCCEEDED, lineItemsToRemove);
    dispatchImmediate(ActionTypes.OBJECT_DISASSOCIATION_SUCCEEDED, {
      objectId: associatedObjectId,
      associationsRemoved: lineItemsToRemove,
      fromObjectType: associatedObjectType,
      toObjectType: LINE_ITEM
    });
    return lineItemsToRemove;
  }).catch(function (error) {
    dispatchImmediate(ActionTypes.LINE_ITEMS_DELETE_FAILED);
    throw error;
  });
}
export function updateLineItems(_ref3) {
  var lineItemsToUpdate = _ref3.lineItemsToUpdate,
      associatedObjectId = _ref3.associatedObjectId,
      associatedObjectType = _ref3.associatedObjectType;
  dispatchSafe(ActionTypes.LINE_ITEMS_UPDATE_STARTED);
  var chunks = chunk(lineItemsToUpdate, 100);
  return Promise.all(chunks.map(function (lineItems) {
    return update(lineItems, associatedObjectId, associatedObjectType);
  })).then(function (lineItemsUpdatedChunks) {
    var lineItemsUpdated = flattenN(1, List(lineItemsUpdatedChunks));
    dispatchImmediate(ActionTypes.LINE_ITEMS_UPDATE_SUCCEEDED, lineItemsUpdated);
    return lineItemsUpdated;
  }).catch(function (error) {
    dispatchImmediate(ActionTypes.LINE_ITEMS_UPDATE_FAILED);
    throw error;
  });
}
export function saveChanges(_ref4) {
  var associatedObjectType = _ref4.associatedObjectType,
      associatedObjectId = _ref4.associatedObjectId,
      lineItemsToAdd = _ref4.lineItemsToAdd,
      lineItemsToRemove = _ref4.lineItemsToRemove,
      lineItemsToUpdate = _ref4.lineItemsToUpdate;
  dispatchSafe(ActionTypes.LINE_ITEMS_BULK_UPDATE_STARTED);
  return Promise.all([createLineItems({
    lineItemsToAdd: lineItemsToAdd,
    associatedObjectId: associatedObjectId,
    associatedObjectType: associatedObjectType
  }), removeLineItems({
    lineItemsToRemove: lineItemsToRemove,
    associatedObjectId: associatedObjectId,
    associatedObjectType: associatedObjectType
  }), updateLineItems({
    lineItemsToUpdate: lineItemsToUpdate,
    associatedObjectId: associatedObjectId,
    associatedObjectType: associatedObjectType
  })]).then(function (_ref5) {
    var _ref6 = _slicedToArray(_ref5, 3),
        lineItemsAdded = _ref6[0],
        __lineItemsRemoved = _ref6[1],
        lineItemsUpdated = _ref6[2];

    var response = {
      associatedObjectType: associatedObjectType,
      associatedObjectId: associatedObjectId,
      lineItemsAdded: lineItemsAdded,
      lineItemsRemoved: lineItemsToRemove,
      lineItemsUpdated: lineItemsUpdated
    };
    dispatchImmediate(ActionTypes.LINE_ITEMS_BULK_UPDATE_SUCCEEDED, response);
    return response;
  }).catch(function (error) {
    dispatchImmediate(ActionTypes.LINE_ITEMS_BULK_UPDATE_FAILED);
    throw error;
  });
} // id transform required for manual dispatch to match definePooledObjectStore getter transform

export function refresh(lineItemIds) {
  dispatchQueue(ActionTypes.LINE_ITEMS_REFRESH_QUEUED, ImmutableSet(lineItemIds.map(function (id) {
    return "" + id;
  })));
}