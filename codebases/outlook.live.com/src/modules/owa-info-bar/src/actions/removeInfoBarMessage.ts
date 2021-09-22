import type { InfoBarHostViewState } from '../schema/InfoBarMessageViewState';
import { infoBarMessageCreatorsMap } from '../utils/infoBarMessageCreatorsMap';
import { mutatorAction } from 'satcheljs';

/**
 * @param viewState the host viewstate storing the list of messageIds to render
 * @param messageIds the message Id of the infobar to removem can be a single message id or a array of ids.
 * If messageIds is not passed, all existing messages will be removed.
 */
const removeInfoBarMessageMutator = mutatorAction(
    'removeInfoBarMessages',
    (viewState: InfoBarHostViewState, index: number, messageId: string) => {
        if (index >= 0) {
            viewState.infoBarIds.splice(index, 1);
        }

        const key = viewState.infoBarHostKey;

        if (infoBarMessageCreatorsMap[key]) {
            delete infoBarMessageCreatorsMap[key][messageId];
            if (Object.keys(infoBarMessageCreatorsMap[key]).length === 0) {
                delete infoBarMessageCreatorsMap[key];
            }
        }
    }
);

export default function removeInfoBarMessage(
    viewState: InfoBarHostViewState,
    messageIds?: string | string[]
) {
    if (viewState) {
        const messagesToRemove = Array.isArray(messageIds)
            ? messageIds
            : messageIds
            ? [messageIds]
            : viewState.infoBarIds
            ? [...viewState.infoBarIds]
            : [];

        for (const messageId of messagesToRemove) {
            const index = viewState.infoBarIds && viewState.infoBarIds.indexOf(messageId);
            removeInfoBarMessageMutator(viewState, index, messageId);
        }
    }
}
