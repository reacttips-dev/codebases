'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _HiddenProperties;

import { Set as ImmutableSet, fromJS } from 'immutable';
import { COMPANY, CONTACT, DEAL, ENGAGEMENT, TASK, TICKET, VISIT } from 'customer-data-objects/constants/ObjectTypes';
var visitsHiddenProperties = ImmutableSet.of('organization', 'address1', 'address2', 'dnsresolves', 'latitude', 'longitude', 'numcontacts', 'email');
var dealsHiddenProperties = ImmutableSet.of('hs__multi_checkbox', 'hs__mutli_checkbox', 'dealstage.probability');
var contactsHiddenProperties = ImmutableSet.of('associations.company', 'formSubmissions.formId', 'hs__multi_checkbox', 'hs__mutli_checkbox', 'listMemberships.listId', 'ilsListMemberships.listId');
var companiesHiddenProperties = ImmutableSet.of('hs__multi_checkbox', 'hs__mutli_checkbox');
var EMPTY = ImmutableSet();
var HiddenProperties = (_HiddenProperties = {}, _defineProperty(_HiddenProperties, COMPANY, companiesHiddenProperties), _defineProperty(_HiddenProperties, CONTACT, contactsHiddenProperties), _defineProperty(_HiddenProperties, DEAL, dealsHiddenProperties), _defineProperty(_HiddenProperties, ENGAGEMENT, EMPTY), _defineProperty(_HiddenProperties, TASK, EMPTY), _defineProperty(_HiddenProperties, TICKET, EMPTY), _defineProperty(_HiddenProperties, VISIT, visitsHiddenProperties), _HiddenProperties);
export default fromJS(HiddenProperties);