import type InfoBarMessageViewStateCreator from '../schema/InfoBarMessageViewStateCreator';
import type { InfoBarHostViewState } from '../schema/InfoBarMessageViewState';

export const infoBarMessageCreatorsMap: {
    // key can be a unique identifier to bucket messages (e.g. per item)
    [key: string]: { [messageId: string]: InfoBarMessageViewStateCreator };
} = {};

export default function getInfoBarMessageCreator(
    viewState: InfoBarHostViewState,
    messageId: string
): InfoBarMessageViewStateCreator {
    const key = viewState.infoBarHostKey;
    return infoBarMessageCreatorsMap[key]?.[messageId];
}
