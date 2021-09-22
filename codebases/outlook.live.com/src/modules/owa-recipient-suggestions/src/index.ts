import { LazyImport, LazyModule } from 'owa-bundling';
const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "RecipientSuggestions"*/ './lazyIndex')
);

export const lazySearchSuggestionsForSinglePersona = new LazyImport(
    lazyModule,
    m => m.searchSuggestionsForSinglePersona
);

export const lazySearchSuggestions = new LazyImport(lazyModule, m => m.searchSuggestions);
