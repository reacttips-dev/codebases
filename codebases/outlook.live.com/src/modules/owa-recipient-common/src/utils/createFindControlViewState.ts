import { getUserMailboxInfo } from 'owa-client-ids';
import FindControlViewState, {
    FindResultType,
    DirectorySearchType,
} from 'owa-recipient-types/lib/types/FindControlViewState';
import type { FeedbackManagerState } from 'owa-feedback-manager/lib/store/schema/FeedbackManagerState';

export default function createFindControlViewState(
    userIdentity?: string,
    queryString?: string,
    findPeopleFeedbackManager?: FeedbackManagerState,
    inForceResolve?: boolean
): FindControlViewState {
    let findControlViewState: FindControlViewState = {
        userIdentity: userIdentity ? userIdentity : getUserMailboxInfo().userIdentity,
        queryString: queryString ? queryString : '',
        findResultSet: [],
        findResultType: FindResultType.None,
        isSearching: false,
        directorySearchType: DirectorySearchType.None,
        findPeopleFeedbackManager: findPeopleFeedbackManager,
        inForceResolve: inForceResolve,
        currentRenderedQueryString: '',
        numberOfCacheResults: 0,
    };

    return findControlViewState;
}
