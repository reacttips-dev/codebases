import type { InfoBarHostViewState } from '../schema/InfoBarMessageViewState';
import { infoBarMessageCreatorsMap } from '../utils/infoBarMessageCreatorsMap';
import type InfoBarMessageViewStateCreator from '../schema/InfoBarMessageViewStateCreator';
import { action } from 'satcheljs/lib/legacy';

/**
 * @param viewState the host viewstate storing the list of messageIds to render
 * @param messageId the message Id of the infobar to remove
 * @param key if the message was added with a key, the message is stored in a bucket with that key (e.g. itemId, or composeId)
 */
const addInfoBarMessage = action('addInfoBarMessage')(function addInfoBarMessage(
    viewState: InfoBarHostViewState,
    messageId: string,
    infoBarMessageViewStateCreator?: InfoBarMessageViewStateCreator
) {
    if (viewState) {
        if (viewState.infoBarIds.indexOf(messageId) == -1) {
            viewState.infoBarIds.push(messageId);
        } else {
            // clone infoBarIds to force re-render
            viewState.infoBarIds = [...viewState.infoBarIds];
        }

        const key = viewState.infoBarHostKey;

        if (infoBarMessageViewStateCreator) {
            if (!infoBarMessageCreatorsMap[key]) {
                infoBarMessageCreatorsMap[key] = {};
            }
            infoBarMessageCreatorsMap[key][messageId] = infoBarMessageViewStateCreator;
        }
    }
});

export default addInfoBarMessage;
