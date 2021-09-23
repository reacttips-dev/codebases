'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _BULK_EDIT_BLOCKLIST;

import { COMPANY_TYPE_ID, CONTACT_TYPE_ID, DEAL_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds'; // Duplicated from https://git.hubteam.com/HubSpot/CRM/blob/44c62cb803abd304b22d0a506273c344229463fa/crm_ui/static/js/config/batchMutatePropertiesBlacklist.js#L3-L31
// These properties are removed from the bulk edit dialog's set of possible properties to edit.

export var BULK_EDIT_BLOCKLIST = (_BULK_EDIT_BLOCKLIST = {}, _defineProperty(_BULK_EDIT_BLOCKLIST, CONTACT_TYPE_ID, ['email', 'firstname', 'lastname', 'phone', 'mobilephone', 'linkedinbio', 'linkedinconnections', 'twitterbio', 'twitterprofilephoto', 'twitterhandle']), _defineProperty(_BULK_EDIT_BLOCKLIST, COMPANY_TYPE_ID, ['name', 'domain', 'website', 'facebook_company_page', 'facebookfans', 'googleplus_page', 'linkedinbio', 'linkedin_company_page', 'twitterbio', 'twitterhandle']), _defineProperty(_BULK_EDIT_BLOCKLIST, DEAL_TYPE_ID, ['dealname']), _BULK_EDIT_BLOCKLIST);