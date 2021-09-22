import { createLazyComponent, LazyAction, LazyImport, LazyModule } from 'owa-bundling';
const lazyModule = new LazyModule(() => import(/* webpackChunkName: "Search"*/ './lazyIndex'));

export const lazySetLatestQFRequestId = new LazyImport(lazyModule, m => m.setLatestQFRequestId);

// Export mutators
export const lazySetSpellerData = new LazyAction(lazyModule, m => m.setSpellerData);

// Export lazy loaded components
export const PersonaPill = createLazyComponent(lazyModule, m => m.PersonaPill);
export const PrivateDistributionListPill = createLazyComponent(
    lazyModule,
    m => m.PrivateDistributionListPill
);
export const SearchBoxDropdown = createLazyComponent(lazyModule, m => m.SearchBoxDropdown);
export const SearchBoxPillWell = createLazyComponent(lazyModule, m => m.SearchBoxPillWell);
export const SuggestionsCallout = createLazyComponent(lazyModule, m => m.SuggestionsCallout);
export const CompactSearchBox = createLazyComponent(lazyModule, m => m.CompactSearchBox);
export const SearchScopePicker = createLazyComponent(lazyModule, m => m.SearchScopePicker);

// Export selectors
export const lazyGetSuggestionAtIndex = new LazyImport(lazyModule, m => m.getSuggestionAtIndex);
export const lazyIsInSearchMode = new LazyImport(lazyModule, m => m.isInSearchMode);
export const lazyIsQFRequestIdEqualToLatest = new LazyImport(
    lazyModule,
    m => m.isQFRequestIdEqualToLatest
);
export const lazyIsSearchBoxEmpty = new LazyImport(lazyModule, m => m.isSearchBoxEmpty);

// Export utils
export const lazyIsFromPersona = new LazyImport(lazyModule, m => m.isFromPersona);
export const lazyIsToPersona = new LazyImport(lazyModule, m => m.isToPersona);

// Export from owa-persona
export const lazyPersonaControlStore = new LazyImport(lazyModule, m => m.personaControlStore);
