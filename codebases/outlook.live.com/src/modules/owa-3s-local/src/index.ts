import { LazyAction, LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "3S-Local" */ './lazyIndex'));

export let lazySearchCacheTrie = new LazyImport(lazyModule, m => m.searchCacheTrie);

export let lazyCompareFeatureData = new LazyImport(lazyModule, m => m.compareFeatureData);

export let lazyInitializeSuggestionTrie = new LazyAction(
    lazyModule,
    m => m.initializeSuggestionTrie
);

export let lazyIsSuggestionTrieEmpty = new LazyAction(lazyModule, m => m.isSuggestionTrieEmpty);
