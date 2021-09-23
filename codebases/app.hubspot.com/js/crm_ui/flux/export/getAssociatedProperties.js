'use es6';

import { CONTACT, COMPANY, DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
export var getAssociatedProperties = function getAssociatedProperties(objectType) {
  if (objectType === CONTACT || objectType === COMPANY) {
    return ['hs_associated_company_id', 'hs_associated_company'];
  } else if (objectType === DEAL) {
    return ['hs_associated_company_id', 'hs_associated_company', 'hs_associated_contact_ids', 'hs_associated_contacts'];
  } else if (objectType === TICKET) {
    return ['hs_associated_company_id', 'hs_associated_company', 'hs_associated_contact_ids', 'hs_associated_contacts', 'hs_associated_deal_ids', 'hs_associated_deals'];
  }

  return [];
};