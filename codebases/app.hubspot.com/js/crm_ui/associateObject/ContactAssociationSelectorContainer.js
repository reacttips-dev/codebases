'use es6';

import { connect } from 'general-store';
import ContactsStore from 'crm_data/contacts/ContactsStore';
import existingAssociationsDependency from './dependencies/existingAssociationsDependency';
import makeElasticSearchUISelectDependency from 'crm_data/elasticSearch/dependencies/makeElasticSearchUISelectDependency';
import makeObjectAssociationSelectorContainer from './ObjectAssociationSelectorContainer';
import makeSelectedObjectsDependency from './dependencies/makeSelectedObjectsDependency';
import { MIN_SEARCH_LENGTH } from 'customer-data-objects/search/ElasticSearchConstants';
import { COMPANY, CONTACT } from 'customer-data-objects/constants/ObjectTypes';
import CompaniesStore from 'crm_data/companies/CompaniesStore';
import { getProperty } from 'customer-data-objects/model/ImmutableModel';
import { isLoading, isEmpty, EMPTY } from 'crm_data/flux/LoadingStatus';
var dependencies = {
  matches: makeElasticSearchUISelectDependency(ContactsStore, CONTACT, {
    minimumSearchLength: MIN_SEARCH_LENGTH
  }),
  selectedObjects: makeSelectedObjectsDependency(ContactsStore),
  suggestions: makeElasticSearchUISelectDependency(ContactsStore, CONTACT, {
    stores: [CompaniesStore],
    getSearchText: function getSearchText(props) {
      if (props.objectType !== COMPANY) {
        return EMPTY;
      }

      var company = CompaniesStore.get(props.subjectId);

      if (isLoading(company) || isEmpty(company)) {
        return company;
      }

      return getProperty(company, 'domain');
    }
  })
};
var ContactAssociationSelectorContainer = makeObjectAssociationSelectorContainer(dependencies);
export default connect({
  existingAssociations: existingAssociationsDependency
})(ContactAssociationSelectorContainer);