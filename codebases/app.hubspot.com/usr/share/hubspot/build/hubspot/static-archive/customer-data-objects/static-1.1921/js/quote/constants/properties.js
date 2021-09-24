'use es6';

import keyMirror from 'react-utils/keyMirror';
import { OrderedMap, List, Set as ImmutableSet } from 'immutable';
export var INTEGER_PROPERTIES = ImmutableSet(['hs_expiration_date', 'hs_payment_date', 'hs_esign_date', 'hs_createdate', 'hs_lastmodifieddate']);
export var BOOLEAN_PROPERTIES = ImmutableSet(['hs_show_signature_box', 'hs_show_countersignature_box', 'hs_payment_enabled', 'hs_esign_enabled', 'hs_locked']);
export var DEFAULT_QUOTE_ASSOCIATED_OBJECTS = {
  additionalFees: List(),
  lineItems: List(),
  quoteSigners: List(),
  contactSigners: List(),
  userSigners: List(),
  recipientCompany: null,
  recipientContacts: List()
};
export var QUOTE_ASSOCIATIONS = keyMirror({
  QUOTE_TO_DEAL: null,
  QUOTE_TO_LINE_ITEM: null,
  QUOTE_TO_CONTACT: null,
  QUOTE_TO_COMPANY: null,
  QUOTE_TO_QUOTE_TEMPLATE: null
});
export var CONTACT_RECORD_TO_SENDER_CONTACT_MAP = OrderedMap({
  firstname: 'hs_sender_firstname',
  lastname: 'hs_sender_lastname',
  email: 'hs_sender_email',
  jobtitle: 'hs_sender_jobtitle',
  phone: 'hs_sender_phone'
});
export var COMPANY_RECORD_TO_SENDER_COMPANY_MAP = OrderedMap({
  name: 'hs_sender_company_name',
  domain: 'hs_sender_company_domain',
  address: 'hs_sender_company_address',
  address2: 'hs_sender_company_address2',
  city: 'hs_sender_company_city',
  zip: 'hs_sender_company_zip',
  state: 'hs_sender_company_state',
  country: 'hs_sender_company_country',
  imageUrl: 'hs_sender_company_image_url'
});