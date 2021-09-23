'use es6';

import I18n from 'I18n';
import once from 'transmute/once';
import { COMPANY, CONTACT, DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import { Map as ImmutableMap, fromJS } from 'immutable';
var PROPERTIES = {};
PROPERTIES.global = {
  domain: {
    labelI18nKey: 'customCells.domain'
  },
  hs__multi_checkbox: {
    labelI18nKey: '',
    sortable: false,
    order: -Infinity
  },
  hubspot_owner_id: {
    addSubject: true
  },
  hs_analytics_source_data_1: {
    addSubject: true
  },
  hs_analytics_source_data_2: {
    addSubject: true
  },
  hs_analytics_first_touch_converting_campaign: {
    addSubject: true,
    sortable: false
  },
  hs_analytics_last_touch_converting_campaign: {
    addSubject: true,
    sortable: false
  }
};
PROPERTIES[CONTACT] = {
  name: {
    labelI18nKey: 'customCells.name',
    order: -Infinity,
    sortValue: ['lastname', 'firstname', 'email'],
    addSubject: true
  },
  associatedcompanyid: {
    labelI18nKey: 'customCells.associatedCompany',
    sortable: false,
    addSubject: true
  },
  salesforcecampaignids: {
    sortable: false
  }
};
PROPERTIES[COMPANY] = {
  name: {
    labelI18nKey: 'customCells.name',
    order: -Infinity,
    addSubject: true
  }
};
PROPERTIES[DEAL] = {
  amount: {
    addSubject: true
  },
  dealname: {
    labelI18nKey: 'customCells.dealName',
    order: -Infinity,
    addSubject: true
  },
  relatesTo: {
    labelI18nKey: 'customCells.relatesTo',
    sortable: false,
    canDelete: false,
    addSubject: true
  },
  pipeline: {
    labelI18nKey: 'customCells.dealPipeline'
  },
  dealstage: {
    labelI18nKey: 'customCells.dealStage',
    sortValue: ['pipeline', 'dealstage.displayOrder', 'dealstage.label'],
    defaultDirection: 'ascending'
  },
  hs_priority: {
    sortable: true,
    sortValue: 'hs_priority.displayOrder',
    sortType: 'priority'
  }
};
PROPERTIES[TICKET] = {
  subject: {
    order: -Infinity,
    addSubject: true
  },
  relatesToContact: {
    labelI18nKey: 'customCells.relatesToContact',
    sortable: false,
    canDelete: false,
    addSubject: true
  },
  relatesToCompany: {
    labelI18nKey: 'customCells.relatesToCompany',
    sortable: false,
    canDelete: false,
    addSubject: true
  },
  hs_ticket_priority: {
    sortable: true,
    sortValue: 'hs_ticket_priority.displayOrder',
    sortType: 'priority'
  }
};
var getFormattedProperties = once(function () {
  return fromJS(PROPERTIES).map(function (properties) {
    return properties.map(function (property) {
      var labelI18nKey = property.get('labelI18nKey');
      return labelI18nKey ? property.set('label', I18n.text(labelI18nKey)).remove('labelI18nKey') : property;
    });
  });
});
export default {
  get: function get(objectType, name) {
    var formattedProperties = getFormattedProperties();
    var defaultName = formattedProperties.getIn([objectType, name]);
    var globalName = formattedProperties.getIn(['global', name]);
    return defaultName || globalName || ImmutableMap();
  }
};