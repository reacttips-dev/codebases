import type FindRecipientPersonaType from './FindRecipientPersonaType';
import type { PeopleFeedbackState } from './PeopleFeedbackState';
import type { FeedbackManagerState } from 'owa-feedback-manager/lib/store/schema/FeedbackManagerState';

export enum FindResultType {
    None,
    Cache,
    FindPeople,
    SearchDirectory,
    MixedCacheLive,
}

export enum DirectorySearchType {
    None,
    Auto,
    Manual,
}

interface FindControlViewState {
    userIdentity?: string;
    queryString: string;
    findPeopleFeedbackManager: FeedbackManagerState;
    findResultSet: FindRecipientPersonaType[];
    findResultType: FindResultType;
    numberOfCacheResults: number;
    isSearching: boolean;
    directorySearchType: DirectorySearchType;
    inForceResolve?: boolean;
    currentRenderedQueryString?: string;
    peopleFeedbackState?: PeopleFeedbackState;
}

export default FindControlViewState;
