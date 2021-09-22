import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "SearchInstrumentation" */ './lazyIndex')
);

// V1 events
export let lazyLogEntityClicked = new LazyAction(lazyModule, m => m.logEntityClicked);
export const lazyLogResponseReceived = new LazyAction(lazyModule, m => m.logResponseReceived);
export let lazyLogSessionEnd = new LazyAction(lazyModule, m => m.logSessionEnd);
export let lazyLogResponseRendered = new LazyAction(lazyModule, m => m.logResponseRendered);
export const lazyLogSearchBoxStateChanged = new LazyAction(
    lazyModule,
    m => m.logSearchBoxStateChanged
);
export let lazyLogSearchResultInteraction = new LazyAction(
    lazyModule,
    m => m.logSearchResultInteraction
);
export let lazyLogResponseNeverRendered = new LazyAction(
    lazyModule,
    m => m.logResponseNeverRendered
);
export const lazyFlushNonRenderedItemsFromCache = new LazyAction(
    lazyModule,
    m => m.flushNonRenderedResponseReceivedItemsFromCache
);

// V2 events
export const lazyLogCachedContentRendered = new LazyAction(
    lazyModule,
    m => m.logCachedContentRendered
);
export let lazyLogFeedback = new LazyAction(lazyModule, m => m.logFeedback);
export const lazyLogClientLayout = new LazyAction(lazyModule, m => m.logClientLayout);
export const lazyLogClientDataSource = new LazyAction(lazyModule, m => m.logClientDataSource);
export const lazyLogEntitiesFromFilePicker = new LazyAction(
    lazyModule,
    m => m.logEntitiesFromFilePicker
);
export const lazyLogResponseReceivedV2 = new LazyAction(lazyModule, m => m.logResponseRecievedV2);
export const lazyLogResultsRendered = new LazyAction(lazyModule, m => m.logResultsRendered);
export const lazyLogSearchEntityActions = new LazyAction(lazyModule, m => m.logSearchEntityActions);
export const lazyLogSearchFeedbackActions = new LazyAction(
    lazyModule,
    m => m.logSearchFeedbackActions
);
export const lazyLogSearchActions = new LazyAction(lazyModule, m => m.logSearchActions);
export let lazyLogSecondaryEntityActionClicked = new LazyAction(
    lazyModule,
    m => m.logSecondaryEntityActionClicked
);
export const lazyClearProcessedTraceIds = new LazyAction(lazyModule, m => m.clearProcessedTraceIds);
export const lazyLogSearchSuggestionsClientLayoutEvent = new LazyAction(
    lazyModule,
    m => m.logSearchSuggestionsClientLayoutEvent
);
export const lazyLogSearchSuggestionsResultsRenderedEvent = new LazyAction(
    lazyModule,
    m => m.logSearchSuggestionsResultsRenderedEvent
);

// Types
export type { Results } from './data/schema/ClientDataSourceEvent';
export type { ClientDataSourceEvent } from './data/schema/ClientDataSourceEvent';
export type { default as ResultsView } from './data/schema/ResultsView';
export type { GroupName } from './data/schema/substrateSearchLogTypes';
export type { ItemType } from './data/schema/substrateSearchLogTypes';
