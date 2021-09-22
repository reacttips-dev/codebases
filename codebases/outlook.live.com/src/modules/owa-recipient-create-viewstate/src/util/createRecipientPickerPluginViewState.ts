import type { RecipientPickerPluginViewState } from 'owa-recipient-types/lib/types/RecipientPickerPluginViewState';
import {
    FindResultType,
    DirectorySearchType,
} from 'owa-recipient-types/lib/types/FindControlViewState';
import createPickerPluginViewState from 'owa-editor-picker-plugin/lib/utils/createPickerPluginViewState';
import type { FeedbackManagerState } from 'owa-feedback-manager/lib/store/schema/FeedbackManagerState';

export default function createRecipientPickerPluginViewState(
    findPeopleFeedbackManager: FeedbackManagerState
): RecipientPickerPluginViewState {
    return {
        ...createPickerPluginViewState(),
        queryString: '',
        wordBeforeCursor: '',
        findResultSet: [],
        isSearching: false,
        directorySearchType: DirectorySearchType.None,
        selectedRecipientIndex: -1,
        selectedHeaderIndex: -1,
        selectedFooterIndex: -1,
        findResultType: FindResultType.None,
        findPeopleFeedbackManager: findPeopleFeedbackManager,
        currentRenderedQueryString: '',
        numberOfCacheResults: 0,
    };
}
