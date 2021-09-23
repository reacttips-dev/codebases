'use es6';

import { rewriteObjectPropertiesAsMap } from './rewriteObjectPropertiesAsMap';
import { CONTACT_TYPE_ID, COMPANY_TYPE_ID, DEAL_TYPE_ID, TICKET_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import ContactRecord from 'customer-data-objects/contact/ContactRecord';
import CompanyRecord from 'customer-data-objects/company/CompanyRecord';
import DealRecord from 'customer-data-objects/deal/DealRecord';
import TicketRecord from 'customer-data-objects/ticket/TicketRecord';
import CrmObjectRecord from 'customer-data-objects/crmObject/CrmObjectRecord';
export var makeLegacyObjectRecord = function makeLegacyObjectRecord(objectTypeId, rawObject) {
  var object = rewriteObjectPropertiesAsMap(rawObject);

  switch (objectTypeId) {
    case CONTACT_TYPE_ID:
      {
        return ContactRecord.fromJS(object);
      }

    case COMPANY_TYPE_ID:
      {
        return CompanyRecord.fromJS(object);
      }

    case DEAL_TYPE_ID:
      {
        return DealRecord.fromJS(object);
      }

    case TICKET_TYPE_ID:
      {
        return TicketRecord.fromJS(object);
      }

    default:
      {
        return CrmObjectRecord.fromJS(object);
      }
  }
};