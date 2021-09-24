'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _CONTACT, _COMPANY, _TICKET, _DEAL, _UNLABELED_ASSOCIATIO, _COMPANY2, _PRIMARY_ASSOCIATION_;

import { COMPANY, CONTACT, DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import { Set as ImmutableSet } from 'immutable';
export var HUBSPOT_DEFINED_ASSOCIATION_CATEGORY = 'HUBSPOT_DEFINED';
export var CONTACT_TO_COMPANY_UNLABELED_ASSOCIATION_ID = 279;
export var CONTACT_TO_COMPANY_PRIMARY_ASSOCIATION_ID = 1;
export var COMPANY_TO_CONTACT_UNLABELED_ASSOCIATION_ID = 280;
export var COMPANY_TO_CONTACT_PRIMARY_ASSOCIATION_ID = 2;
export var COMPANY_CONTACT_ASSOCIATIONS = ImmutableSet.of(CONTACT_TO_COMPANY_UNLABELED_ASSOCIATION_ID, CONTACT_TO_COMPANY_PRIMARY_ASSOCIATION_ID, COMPANY_TO_CONTACT_UNLABELED_ASSOCIATION_ID, COMPANY_TO_CONTACT_PRIMARY_ASSOCIATION_ID);
export var LEGACY_COMPANY_TO_DEAL_PRIMARY_ASSOCIATION_ID = 272;
export var LEGACY_DEAL_TO_COMPANY_PRIMARY_ASSOCIATION_ID = 271; //These are the new primary associationTypeIds and eventually 271 and 272 will be deprecated.
//For now the new ones were backfilled which means that both are returned when ungated for flexible-associations so we need to block both.

export var DEAL_TO_COMPANY_UNLABELED_ASSOCIATION_ID = 341;
export var DEAL_TO_COMPANY_PRIMARY_ASSOCIATION_ID = 5;
export var COMPANY_TO_DEAL_UNLABELED_ASSOCIATION_ID = 342;
export var COMPANY_TO_DEAL_PRIMARY_ASSOCIATION_ID = 6;
export var COMPANY_DEAL_ASSOCIATIONS = ImmutableSet.of(DEAL_TO_COMPANY_UNLABELED_ASSOCIATION_ID, LEGACY_DEAL_TO_COMPANY_PRIMARY_ASSOCIATION_ID, DEAL_TO_COMPANY_PRIMARY_ASSOCIATION_ID, COMPANY_TO_DEAL_UNLABELED_ASSOCIATION_ID, LEGACY_COMPANY_TO_DEAL_PRIMARY_ASSOCIATION_ID, COMPANY_TO_DEAL_PRIMARY_ASSOCIATION_ID);
export var LEGACY_COMPANY_TO_TICKET_PRIMARY_ASSOCIATION_ID = 274;
export var LEGACY_TICKET_TO_COMPANY_PRIMARY_ASSOCIATION_ID = 273;
export var TICKET_TO_COMPANY_UNLABELED_ASSOCIATION_ID = 339;
export var TICKET_TO_COMPANY_PRIMARY_ASSOCIATION_ID = 26;
export var COMPANY_TO_TICKET_UNLABELED_ASSOCIATION_ID = 340;
export var COMPANY_TO_TICKET_PRIMARY_ASSOCIATION_ID = 25;
export var COMPANY_TICKET_ASSOCIATIONS = ImmutableSet.of(TICKET_TO_COMPANY_UNLABELED_ASSOCIATION_ID, LEGACY_TICKET_TO_COMPANY_PRIMARY_ASSOCIATION_ID, TICKET_TO_COMPANY_PRIMARY_ASSOCIATION_ID, COMPANY_TO_TICKET_UNLABELED_ASSOCIATION_ID, LEGACY_COMPANY_TO_TICKET_PRIMARY_ASSOCIATION_ID, COMPANY_TO_TICKET_PRIMARY_ASSOCIATION_ID);
export var TICKET_TO_CONTACT_UNLABELED_ASSOCIATION_ID = 16;
export var CONTACT_TO_TICKET_UNLABELED_ASSOCIATION_ID = 15;
export var CONTACT_TICKET_ASSOCIATIONS = ImmutableSet.of(TICKET_TO_CONTACT_UNLABELED_ASSOCIATION_ID, CONTACT_TO_TICKET_UNLABELED_ASSOCIATION_ID);
export var DEAL_TO_CONTACT_UNLABELED_ASSOCIATION_ID = 3;
export var CONTACT_TO_DEAL_UNLABELED_ASSOCIATION_ID = 4;
export var CONTACT_DEAL_ASSOCIATIONS = ImmutableSet.of(DEAL_TO_CONTACT_UNLABELED_ASSOCIATION_ID, CONTACT_TO_DEAL_UNLABELED_ASSOCIATION_ID);
export var TICKET_TO_DEAL_UNLABELED_ASSOCIATION_ID = 28;
export var DEAL_TO_TICKET_UNLABELED_ASSOCIATION_ID = 27;
export var DEAL_TICKET_ASSOCIATIONS = ImmutableSet.of(TICKET_TO_DEAL_UNLABELED_ASSOCIATION_ID, DEAL_TO_TICKET_UNLABELED_ASSOCIATION_ID);
export var UNLABELED_ASSOCIATION_BY_OBJECT_TYPES = (_UNLABELED_ASSOCIATIO = {}, _defineProperty(_UNLABELED_ASSOCIATIO, CONTACT, (_CONTACT = {}, _defineProperty(_CONTACT, COMPANY, CONTACT_TO_COMPANY_UNLABELED_ASSOCIATION_ID), _defineProperty(_CONTACT, DEAL, CONTACT_TO_DEAL_UNLABELED_ASSOCIATION_ID), _defineProperty(_CONTACT, TICKET, CONTACT_TO_TICKET_UNLABELED_ASSOCIATION_ID), _CONTACT)), _defineProperty(_UNLABELED_ASSOCIATIO, COMPANY, (_COMPANY = {}, _defineProperty(_COMPANY, CONTACT, COMPANY_TO_CONTACT_UNLABELED_ASSOCIATION_ID), _defineProperty(_COMPANY, TICKET, COMPANY_TO_TICKET_UNLABELED_ASSOCIATION_ID), _defineProperty(_COMPANY, DEAL, COMPANY_TO_DEAL_UNLABELED_ASSOCIATION_ID), _COMPANY)), _defineProperty(_UNLABELED_ASSOCIATIO, TICKET, (_TICKET = {}, _defineProperty(_TICKET, COMPANY, TICKET_TO_COMPANY_UNLABELED_ASSOCIATION_ID), _defineProperty(_TICKET, CONTACT, TICKET_TO_CONTACT_UNLABELED_ASSOCIATION_ID), _defineProperty(_TICKET, DEAL, TICKET_TO_DEAL_UNLABELED_ASSOCIATION_ID), _TICKET)), _defineProperty(_UNLABELED_ASSOCIATIO, DEAL, (_DEAL = {}, _defineProperty(_DEAL, COMPANY, DEAL_TO_COMPANY_UNLABELED_ASSOCIATION_ID), _defineProperty(_DEAL, CONTACT, DEAL_TO_CONTACT_UNLABELED_ASSOCIATION_ID), _defineProperty(_DEAL, TICKET, DEAL_TO_TICKET_UNLABELED_ASSOCIATION_ID), _DEAL)), _UNLABELED_ASSOCIATIO);
export var PRIMARY_ASSOCIATION_BY_OBJECT_TYPES = (_PRIMARY_ASSOCIATION_ = {}, _defineProperty(_PRIMARY_ASSOCIATION_, CONTACT, _defineProperty({}, COMPANY, CONTACT_TO_COMPANY_PRIMARY_ASSOCIATION_ID)), _defineProperty(_PRIMARY_ASSOCIATION_, COMPANY, (_COMPANY2 = {}, _defineProperty(_COMPANY2, CONTACT, COMPANY_TO_CONTACT_PRIMARY_ASSOCIATION_ID), _defineProperty(_COMPANY2, TICKET, COMPANY_TO_TICKET_PRIMARY_ASSOCIATION_ID), _defineProperty(_COMPANY2, DEAL, COMPANY_TO_DEAL_PRIMARY_ASSOCIATION_ID), _COMPANY2)), _defineProperty(_PRIMARY_ASSOCIATION_, TICKET, _defineProperty({}, COMPANY, TICKET_TO_COMPANY_PRIMARY_ASSOCIATION_ID)), _defineProperty(_PRIMARY_ASSOCIATION_, DEAL, _defineProperty({}, COMPANY, DEAL_TO_COMPANY_PRIMARY_ASSOCIATION_ID)), _PRIMARY_ASSOCIATION_);
export var LABEL_ID_TO_TRANSLATION_KEY = {
  33: 'sidebar.associateObjectDialog.associateTab.associationLabels.advisor',
  // some translations are repeated because inverse associations often
  // use the same label
  34: 'sidebar.associateObjectDialog.associateTab.associationLabels.advisor',
  35: 'sidebar.associateObjectDialog.associateTab.associationLabels.boardMember',
  36: 'sidebar.associateObjectDialog.associateTab.associationLabels.boardMember',
  37: 'sidebar.associateObjectDialog.associateTab.associationLabels.contractor',
  38: 'sidebar.associateObjectDialog.associateTab.associationLabels.contractor',
  39: 'sidebar.associateObjectDialog.associateTab.associationLabels.manager',
  40: 'sidebar.associateObjectDialog.associateTab.associationLabels.manager',
  41: 'sidebar.associateObjectDialog.associateTab.associationLabels.owner',
  42: 'sidebar.associateObjectDialog.associateTab.associationLabels.owner',
  43: 'sidebar.associateObjectDialog.associateTab.associationLabels.partner',
  44: 'sidebar.associateObjectDialog.associateTab.associationLabels.partner',
  45: 'sidebar.associateObjectDialog.associateTab.associationLabels.reseller',
  46: 'sidebar.associateObjectDialog.associateTab.associationLabels.reseller'
}; // association labels that are meant to be hidden from selects, either because
// they're the "primary" association and have special business logic, or they're
// the "unlabelled" association and used when no other labels are applied

export var ASSOCIATION_LABEL_SELECT_BLOCKLIST = [].concat(_toConsumableArray(COMPANY_CONTACT_ASSOCIATIONS.toJS()), _toConsumableArray(COMPANY_DEAL_ASSOCIATIONS.toJS()), _toConsumableArray(COMPANY_TICKET_ASSOCIATIONS.toJS()), _toConsumableArray(CONTACT_TICKET_ASSOCIATIONS.toJS()), _toConsumableArray(CONTACT_DEAL_ASSOCIATIONS.toJS()), _toConsumableArray(DEAL_TICKET_ASSOCIATIONS.toJS()));
export var PRIMARY_ASSOCIATION_IDS = ImmutableSet.of(CONTACT_TO_COMPANY_PRIMARY_ASSOCIATION_ID, LEGACY_DEAL_TO_COMPANY_PRIMARY_ASSOCIATION_ID, DEAL_TO_COMPANY_PRIMARY_ASSOCIATION_ID, LEGACY_TICKET_TO_COMPANY_PRIMARY_ASSOCIATION_ID, TICKET_TO_COMPANY_PRIMARY_ASSOCIATION_ID);