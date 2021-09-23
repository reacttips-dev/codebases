'use es6';

import get from 'transmute/get';
export var shouldShowDealLineItemsCard = function shouldShowDealLineItemsCard(scopes) {
  return get('revenue-hide-line-items-card', scopes) !== true;
};
export var canViewDealLineItems = function canViewDealLineItems(scopes) {
  return get('deal-line-item-read', scopes) === true;
};
export var canEditProductLibrary = function canEditProductLibrary(scopes) {
  return get('inbounddb-product-library-write', scopes) === true;
};
export var canAddLineItemsFromLibrary = function canAddLineItemsFromLibrary(scopes) {
  return !!get('add-line-item-from-library', scopes);
};
export var canAddCustomLineItems = function canAddCustomLineItems(scopes) {
  return get('custom-line-item-write', scopes) === true;
};