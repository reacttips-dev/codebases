import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _ObjectTypesToIds;

import { COMPANY, CONTACT, CONVERSATION, DEAL, ENGAGEMENT, FEEDBACK_SUBMISSION, FORM, LINE_ITEM, OBJECT_LIST, PRODUCT, QUOTE, QUOTE_MODULE, QUOTE_MODULE_FIELD, QUOTE_TEMPLATE, SEQUENCE_ENROLLMENT, TASK, TICKET } from './ObjectTypes'; // values taken from https://git.hubteam.com/HubSpot/IdentityBase/blob/d231c0fb530b36463ef8bbd5603514799fec6221/src/main/protobuf/contacts.proto#L21-L79

export var CONTACT_TYPE_ID = '0-1';
export var COMPANY_TYPE_ID = '0-2';
export var DEAL_TYPE_ID = '0-3';
export var ENGAGEMENT_TYPE_ID = '0-4';
export var TICKET_TYPE_ID = '0-5';
export var PRODUCT_TYPE_ID = '0-7';
export var LINE_ITEM_TYPE_ID = '0-8';
export var CONVERSATION_TYPE_ID = '0-11';
export var QUOTE_TYPE_ID = '0-14';
export var FORM_TYPE_ID = '0-15';
export var FEEDBACK_SUBMISSION_TYPE_ID = '0-19';
export var ATTRIBUTION_TYPE_ID = '0-20';
export var TASK_TYPE_ID = '0-27';
export var CAMPAIGN_TYPE_ID = '0-35';
export var OBJECT_LIST_TYPE_ID = '0-45';
export var NOTE_TYPE_ID = '0-46';
export var MEETING_EVENT_TYPE_ID = '0-47';
export var CALL_TYPE_ID = '0-48';
export var EMAIL_TYPE_ID = '0-49';
export var INVOICE_TYPE_ID = '0-53';
export var MARKETING_EVENT_TYPE_ID = '0-54';
export var QUOTE_TEMPLATE_TYPE_ID = '0-64';
export var QUOTE_MODULE_TYPE_ID = '0-65';
export var QUOTE_MODULE_FIELD_TYPE_ID = '0-66';
export var SEQUENCE_ENROLLMENT_TYPE_ID = '0-68';
export var SUBSCRIPTION_TYPE_ID = '0-69';
export var ObjectTypesToIds = (_ObjectTypesToIds = {
  ATTRIBUTION: ATTRIBUTION_TYPE_ID
}, _defineProperty(_ObjectTypesToIds, CONTACT, CONTACT_TYPE_ID), _defineProperty(_ObjectTypesToIds, COMPANY, COMPANY_TYPE_ID), _defineProperty(_ObjectTypesToIds, DEAL, DEAL_TYPE_ID), _defineProperty(_ObjectTypesToIds, ENGAGEMENT, ENGAGEMENT_TYPE_ID), _defineProperty(_ObjectTypesToIds, TICKET, TICKET_TYPE_ID), _defineProperty(_ObjectTypesToIds, PRODUCT, PRODUCT_TYPE_ID), _defineProperty(_ObjectTypesToIds, LINE_ITEM, LINE_ITEM_TYPE_ID), _defineProperty(_ObjectTypesToIds, CONVERSATION, CONVERSATION_TYPE_ID), _defineProperty(_ObjectTypesToIds, QUOTE, QUOTE_TYPE_ID), _defineProperty(_ObjectTypesToIds, FORM, FORM_TYPE_ID), _defineProperty(_ObjectTypesToIds, FEEDBACK_SUBMISSION, FEEDBACK_SUBMISSION_TYPE_ID), _defineProperty(_ObjectTypesToIds, TASK, TASK_TYPE_ID), _defineProperty(_ObjectTypesToIds, OBJECT_LIST, OBJECT_LIST_TYPE_ID), _defineProperty(_ObjectTypesToIds, QUOTE_MODULE, QUOTE_MODULE_TYPE_ID), _defineProperty(_ObjectTypesToIds, QUOTE_MODULE_FIELD, QUOTE_MODULE_FIELD_TYPE_ID), _defineProperty(_ObjectTypesToIds, QUOTE_TEMPLATE, QUOTE_TEMPLATE_TYPE_ID), _defineProperty(_ObjectTypesToIds, SEQUENCE_ENROLLMENT, SEQUENCE_ENROLLMENT_TYPE_ID), _ObjectTypesToIds); //
// Object type ids are formatted as "<meta type id>-<inner id>". Meta type id is from a
// known list of meta types and inner type is numeric. The backend also understands
// object type id aliases (DEAL/DEALS/deal/deals) but those are not considered here.
//
// See https://git.hubteam.com/HubSpot/InboundDbMeta/blob/master/InboundDbCore/src/main/java/com/hubspot/inbounddb/base/ObjectTypeId.java
// See git.hubteam.com/HubSpot/InboundDbMeta/blob/master/InboundDbCore/src/main/java/com/hubspot/inbounddb/base/MetaType.java

export var isObjectTypeId = function isObjectTypeId(objectTypeId) {
  return /^\d+-\d+$/.test(objectTypeId);
};

function invert(obj) {
  var map = {};
  Object.keys(obj).forEach(function (key) {
    return map[obj[key]] = key;
  });
  return map;
}

export var ObjectTypeFromIds = invert(ObjectTypesToIds);