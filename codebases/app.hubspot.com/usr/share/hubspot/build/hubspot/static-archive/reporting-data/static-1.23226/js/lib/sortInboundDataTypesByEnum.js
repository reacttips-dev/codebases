'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _inboundDataTypeEnums;

import * as DataTypes from '../constants/dataTypes'; // https://git.hubteam.com/HubSpot/IdentityBase/blob/master/src/main/protobuf/contacts.proto#L19

var inboundDataTypeEnums = (_inboundDataTypeEnums = {}, _defineProperty(_inboundDataTypeEnums, DataTypes.CONTACTS, 1), _defineProperty(_inboundDataTypeEnums, DataTypes.COMPANIES, 2), _defineProperty(_inboundDataTypeEnums, DataTypes.DEALS, 3), _defineProperty(_inboundDataTypeEnums, DataTypes.ENGAGEMENTS, 4), _defineProperty(_inboundDataTypeEnums, DataTypes.TICKETS, 5), _defineProperty(_inboundDataTypeEnums, DataTypes.PRODUCTS, 7), _defineProperty(_inboundDataTypeEnums, DataTypes.LINE_ITEMS, 8), _defineProperty(_inboundDataTypeEnums, DataTypes.CONVERSATIONS, 11), _defineProperty(_inboundDataTypeEnums, DataTypes.QUOTAS, 16), _defineProperty(_inboundDataTypeEnums, DataTypes.FEEDBACK_SUBMISSIONS, 19), _inboundDataTypeEnums); // HACK we need to identify firstObjectId vs secondObjectId for cross-object
// TODO have back end add something like `primaryObjectId` and `secondaryObjectId`
// so we don't have to do this

var sortInboundDataTypesByEnum = function sortInboundDataTypesByEnum(dataTypes) {
  return dataTypes.sortBy(function (dataType) {
    return inboundDataTypeEnums[dataType];
  });
};

export default sortInboundDataTypesByEnum;