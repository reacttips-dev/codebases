import { LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "UserHighlighting" */ './lazyIndex')
);

// Lazy utils

export const lazyShowUserMarkupPopup = new LazyImport(lazyModule, m => m.showUserMarkupPopup);
export const lazyDestroyPopupDiv = new LazyImport(lazyModule, m => m.destroyPopupDiv);

export const lazyMarkInstanceOfUserMarkup = new LazyImport(
    lazyModule,
    m => m.markInstanceOfUserMarkup
);

export const lazyRemoveUserMarkupPopupEventListener = new LazyImport(
    lazyModule,
    m => m.removeUserMarkupPopupEventListener
);

export const lazyGetItemUserMarkupData = new LazyImport(lazyModule, m => m.getItemUserMarkupData);
export const lazyGetItemUserMarkupKeywords = new LazyImport(
    lazyModule,
    m => m.getItemUserMarkupKeywords
);
export const lazyGetItemUserMarkupMap = new LazyImport(lazyModule, m => m.getItemUserMarkupMap);

// Interfaces

export type { default as KeywordMarkupData } from './store/schema/KeywordMarkupData';
export type { default as UserMarkup } from './store/schema/UserMarkup';
