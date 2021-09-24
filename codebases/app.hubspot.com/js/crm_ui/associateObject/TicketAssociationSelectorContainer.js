'use es6';

import { connect } from 'general-store';
import { fromJS } from 'immutable';
import makeElasticSearchUISelectDependency from 'crm_data/elasticSearch/dependencies/makeElasticSearchUISelectDependency';
import TicketsStore from 'crm_data/tickets/TicketsStore';
import { MIN_SEARCH_LENGTH } from 'customer-data-objects/search/ElasticSearchConstants';
import { COMPANY, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import makeObjectAssociationSelectorContainer from './ObjectAssociationSelectorContainer';
import existingAssociationsDependency from './dependencies/existingAssociationsDependency';
import makeSelectedObjectsDependency from './dependencies/makeSelectedObjectsDependency';
var dependencies = {
  matches: makeElasticSearchUISelectDependency(TicketsStore, TICKET, {
    minimumSearchLength: MIN_SEARCH_LENGTH,
    getFilterGroups: function getFilterGroups(objectType) {
      if (objectType === COMPANY) {
        return fromJS([{
          filters: [{
            property: 'hs_num_associated_companies',
            value: 0,
            operator: 'EQ'
          }]
        }, {
          filters: [{
            property: 'hs_num_associated_companies',
            operator: 'NOT_HAS_PROPERTY'
          }]
        }]);
      }

      return null;
    }
  }),
  selectedObjects: makeSelectedObjectsDependency(TicketsStore)
};
var TicketAssociationSelectorContainer = makeObjectAssociationSelectorContainer(dependencies);
export default connect({
  existingAssociations: existingAssociationsDependency
})(TicketAssociationSelectorContainer);