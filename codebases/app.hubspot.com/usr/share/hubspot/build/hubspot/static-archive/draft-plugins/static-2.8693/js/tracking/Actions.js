'use es6';

import { MergeTagTypes } from 'draft-plugins/lib/mergeTagConstants';
export var INCLUDE_LINK_PREVIEW = 'include-link-preview';
export var INSERTED_DOCUMENT = 'inserted-document';
export var INSERTED_CONTACT_TOKEN = 'inserted-contact-token';
export var INSERTED_COMPANY_TOKEN = 'inserted-company-token';
export var INSERTED_DEAL_TOKEN = 'inserted-deal-token';
export var INSERTED_TICKET_TOKEN = 'inserted-ticket-token';
export var INSERTED_SENDER_TOKEN = 'inserted-sender-token';
export var INSERTED_CUSTOM_TOKEN = 'inserted-custom-token';
export var INSERTED_SNIPPET = 'inserted-snippet';
export var INSERTED_SNIPPET_FROM_POPOVER = 'inserted-snippet-from-popover';
export var INSERTED_CONTENT_FROM_POPOVER = 'inserted-content-from-popover';
export var insertedToken = function insertedToken(prefix) {
  switch (prefix) {
    case MergeTagTypes.CONTACT:
      return INSERTED_CONTACT_TOKEN;

    case MergeTagTypes.COMPANY:
      return INSERTED_COMPANY_TOKEN;

    case MergeTagTypes.DEAL:
      return INSERTED_DEAL_TOKEN;

    case MergeTagTypes.TICKET:
      return INSERTED_TICKET_TOKEN;

    case MergeTagTypes.SENDER:
      return INSERTED_SENDER_TOKEN;

    case MergeTagTypes.PLACEHOLDER:
      return INSERTED_CUSTOM_TOKEN;

    default:
      return null;
  }
};