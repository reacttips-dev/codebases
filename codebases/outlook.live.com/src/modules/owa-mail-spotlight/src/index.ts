import { LazyAction, LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "Spotlight"*/ './lazyIndex'));

// Init/Fetching
export const lazyFetchSpotlightItems = new LazyAction(lazyModule, m => m.fetchSpotlightItems);

// Selectors
export { default as isSpotlightItem } from './selectors/isSpotlightItem';
export { default as getSpotlightItemByRowKey } from './selectors/getSpotlightItemByRowKey';
export const lazyGetSpotlightLogicalId = new LazyImport(lazyModule, m => m.getSpotlightLogicalId);
export const lazyGetSpotlightItem = new LazyImport(lazyModule, m => m.getSpotlightItem);
export const lazyGetSpotlightCount = new LazyImport(lazyModule, m => m.getSpotlightCount);
export const lazyGetUnacknowledgedSpotlightCount = new LazyImport(
    lazyModule,
    m => m.getUnacknowledgedSpotlightCount
);

// Actions
export const lazyOnSpotlightDismissedFromRP = new LazyAction(
    lazyModule,
    m => m.onSpotlightDismissedFromRP
);

// Utils
export { default as isSpotlightEnabled } from './utils/isSpotlightEnabled';
export const lazyGetSpotlightDonationJson = new LazyAction(
    lazyModule,
    m => m.getSpotlightDonationJson
);
export const lazyGetSpotlightReasonString = new LazyAction(
    lazyModule,
    m => m.getSpotlightReasonString
);
export const lazyLoadImportantTable = new LazyAction(lazyModule, m => m.loadImportantTable);
export const lazyLogSpotlightItemClicked = new LazyAction(
    lazyModule,
    m => m.logSpotlightItemClicked
);
export const lazyLogSpotlightResultsRendered = new LazyAction(
    lazyModule,
    m => m.logSpotlightResultsRendered
);
