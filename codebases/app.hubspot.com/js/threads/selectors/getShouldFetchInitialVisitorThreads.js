'use es6';

import { createSelector } from 'reselect';
import { getIsEmbeddedInProduct } from '../../query-params/getIsEmbeddedInProduct';
import { getWidgetUiState } from '../../selectors/getWidgetUiState';
import { getIsFirstVisitorSession } from '../../visitor-identity/selectors/getIsFirstVisitorSession';
export var getShouldFetchInitialVisitorThreads = createSelector([getIsFirstVisitorSession, getWidgetUiState], function (isFirstVisitorSession) {
  var isEmbeddedInProduct = getIsEmbeddedInProduct();
  return Boolean(!isFirstVisitorSession || isEmbeddedInProduct);
});