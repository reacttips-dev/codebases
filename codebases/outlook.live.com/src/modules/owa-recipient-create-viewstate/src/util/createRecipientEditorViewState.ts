import type RecipientEditorViewState from 'owa-recipient-types/lib/types/RecipientEditorViewState';
import createRecipientPickerPluginViewState from './createRecipientPickerPluginViewState';
import type { FeedbackManagerState } from 'owa-feedback-manager/lib/store/schema/FeedbackManagerState';

let nextRecipientEditorId = 0;

function getNextRecipientEditorId(): string {
    return (nextRecipientEditorId++).toString();
}

export default function createRecipientEditorViewState(
    isDirty: boolean = false,
    findPeopleFeedbackManager: FeedbackManagerState
): RecipientEditorViewState {
    return {
        editorId: getNextRecipientEditorId(),
        isDirty: isDirty,
        textDirection: null,
        recipientPickerPluginViewState: createRecipientPickerPluginViewState(
            findPeopleFeedbackManager
        ),
    };
}
