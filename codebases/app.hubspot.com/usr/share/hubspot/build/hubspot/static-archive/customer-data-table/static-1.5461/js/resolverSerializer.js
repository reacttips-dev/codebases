'use es6';

import { COMPANY, CONTACT, OWNER } from 'customer-data-objects/property/ExternalOptionTypes';
import { DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import { Map as ImmutableMap, fromJS } from 'immutable';
import CompanyRecord from 'customer-data-objects/company/CompanyRecord';
import ContactRecord from 'customer-data-objects/contact/ContactRecord';
import DealRecord from 'customer-data-objects/deal/DealRecord';
import OwnerRecord from 'customer-data-objects/owners/OwnerRecord';
import PropertyValueRecord from 'customer-data-objects/property/PropertyValueRecord';
import TicketRecord from 'customer-data-objects/ticket/TicketRecord';
import get from 'transmute/get';
import toJS from 'transmute/toJS';

var resolverSerializer = function resolverSerializer(ReferenceRecord, objectType) {
  if (!ReferenceRecord) {
    return null;
  }

  var referencedObject = get('referencedObject', ReferenceRecord);

  var formatProperties = function formatProperties(obj) {
    return ImmutableMap(get('properties', obj)).map(function (property) {
      return PropertyValueRecord({
        value: get('value', property),
        timestamp: get('timestamp', property)
      });
    });
  };

  var newRecord = Object.assign({}, toJS(referencedObject), {}, toJS(ReferenceRecord));

  switch (objectType) {
    case COMPANY:
      return CompanyRecord(Object.assign({
        companyId: get('id', ReferenceRecord),
        portalId: get('portal-id', referencedObject),
        properties: formatProperties(referencedObject)
      }, fromJS(newRecord)));

    case CONTACT:
      return ContactRecord(Object.assign({
        vid: get('id', ReferenceRecord),
        portalId: get('portal-id', referencedObject),
        properties: formatProperties(referencedObject)
      }, fromJS(newRecord)));

    case DEAL:
      return DealRecord(Object.assign({
        dealId: get('id', ReferenceRecord),
        portalId: get('portal-id', referencedObject),
        properties: formatProperties(referencedObject)
      }, fromJS(newRecord)));

    case OWNER:
      return OwnerRecord(newRecord);

    case TICKET:
      return TicketRecord(Object.assign({
        objectId: get('id', ReferenceRecord),
        portalId: get('portal-id', referencedObject),
        properties: formatProperties(referencedObject)
      }, fromJS(newRecord)));

    default:
      return null;
  }
};

export default resolverSerializer;