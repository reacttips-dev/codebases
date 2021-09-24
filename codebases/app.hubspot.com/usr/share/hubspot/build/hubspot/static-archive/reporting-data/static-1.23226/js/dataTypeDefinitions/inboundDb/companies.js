'use es6';

import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import I18n from 'I18n';
import { InboundDbModule } from '../../module';
import { COMPANIES, CONTACTS } from '../../constants/dataTypes';
import { hydrate as _hydrate } from '../../retrieve/inboundDb/dynamicHydrate';
import { adapt } from '../../references/adapt';
import ownerReferences from '../../references/owner';
import teamReferences from '../../references/team';
import companyReferences from '../../references/company';
import Spec from '../../retrieve/inboundDb/common/specs/Spec';
var idProperty = 'companyId';

var getInboundSpec = function getInboundSpec() {
  return new Spec({
    dataType: COMPANIES,
    search: {
      url: 'contacts/search/v1/search/companies',
      objectsField: 'companies'
    },
    properties: {
      idProperty: idProperty,
      responsePaths: {
        companyId: ['company-id']
      }
    },
    hydrate: {
      inputs: ImmutableSet([idProperty, 'name']),
      fn: function fn(obj, id) {
        if (!obj) {
          return I18n.text('reporting-data.references.company.unknown', {
            id: id
          });
        }

        return !obj.name ? I18n.text('reporting-data.references.company.unnamed', {
          id: obj[idProperty]
        }) : obj.name;
      }
    }
  });
};

export default InboundDbModule({
  dataType: COMPANIES,
  references: ImmutableMap({
    hubspot_owner_id: adapt(ownerReferences),
    hubspot_team_id: adapt(teamReferences),
    hs_parent_company_id: adapt(companyReferences)
  }),
  referenceProperties: ImmutableMap({
    'associations.company': COMPANIES,
    'associations.contact': CONTACTS,
    companyId: COMPANIES
  }),
  hydrate: function hydrate(ids, config) {
    return _hydrate(COMPANIES, ids, config);
  },
  getInboundSpec: getInboundSpec
});