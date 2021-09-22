import { LazyModule, LazyAction, createLazyComponent } from 'owa-bundling';

const lazyModules = new LazyModule(
    () => import(/* webpackChunkName: "MailSearch" */ './lazyIndex')
);

// Export components
export const AnswersContainer = createLazyComponent(lazyModules, m => m.AnswersContainer);

// Export store stuff
export type { default as MailSearchStore } from './store/schema/MailSearchStore';
export { SUPPORTED_FILESHUB_SUGGESTION_KIND_LIST } from './store/schema/constants';
export type { SupportedFilesHubSuggestionKindType } from './store/schema/constants';
export { default as mailSearchStore, getStore } from './store/store';
export type { FoldersSearchScope } from './utils/getSearchScopeDisplayName';

// Export actions
export { clearSearchScope, setStaticSearchScope, onAnswerRendered } from './actions/publicActions';

// Export utils
export { default as getFolderIdFromTableView } from './utils/getFolderIdFromTableView';
export { default as isAnswerFeatureEnabled } from './utils/isAnswerFeatureEnabled';
export { default as isInteractiveFiltersEnabled } from './utils/isInteractiveFiltersEnabled';

export let lazyInitializeSearchAnswers = new LazyAction(
    lazyModules,
    m => m.initializeAndWarmupAnswers
);

// Export selectors
export { default as getSearchProvider } from './selectors/getSearchProvider';
export { default as isSearchFilterApplied } from './selectors/isSearchFilterApplied';
export {
    lazyModule,
    SearchHeaderFirstRowContent,
    SearchFiltersContainer,
    FolderScopePicker,
    lazySetShouldShowAdvancedSearch,
    lazySetStaticSearchScopeData,
    lazyStartSearchWithCategory,
    lazyFindEmailFromSender,
} from './lazyFunctions';
