'use es6';

import { fromJS } from 'immutable';
import { connect } from 'general-store';
import DealsStore from 'crm_data/deals/DealsStore';
import existingAssociationsDependency from './dependencies/existingAssociationsDependency';
import makeElasticSearchUISelectDependency from 'crm_data/elasticSearch/dependencies/makeElasticSearchUISelectDependency';
import makeObjectAssociationSelectorContainer from './ObjectAssociationSelectorContainer';
import makeSelectedObjectsDependency from './dependencies/makeSelectedObjectsDependency';
import { MIN_SEARCH_LENGTH } from 'customer-data-objects/search/ElasticSearchConstants';
import { COMPANY, DEAL } from 'customer-data-objects/constants/ObjectTypes';
var dependencies = {
  matches: makeElasticSearchUISelectDependency(DealsStore, DEAL, {
    minimumSearchLength: MIN_SEARCH_LENGTH,
    getFilterGroups: function getFilterGroups(objectType) {
      if (objectType === COMPANY) {
        return fromJS([{
          filters: [{
            operator: 'NOT_HAS_PROPERTY',
            property: 'associations.company'
          }]
        }]);
      }

      return null;
    }
  }),
  selectedObjects: makeSelectedObjectsDependency(DealsStore)
};
var DealAssociationSelectorContainer = makeObjectAssociationSelectorContainer(dependencies);
export default connect({
  existingAssociations: existingAssociationsDependency
})(DealAssociationSelectorContainer);