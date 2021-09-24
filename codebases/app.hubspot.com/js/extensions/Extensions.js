'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { CALL_TYPE_ID, COMPANY_TYPE_ID, CONTACT_TYPE_ID, DEAL_TYPE_ID, INVOICE_TYPE_ID, MARKETING_EVENT_TYPE_ID, TICKET_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import { Call } from './extensions/Call';
import { Company } from './extensions/Company';
import { Contact } from './extensions/Contact';
import { Deal } from './extensions/Deal';
import { Invoice } from './extensions/Invoice';
import { MarketingEvent } from './extensions/MarketingEvent';
import { Ticket } from './extensions/Ticket';
import invariant from 'react-utils/invariant';
var extensions; // This is written as a function in case we ever need dynamic setup behavior

export var setupExtensions = function setupExtensions() {
  var _extensions;

  extensions = (_extensions = {}, _defineProperty(_extensions, CONTACT_TYPE_ID, Contact), _defineProperty(_extensions, COMPANY_TYPE_ID, Company), _defineProperty(_extensions, DEAL_TYPE_ID, Deal), _defineProperty(_extensions, TICKET_TYPE_ID, Ticket), _defineProperty(_extensions, CALL_TYPE_ID, Call), _defineProperty(_extensions, MARKETING_EVENT_TYPE_ID, MarketingEvent), _defineProperty(_extensions, INVOICE_TYPE_ID, Invoice), _extensions);
};
export var getExtensions = function getExtensions() {
  invariant(extensions, 'getExtensions: Extensions must be initialized before use! Please make sure you are calling setupExtensions before this function.');
  return extensions;
};
export var __clearExtensions_TEST_ONLY = function __clearExtensions_TEST_ONLY() {
  return extensions = undefined;
};