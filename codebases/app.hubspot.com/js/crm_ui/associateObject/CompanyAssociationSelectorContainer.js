'use es6';

import { connect } from 'general-store';
import CompaniesStore from 'crm_data/companies/CompaniesStore';
import { COMPANY } from 'customer-data-objects/constants/ObjectTypes';
import existingAssociationsDependency from './dependencies/existingAssociationsDependency';
import makeElasticSearchUISelectDependency from 'crm_data/elasticSearch/dependencies/makeElasticSearchUISelectDependency';
import makeObjectAssociationSelectorContainer from './ObjectAssociationSelectorContainer';
import makeSelectedObjectsDependency from './dependencies/makeSelectedObjectsDependency';
import { MIN_SEARCH_LENGTH } from 'customer-data-objects/search/ElasticSearchConstants';
var dependencies = {
  matches: makeElasticSearchUISelectDependency(CompaniesStore, COMPANY, {
    minimumSearchLength: MIN_SEARCH_LENGTH
  }),
  selectedObjects: makeSelectedObjectsDependency(CompaniesStore)
};
var CompanyAssociationSelectorContainer = makeObjectAssociationSelectorContainer(dependencies);
export default connect({
  existingAssociations: existingAssociationsDependency
})(CompanyAssociationSelectorContainer);