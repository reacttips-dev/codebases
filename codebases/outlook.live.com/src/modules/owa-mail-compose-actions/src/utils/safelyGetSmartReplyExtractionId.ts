import type { ComposeViewState } from 'owa-mail-compose-store';
import { mailStore } from 'owa-mail-store';

export default function safelyGetSmartReplyExtractionId(
    composeViewState: ComposeViewState,
    type: string
): string {
    let extractionId: string = '';

    if (composeViewState) {
        const referenceItem = mailStore.items.get(composeViewState.referenceItemId?.Id);

        // We want to return either a valid extraction ID or an empty string, to make scorecarding easier.
        // If there is no smart reply data return empty string to make logs clean
        switch (type) {
            case 'smartReply':
                if (referenceItem?.SmartReplyData?.ExtractionID) {
                    extractionId = referenceItem.SmartReplyData.ExtractionID;
                }
                break;
            case 'smartDoc':
                if (referenceItem?.SmartDocData?.EntityId) {
                    extractionId = referenceItem.SmartDocData.EntityId;
                }
                break;
        }
    }
    return extractionId;
}
