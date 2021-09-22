import { getItem } from 'owa-local-storage';

export const FindMessageParametersKey = 'sdmp';

export function getCachedReadingPanePosition(): number | undefined {
    try {
        const messageParams = getItem(window, FindMessageParametersKey);
        return messageParams ? JSON.parse(messageParams).InboxReadingPanePosition : undefined;
    } finally {
        return undefined;
    }
}
