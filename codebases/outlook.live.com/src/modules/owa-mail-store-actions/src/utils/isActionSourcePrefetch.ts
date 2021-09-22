import type { LoadConversationItemActionSource } from 'owa-mail-store';

export default function isActionSourcePrefetch(
    actionSource: LoadConversationItemActionSource
): boolean {
    const prefetchActionSources = [
        'PrefetchFirstN',
        'PrefetchSingleRow',
        'PrefetchRowInCache',
        'PrefetchAdjacentRowsOnDelay',
        'LoadNudgedConversation',
    ];

    return prefetchActionSources.includes(actionSource);
}
