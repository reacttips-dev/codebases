'use es6';

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { authReducer } from '../../auth/reducers/authReducer';
import { automationReducer } from '../../automation/reducers/automationReducer';
import { crmObjectsReducer } from '../../crmObjects/reducers/crmObjectsReducer';
import { doubleOptInReducer } from '../../doubleOptIn/reducers/doubleOptInReducer';
import { fieldLevelPermissionsReducer } from '../../fieldLevelPermissions/reducers/fieldLevelPermissionsReducer';
import { localCrmObjectMutationsReducer } from '../../localMutations/reducers/localCrmObjectMutationsReducer';
import { overlayReducer } from '../../overlay/reducers/overlayReducer';
import { paginationReducer } from '../../pagination/reducers/paginationReducer';
import { pinnedViewsReducer } from '../../pinnedViews/reducers/pinnedViewsReducer';
import { currentPipelineIdReducer } from '../../pipelines/reducers/currentPipelineIdReducer';
import { propertiesReducer } from '../../properties/reducers/propertiesReducer';
import { recentlyUsedPropertiesReducer } from '../../recentlyUsedProperties/reducers/recentlyUsedPropertiesReducer';
import { recordCardsReducer } from '../../recordCards/reducers/recordCardsReducer';
import { routerStateReducer } from '../../init/reducers/routerStateReducer';
import { searchReducer } from '../../search/reducers/searchReducer';
import { stageAggregationReducer } from '../../stageAggregations/reducers/stageAggregationReducer';
import { teamsReducer } from '../../teams/reducers/teamsReducer';
import { viewCountsReducer } from '../../viewCounts/reducers/viewCountsReducer';
import { viewsReducer } from '../../views/reducers/viewsReducer';
var createStoreWithMiddleware = compose(applyMiddleware(thunk))(createStore);
export var configureStore = function configureStore() {
  var rootReducer = combineReducers({
    auth: authReducer,
    automation: automationReducer,
    crmObjects: crmObjectsReducer,
    currentPipelineId: currentPipelineIdReducer,
    doubleOptIn: doubleOptInReducer,
    fieldLevelPermissions: fieldLevelPermissionsReducer,
    localCrmObjectMutations: localCrmObjectMutationsReducer,
    overlay: overlayReducer,
    pagination: paginationReducer,
    pinnedViews: pinnedViewsReducer,
    properties: propertiesReducer,
    recentlyUsedProperties: recentlyUsedPropertiesReducer,
    recordCards: recordCardsReducer,
    routerState: routerStateReducer,
    search: searchReducer,
    stageAggregations: stageAggregationReducer,
    teams: teamsReducer,
    viewCounts: viewCountsReducer,
    views: viewsReducer
  });
  return createStoreWithMiddleware(rootReducer, {}, // TODO: Disable devtools in production
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({
    name: 'Redux'
  }));
};