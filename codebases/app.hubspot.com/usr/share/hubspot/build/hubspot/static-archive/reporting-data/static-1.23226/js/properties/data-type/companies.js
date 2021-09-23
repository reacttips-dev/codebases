'use es6';

import { fromJS } from 'immutable';
import prefix from '../../lib/prefix';
import getInboundDbPropertyGroups from '../../retrieve/inboundDb/common/properties';
import { COMPANIES } from '../../constants/dataTypes';
import createPropertiesGetterFromGroups from '../createPropertiesGetterFromGroups';
import countProperty from '../partial/count-property';
import { mergeProperties } from '../mergeProperties';
import companiesModule from '../../dataTypeDefinitions/inboundDb/companies';
import overridePropertyTypes from '../../retrieve/inboundDb/common/overridePropertyTypes';
import { COMPANY } from 'reference-resolvers/constants/ReferenceObjectTypes';
import { DEFAULT_NULL_VALUES } from '../../constants/defaultNullValues';
var translate = prefix('reporting-data.properties.companies');
var translateCommon = prefix('reporting-data.properties.common');
export var getPropertyGroups = function getPropertyGroups() {
  return getInboundDbPropertyGroups(COMPANIES).then(function (groups) {
    return mergeProperties(groups, 'companyinformation', {
      recent_deal_amount: {
        type: 'currency'
      },
      hubspot_team_id: {
        referencedObjectType: 'TEAM'
      },
      hs_parent_company_id: {
        defaultNullValue: DEFAULT_NULL_VALUES.NUMBER,
        reportingOverwrittenNumericType: true,
        externalOptions: true,
        referencedObjectType: COMPANY
      },
      '_inbounddbio.importid_': {
        name: '_inbounddbio.importid_',
        label: translateCommon('inboundDbImport'),
        type: 'enumeration',
        hidden: false,
        blocklistedForAggregation: true
      }
    });
  });
};
export var getProperties = function getProperties() {
  return createPropertiesGetterFromGroups(getPropertyGroups, function (properties) {
    return properties.merge(countProperty(COMPANIES)).merge(fromJS({
      'company-id': {
        name: 'company-id',
        label: translate('company'),
        type: 'enumeration'
      }
    }));
  })().then(overridePropertyTypes(companiesModule.getInboundSpec()));
};