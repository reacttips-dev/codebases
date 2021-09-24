'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _RECORDS_FOR_OBJECT_T;

import CrmObjectRecord from 'customer-data-objects/crmObject/CrmObjectRecord';
import { CONTACT_TYPE_ID, COMPANY_TYPE_ID, DEAL_TYPE_ID, TICKET_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import CompanyRecord from 'customer-data-objects/company/CompanyRecord';
import ContactRecord from 'customer-data-objects/contact/ContactRecord';
import DealRecord from 'customer-data-objects/deal/DealRecord';
import TicketRecord from 'customer-data-objects/ticket/TicketRecord';
import { List } from 'immutable';
import setIn from 'transmute/setIn'; // IKEA only supports the 4 legacy standard objects in this file. We are explicitly
// omitting prospects/tasks because those objects live in different apps.

var RECORDS_FOR_OBJECT_TYPE_ID = (_RECORDS_FOR_OBJECT_T = {}, _defineProperty(_RECORDS_FOR_OBJECT_T, CONTACT_TYPE_ID, ContactRecord), _defineProperty(_RECORDS_FOR_OBJECT_T, COMPANY_TYPE_ID, CompanyRecord), _defineProperty(_RECORDS_FOR_OBJECT_T, DEAL_TYPE_ID, DealRecord), _defineProperty(_RECORDS_FOR_OBJECT_T, TICKET_TYPE_ID, TicketRecord), _RECORDS_FOR_OBJECT_T);
export var mapCrmSearchResultsToObjectRecords = function mapCrmSearchResultsToObjectRecords(objectTypeId, results) {
  var recordType = RECORDS_FOR_OBJECT_TYPE_ID[objectTypeId] || CrmObjectRecord;
  return List(results.map(function (object) {
    return recordType.fromJS(setIn(recordType._idKey, object.objectId, object));
  }));
};