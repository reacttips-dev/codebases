import { LazyImport, LazyModule } from 'owa-bundling';
const lazyModule = new LazyModule(() => import(/* webpackChunkName: "Search"*/ './lazyIndex'));

//VSO#35181 remove clearSearchBox from lazy, is exported as an action above
export const lazyClearSearchBox = new LazyImport(lazyModule, m => m.clearSearchBox);
export const lazyEndSearchSession = new LazyImport(lazyModule, m => m.endSearchSession);

export const lazyOnBackspacePressedSearchInput = new LazyImport(
    lazyModule,
    m => m.onBackspacePressedSearchInput
);

export const lazyOnDownArrowPressedSearchInput = new LazyImport(
    lazyModule,
    m => m.onDownArrowPressedSearchInput
);

export const lazyOnLeftArrowPressedSearchInput = new LazyImport(
    lazyModule,
    m => m.onLeftArrowPressedSearchInput
);

export const lazyOnUpArrowPressedSearchInput = new LazyImport(
    lazyModule,
    m => m.onUpArrowPressedSearchInput
);

export const lazyRemoveSuggestionPillFromSearchBox = new LazyImport(
    lazyModule,
    m => m.removeSuggestionPillFromSearchBox
);

export const lazySetIsSuggestionsDropdownVisible = new LazyImport(
    lazyModule,
    m => m.setIsSuggestionsDropdownVisible
);

export const lazySetShowSearchBoxInCompactMode = new LazyImport(
    lazyModule,
    m => m.setShowSearchBoxInCompactMode
);

export const lazyUpdateIsSuggestionSetComplete = new LazyImport(
    lazyModule,
    m => m.updateIsSuggestionSetComplete
);
