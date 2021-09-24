'use es6';

import { Map as ImmutableMap, List } from 'immutable';
import I18n from 'I18n';
import formatName from 'I18n/utils/formatName';
import * as DataType from '../../../constants/dataTypes';

var associatedContactsExtractor = function associatedContactsExtractor(associationName) {
  return function (object) {
    var associations = object.getIn(['associatedObjects', associationName], List());
    return ImmutableMap({
      raw: associations.map(function (association) {
        return association.get('objectId');
      }),
      formatted: associations.map(function (association) {
        return formatName({
          firstName: association.getIn(['properties', 'firstname', 'value']),
          lastName: association.getIn(['properties', 'lastname', 'value']),
          email: association.getIn(['properties', 'email', 'value'])
        }) || I18n.text('reporting-data.references.contact.unknown', {
          id: association.get('objectId')
        });
      }),
      label: I18n.text('reporting-data.properties.common.associatedContacts')
    });
  };
};

var associatedCompaniesExtractor = function associatedCompaniesExtractor(associationName) {
  return function (object) {
    var associations = object.getIn(['associatedObjects', associationName], List());
    return ImmutableMap({
      raw: associations.map(function (association) {
        return association.get('objectId');
      }),
      formatted: associations.map(function (association) {
        return association.getIn(['properties', 'name', 'value']) || I18n.text('reporting-data.references.company.unknown', {
          id: association.get('objectId')
        });
      }),
      label: I18n.text('reporting-data.properties.common.associatedCompanies')
    });
  };
};

var associatedDealsExtractor = function associatedDealsExtractor(associationName) {
  return function (object) {
    var associations = object.getIn(['associatedObjects', associationName], List());
    return ImmutableMap({
      raw: associations.map(function (association) {
        return association.get('objectId');
      }),
      formatted: associations.map(function (association) {
        return association.getIn(['properties', 'dealname', 'value']) || I18n.text('reporting-data.references.deal.unknown');
      }),
      label: I18n.text('reporting-data.properties.common.associatedDeals')
    });
  };
};

var associatedTicketsExtractor = function associatedTicketsExtractor(associationName) {
  return function (object) {
    var associations = object.getIn(['associatedObjects', associationName], List());
    return ImmutableMap({
      raw: associations.map(function (association) {
        return association.get('objectId');
      }),
      formatted: associations.map(function (association) {
        return association.getIn(['properties', 'subject', 'value']) || I18n.text('reporting-data.references.ticket.unknown');
      }),
      label: I18n.text('reporting-data.properties.common.associatedTickets')
    });
  };
};

export var getExtractors = function getExtractors(dataType) {
  if (dataType === DataType.CONTACTS) {
    return {
      associatedcompanyid: associatedCompaniesExtractor('CONTACT_TO_COMPANY')
    };
  }

  if (dataType === DataType.DEALS || dataType === DataType.ENGAGEMENT) {
    return {
      'associations.contact': associatedContactsExtractor('CONTACT'),
      'associations.company': associatedCompaniesExtractor('COMPANY'),
      'associations.deal': associatedDealsExtractor('DEAL'),
      'associations.ticket': associatedTicketsExtractor('TICKET')
    };
  }

  return {};
};