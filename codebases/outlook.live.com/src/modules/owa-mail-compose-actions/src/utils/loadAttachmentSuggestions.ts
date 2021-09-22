import { lazyGetAttachmentSuggestionsAction } from 'owa-attachment-suggestions';
import type { ComposeViewState } from 'owa-mail-compose-store';
import getSuggestedAttachmentMessageFromComposeViewState from './getSuggestedAttachmentMessageFromComposeViewState';

export default async function loadAttachmentSuggestions(
    composeViewState: ComposeViewState
): Promise<void> {
    const getAttachmentSuggestionsAction = await lazyGetAttachmentSuggestionsAction.import();
    getAttachmentSuggestionsAction(
        composeViewState.referenceItemId,
        composeViewState.composeId,
        true /* isPrefetch */,
        getSuggestedAttachmentMessageFromComposeViewState(composeViewState)
    );
}
