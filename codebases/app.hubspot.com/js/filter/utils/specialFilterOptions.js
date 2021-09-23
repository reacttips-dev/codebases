'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { List } from 'immutable';
import { getAllClosedOption } from 'customer-data-objects/ticket/TicketStageIdOptions';
import { getAllClosedWonOption } from 'customer-data-objects/deal/DealStageIdOptions';
import { getMeOption } from 'customer-data-objects/owners/OwnerIdOptions';
import once from 'transmute/once';
import { OWNER, DEAL_PIPELINE_STAGE, TICKET_STAGE } from 'reference-resolvers/constants/ReferenceObjectTypes';
export var getSpecialOptionsByReferenceType = once(function () {
  var _ref;

  return _ref = {}, _defineProperty(_ref, OWNER, function () {
    return List.of(getMeOption());
  }), _defineProperty(_ref, DEAL_PIPELINE_STAGE, function () {
    return List.of(getAllClosedWonOption());
  }), _defineProperty(_ref, TICKET_STAGE, function () {
    return List.of(getAllClosedOption());
  }), _ref;
});