import { LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "AMCardActions" */ './lazyIndex')
);

/**
 * export the lazy imports
 */

export const lazyPrefetchActionableMessageForItems = new LazyImport(
    lazyModule,
    m => m.prefetchActionableMessageForItems
);

/**
 * Export mutators
 */

export { default as addCardDetailsOnItem } from './mutators/addCardDetailsOnItem';
export { default as updateCardDetailsOnItem } from './mutators/updateCardDetailsOnItem';
export { default as updateCardFetchStatusForItems } from './mutators/updateCardFetchStatusForItems';

/**
 * Export helper modules to fetch/prefetch card payload.
 */

export { default as fetchCardDetailsForItems } from './service/fetchCardDetailsForItems';
export { default as doesItemContainActionableMessage } from './utils/doesItemContainActionableMessage';
export { default as doesItemContainCardPayload } from './utils/doesItemContainCardPayload';
