import { createStore } from 'satcheljs';
import FindControlViewState, {
    FindResultType,
    DirectorySearchType,
} from 'owa-recipient-types/lib/types/FindControlViewState';
import { resetStore } from '../actions/resetFindControlStore';

export interface FindControlStore {
    viewState: FindControlViewState;
}

export const storeInitialViewState = {
    mailboxSmtpAddress: null,
    queryString: '',
    shouldShowFindResult: false,
    findResultSet: [],
    findResultType: FindResultType.None,
    findResultHightlightIndex: -1,
    isSearching: false,
    directorySearchType: DirectorySearchType.None,
    findPeopleFeedbackManager: null,
    inForceResolve: false,
    numberOfCacheResults: 0,
};

export const getStore = createStore<FindControlStore>('FindControl', {
    viewState: storeInitialViewState,
});

function resetAndGetStore(): FindControlStore {
    resetStore();
    return getStore();
}

export default resetAndGetStore;
