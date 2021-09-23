'use es6';

import { createBatchedReferenceResolver } from '../internals/BatchedReferenceResolverFactory';
import { getReferenceTypeFromProperty } from './getReferenceTypeFromProperty';
import { getReferenceFormatterByObjectAndReferenceType } from '../formatters/getReferenceFormatterByObjectAndReferenceType';
var cache = {};

var createResolver = function createResolver(objectTypeId, referenceType) {
  if (!cache[objectTypeId]) {
    cache[objectTypeId] = {};
  }

  if (!cache[objectTypeId][referenceType]) {
    cache[objectTypeId][referenceType] = createBatchedReferenceResolver({
      objectTypeId: objectTypeId,
      referenceType: referenceType,
      formatReference: getReferenceFormatterByObjectAndReferenceType({
        objectTypeId: objectTypeId,
        referenceType: referenceType
      })
    })();
  }

  return cache[objectTypeId][referenceType];
};
/**
 * Until all CRM property definitions contain the
 * `externalOptionsReferenceType` field, use this function to
 * map properties (given an objectTypeId) to the right resolver.
 *
 * Note: this only works with objectTypeIds with metaTypeId=0.
 * This is because objectTypeId is not the same in PROD and QA
 * for all other metaTypeIds.
 *
 * @param property      CRM property definition object
 * @param objectTypeId  Schemas Object Type ID in the form `metaTypeId-typeId`, i.e. 0-1
 *
 * @returns             The batchedReferenceResolver
 */


export var getPropertyResolver = function getPropertyResolver(_ref) {
  var property = _ref.property,
      objectTypeId = _ref.objectTypeId;
  var referenceType = getReferenceTypeFromProperty(property, objectTypeId);
  return createResolver(objectTypeId, referenceType);
};