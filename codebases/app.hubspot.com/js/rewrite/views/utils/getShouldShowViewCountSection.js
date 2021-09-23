'use es6';

import { COMPANY_TYPE_ID, CONTACT_TYPE_ID, DEAL_TYPE_ID, TICKET_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds'; // Only CCDT support view counts because the endpoint we use to
// fetch counts lumps all non-CCDT objects together under "unknown".
// See https://git.hubteam.com/HubSpot/Sales/issues/914 for the work to change this.
// TODO: Remove this function once the views BE redesign is done.

export var getShouldShowViewUsageCountSection = function getShouldShowViewUsageCountSection(objectTypeId, hasBERedesign) {
  return hasBERedesign || [CONTACT_TYPE_ID, COMPANY_TYPE_ID, DEAL_TYPE_ID, TICKET_TYPE_ID].includes(objectTypeId);
};