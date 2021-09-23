'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _idProperties, _defaultProperties, _associationPropertie, _unknownMessages, _unnamedMessages;

import I18n from 'I18n';
import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import * as dataTypes from '../../constants/dataTypes';
import { has } from '../../lib/has';
import { InboundDbModule } from '../../module';
import { hydrateFn as contactHydrateFn } from '../../references/contact/hydrate';
import { getExtractors as getAssociationExtractors } from '../../retrieve/inboundDb/common/association-extractors';
import { engagementExtractors } from '../../retrieve/inboundDb/common/engagement-crmsearch-extractors';
import { dataTypeToEngagementType } from '../../retrieve/inboundDb/common/engagement-types';
import Spec from '../../retrieve/inboundDb/common/specs/Spec';
var idProperties = (_idProperties = {}, _defineProperty(_idProperties, dataTypes.CONTACTS, 'vid'), _defineProperty(_idProperties, dataTypes.COMPANIES, 'company-id'), _defineProperty(_idProperties, dataTypes.DEALS, 'dealId'), _defineProperty(_idProperties, dataTypes.ENGAGEMENT, 'engagement.id'), _defineProperty(_idProperties, dataTypes.TICKETS, 'hs_ticket_id'), _defineProperty(_idProperties, dataTypes.FEEDBACK_SUBMISSIONS, 'hs_object_id'), _idProperties);
var defaultProperties = (_defaultProperties = {}, _defineProperty(_defaultProperties, dataTypes.CONTACTS, ['firstname', 'lastname', 'email']), _defineProperty(_defaultProperties, dataTypes.COMPANIES, ['name']), _defineProperty(_defaultProperties, dataTypes.DEALS, ['dealname', 'deal_currency_code']), _defineProperty(_defaultProperties, dataTypes.LINE_ITEMS, ['objectId', 'hs_line_item_currency_code']), _defineProperty(_defaultProperties, dataTypes.ENGAGEMENT, ['title']), _defineProperty(_defaultProperties, dataTypes.TICKETS, ['subject']), _defaultProperties);
var associationProperties = (_associationPropertie = {}, _defineProperty(_associationPropertie, dataTypes.CONTACTS, {
  associatedcompanyid: {
    CONTACT_TO_COMPANY: {
      properties: defaultProperties[dataTypes.COMPANIES]
    }
  }
}), _defineProperty(_associationPropertie, dataTypes.DEALS, {
  'associations.contact': {
    CONTACT: {
      properties: defaultProperties[dataTypes.CONTACTS]
    }
  },
  'associations.company': {
    COMPANY: {
      properties: defaultProperties[dataTypes.COMPANIES]
    }
  }
}), _defineProperty(_associationPropertie, dataTypes.ENGAGEMENT, {
  'associations.contact': {
    CONTACT: {
      properties: defaultProperties[dataTypes.CONTACTS]
    }
  },
  'associations.company': {
    COMPANY: {
      properties: defaultProperties[dataTypes.COMPANIES]
    }
  },
  'associations.deal': {
    DEAL: {
      properties: defaultProperties[dataTypes.DEALS]
    }
  },
  'associations.ticket': {
    TICKET: {
      properties: defaultProperties[dataTypes.TICKETS]
    }
  }
}), _associationPropertie);
var unknownMessages = (_unknownMessages = {}, _defineProperty(_unknownMessages, dataTypes.CONTACTS, 'reporting-data.references.contact.unknown'), _defineProperty(_unknownMessages, dataTypes.COMPANIES, 'reporting-data.references.company.unknown'), _defineProperty(_unknownMessages, dataTypes.DEALS, 'reporting-data.references.deal.unknown'), _defineProperty(_unknownMessages, dataTypes.ENGAGEMENT, 'reporting-data.references.activity.unknown'), _defineProperty(_unknownMessages, dataTypes.TICKETS, 'reporting-data.references.ticket.unknown'), _defineProperty(_unknownMessages, dataTypes.LINE_ITEMS, 'reporting-data.references.line-item.unknown'), _unknownMessages);
var unnamedMessages = (_unnamedMessages = {}, _defineProperty(_unnamedMessages, dataTypes.COMPANIES, 'reporting-data.references.company.unnamed'), _defineProperty(_unnamedMessages, dataTypes.ENGAGEMENT, 'reporting-data.references.activity.untitled'), _unnamedMessages);

var hydrateFn = function hydrateFn(obj, dataType, idProperty, defaultProps, id) {
  if (dataType === dataTypes.CONTACTS) {
    return contactHydrateFn(obj);
  }

  var hydrationProperty = defaultProps && defaultProps[0];

  if (obj && hydrationProperty && has(obj, hydrationProperty)) {
    return obj[hydrationProperty];
  }

  if (obj && hydrationProperty && !obj[hydrationProperty] && unnamedMessages[dataType]) {
    return I18n.text(unnamedMessages[dataType], {
      id: obj[idProperty]
    });
  }

  if (has(unknownMessages, dataType)) {
    return I18n.text(unknownMessages[dataType], {
      id: obj[idProperty] || id
    });
  }

  return obj[idProperty];
};

var getAssociationPreviews = function getAssociationPreviews(dataType, properties) {
  return ImmutableMap(properties.reduce(function (memo, property) {
    return Object.assign({}, memo, {}, associationProperties[dataType] && associationProperties[dataType][property] || {});
  }, {}));
};

var getInboundSpec = function getInboundSpec(config) {
  var dataType = config.get('dataType');
  var objectTypeId = dataTypeToEngagementType.has(dataType) ? dataTypes.ENGAGEMENT : dataType;
  var idProperty = idProperties[objectTypeId] || 'objectId';
  var defaultProps = defaultProperties[dataType] || [];
  var properties = config.get('metrics').map(function (metric) {
    return metric.get('property');
  }).toSet().union(defaultProps).toList();
  var extractors = Object.assign({}, objectTypeId === dataTypes.ENGAGEMENT ? engagementExtractors : {}, {}, getAssociationExtractors(objectTypeId));
  var associationPreviews = getAssociationPreviews(objectTypeId, properties);
  return new Spec({
    dataType: dataType,
    objectTypeId: objectTypeId,
    search: {
      url: 'crm-search/search/beta',
      objectsField: 'results',
      properties: properties
    },
    properties: {
      idProperty: idProperty,
      responsePaths: _defineProperty({}, idProperty, ['objectId']),
      extractors: extractors
    },
    associationPreviews: associationPreviews,
    hydrate: {
      inputs: ImmutableSet([idProperty].concat(_toConsumableArray(defaultProps))),
      fn: function fn(obj, id) {
        return hydrateFn(obj, dataType, idProperty, defaultProps, id);
      }
    }
  });
};

export default InboundDbModule({
  getInboundSpec: getInboundSpec
});