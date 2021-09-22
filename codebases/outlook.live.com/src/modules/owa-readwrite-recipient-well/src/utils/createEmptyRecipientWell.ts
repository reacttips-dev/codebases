import createDropViewState from 'owa-dnd/lib/utils/createDropViewState';
import type { FeedbackManagerState } from 'owa-feedback-manager/lib/store/schema/FeedbackManagerState';
import {
    FindResultType,
    DirectorySearchType,
} from 'owa-recipient-types/lib/types/FindControlViewState';
import type RecipientWellWithFindControlViewState from 'owa-recipient-types/lib/types/RecipientWellWithFindControlViewState';
import createRecipientEditorViewState from 'owa-recipient-create-viewstate/lib/util/createRecipientEditorViewState';

let globalRecipientWellId = 0;

/**
 * Creates an empty recipient well
 *
 * Prefer this over `createRecipientWell` if you never need to parse recipients,
 * otherwise you will pull recipient parsing logic into your bundle.
 *
 * @param userIdentity: the smtp of the mailbox that this recipient well is operating under
 */
export default function createEmptyRecipientWell(
    findPeopleFeedbackManager?: FeedbackManagerState,
    userIdentity?: string
): RecipientWellWithFindControlViewState {
    return {
        userIdentity: userIdentity,
        recipientWellId: `rw-${++globalRecipientWellId}`,
        queryString: '',
        recipients: [],
        isDirty: false,
        shouldShowContactPicker: false,
        findResultSet: [],
        findResultType: FindResultType.None,
        isSearching: false,
        directorySearchType: DirectorySearchType.None,
        dropViewState: createDropViewState(),
        findPeopleFeedbackManager: findPeopleFeedbackManager,
        numberOfCacheResults: 0,
        recipientEditorViewState: createRecipientEditorViewState(false, findPeopleFeedbackManager),
    };
}
