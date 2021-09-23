'use es6';

import { createDeal as doCreateDeal, createDealWithAssociations as doCreateDealWithAssociations, deleteDeal, refresh, revertMove, updateDealProperties, updateDeals } from 'crm_data/deals/DealsActions';
export function createDeal(deal) {
  return doCreateDeal(deal);
}
export function createDealWithAssociations(deal, _ref) {
  var requestedAssociatedObjects = _ref.requestedAssociatedObjects;
  return doCreateDealWithAssociations(deal, {
    requestedAssociatedObjects: requestedAssociatedObjects
  });
}
export { deleteDeal, refresh, revertMove, updateDealProperties, updateDeals };