import type { InfoBarHostViewState } from '../schema/InfoBarMessageViewState';

export default function createInfoBarHostViewState(
    hostKey?: string,
    infoBarIds?: string[]
): InfoBarHostViewState {
    return {
        infoBarIds: infoBarIds || [],
        infoBarHostKey: hostKey || '0',
    };
}
