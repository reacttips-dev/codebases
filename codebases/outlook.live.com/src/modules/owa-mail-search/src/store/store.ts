import type MailSearchStore from './schema/MailSearchStore';
import { ObservableMap } from 'mobx';
import type { SuggestionSet } from 'owa-search-service';
import { createStore } from 'satcheljs';
import { getDefaultAdvancedSearchViewState } from './schema/AdvancedSearchViewState';
import getRandomInt from '../utils/getRandomInt';
import { MAX_NAMES_FOR_GHOST_TEXT } from '../bootSearchConstants';

export const GENERAL_GHOST_TEXT_BANK_COUNT = 4; //keep in sync with length of array in owa-mail-search/lib/searchConstants.ts
export const PERSONALIZED_GHOST_TEXT_BANK_COUNT = 8; //keep in sync with length of array in owa-mail-search/lib/searchConstants.ts

export const defaultMailSearchStore: MailSearchStore = {
    toDate: null,
    fromDate: null,
    includeAttachments: false,
    initialSearchScope: null,
    isSearchHistoryDirty: false,
    isAnswerInitialized: false,
    isAnswerLocalizationCompleted: false,
    isUnread: false,
    isToMe: false,
    isFlagged: false,
    isMentioned: false,
    previousNode: null,
    searchNumber: 0,
    staticSearchScope: null,
    staticSearchScopeList: null,
    shouldShowAdvancedSearch: false,
    advancedSearchViewState: getDefaultAdvancedSearchViewState(),
    initialAdvancedSearchViewState: getDefaultAdvancedSearchViewState(),
    legacySuggestions: new ObservableMap<string, SuggestionSet>({}),
    recipientForPersonalizedGhostTextIndex: getRandomInt(MAX_NAMES_FOR_GHOST_TEXT - 1),
    generalizedGhostTextBankIndex: getRandomInt(GENERAL_GHOST_TEXT_BANK_COUNT - 1),
    personalizedGhostTextBankIndex: getRandomInt(PERSONALIZED_GHOST_TEXT_BANK_COUNT - 1),
    usePersonalGhostText: false,
    isAnswerAvailable: false,
    provider: null,
    isAlterationRecourse: false,
    filtersInstrumentationContext: null,
};

const initialStore = { ...defaultMailSearchStore };
export const getStore = createStore<MailSearchStore>('mailSearchStore', initialStore);
const store = getStore();
export default store;
