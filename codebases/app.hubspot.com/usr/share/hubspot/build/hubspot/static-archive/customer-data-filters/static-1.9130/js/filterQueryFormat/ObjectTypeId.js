'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _Object$assign, _Object$assign2;

import * as DSAssetFamilies from 'customer-data-filters/filterQueryFormat/DSAssetFamilies/DSAssetFamilies';
import * as ObjectTypes from 'customer-data-objects/constants/ObjectTypes';
import ObjectDefinitionProvider from './objectDefinition/ObjectDefinitionProvider';
var ObjectTypesToIds = Object.assign((_Object$assign = {}, _defineProperty(_Object$assign, ObjectTypes.CONTACT, '0-1'), _defineProperty(_Object$assign, ObjectTypes.COMPANY, '0-2'), _defineProperty(_Object$assign, ObjectTypes.DEAL, '0-3'), _defineProperty(_Object$assign, ObjectTypes.ENGAGEMENT, '0-4'), _defineProperty(_Object$assign, ObjectTypes.TICKET, '0-5'), _defineProperty(_Object$assign, ObjectTypes.PRODUCT, '0-7'), _defineProperty(_Object$assign, ObjectTypes.LINE_ITEM, '0-8'), _defineProperty(_Object$assign, ObjectTypes.QUOTE, '0-14'), _defineProperty(_Object$assign, ObjectTypes.FEEDBACK_SUBMISSION, '0-19'), _Object$assign), ObjectDefinitionProvider.getMapOf('objectType', 'objectTypeId'));
var DSAssetFamiliesToObjectTypeIds = Object.assign((_Object$assign2 = {}, _defineProperty(_Object$assign2, DSAssetFamilies.CONTACT_PROPERTY, '0-1'), _defineProperty(_Object$assign2, DSAssetFamilies.COMPANY_PROPERTY, '0-2'), _defineProperty(_Object$assign2, DSAssetFamilies.DEAL_PROPERTY, '0-3'), _defineProperty(_Object$assign2, DSAssetFamilies.ENGAGEMENT_PROPERTY, '0-4'), _defineProperty(_Object$assign2, DSAssetFamilies.TICKET_PROPERTY, '0-5'), _defineProperty(_Object$assign2, DSAssetFamilies.PRODUCT_PROPERTY, '0-7'), _defineProperty(_Object$assign2, DSAssetFamilies.LINE_ITEM_PROPERTY, '0-8'), _Object$assign2), ObjectDefinitionProvider.getMapOf('objectTypeId', 'objectTypeId'));
export var ObjectTypeIdRegex = /^[0-9][-][0-9]+/;
export var CustomObjectTypeIdRegex = /^2-[0-9]+$/;
export var getObjectTypeIdSupportedFamily = function getObjectTypeIdSupportedFamily(filterFamily) {
  if (Object.prototype.hasOwnProperty.call(ObjectTypesToIds, filterFamily)) {
    return ObjectTypesToIds[filterFamily];
  }

  if (Object.prototype.hasOwnProperty.call(DSAssetFamiliesToObjectTypeIds, filterFamily)) {
    return DSAssetFamiliesToObjectTypeIds[filterFamily];
  }

  return filterFamily;
};