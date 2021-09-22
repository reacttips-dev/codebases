import {
    LazyImport,
    LazyModule,
    LazyAction,
    createLazyComponent,
    registerLazyOrchestrator,
} from 'owa-bundling';
import { getSuggestions } from 'owa-search-actions/lib/actions/getSuggestions';
import { searchSessionStarted } from 'owa-search-actions/lib/actions/searchSessionStarted';
import { startSearch } from 'owa-search-actions/lib/actions/startSearch';
import { startAnswersSearchSession } from './actions/startAnswersSearchSession';

export const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MailSearch"*/ './lazyIndex')
);
export let SearchHeaderFirstRowContent = createLazyComponent(
    lazyModule,
    m => m.SearchHeaderFirstRowContent
);
export let SearchFiltersContainer = createLazyComponent(lazyModule, m => m.SearchFiltersContainer);

// Export lazy loaded components
export const AdvancedSearchWrapper = createLazyComponent(lazyModule, m => m.AdvancedSearchWrapper);
export const FolderScopePicker = createLazyComponent(lazyModule, m => m.FolderScopePicker);
export const lazySetStaticSearchScopeData = new LazyImport(
    lazyModule,
    m => m.setStaticSearchScopeData
);

export const lazyStartSearchWithCategory = new LazyImport(
    lazyModule,
    m => m.startSearchWithCategory
);
export const lazyFindEmailFromSender = new LazyAction(lazyModule, m => m.findEmailFromSender);

export const lazySetShouldShowAdvancedSearch = new LazyImport(
    lazyModule,
    m => m.setShouldShowAdvancedSearch
);

// Export from owa-persona
export const lazyInitializeLivePersonaCard = new LazyImport(
    lazyModule,
    m => m.initializeLivePersonaCard
);
export const lazyPersonaControlStore = new LazyImport(lazyModule, m => m.personaControlStore);
export let lazyCreateFallbackPersonaSearchTableQuery = new LazyImport(
    lazyModule,
    m => m.createFallbackPersonaSearchTableQuery
);

export let lazyCreateFallbackPrivateDistributionListSearchTableQuery = new LazyImport(
    lazyModule,
    m => m.createFallbackPrivateDistributionListSearchTableQuery
);

export let lazyCreateFallbackCategorySearchTableQuery = new LazyImport(
    lazyModule,
    m => m.createFallbackCategorySearchTableQuery
);

export let lazyShouldShowInScopeSelector = new LazyImport(
    lazyModule,
    m => m.shouldShowInScopeSelector
);

// Register lazy orchestrator
registerLazyOrchestrator(getSuggestions, lazyModule, m => m.getSuggestionsOrchestrator);
registerLazyOrchestrator(searchSessionStarted, lazyModule, m => m.searchSessionStartedOrchestrator);
registerLazyOrchestrator(startSearch, lazyModule, m => m.startSearchOrchestrator, {
    captureBundleTime: true,
});
registerLazyOrchestrator(
    startAnswersSearchSession,
    lazyModule,
    m => m.startAnswerSearchSessionOrchestrator
);

// Delay loaded imports
export const lazyGetNaturalLanguageGhostText = new LazyImport(
    lazyModule,
    m => m.getNaturalLanguageGhostText
);
