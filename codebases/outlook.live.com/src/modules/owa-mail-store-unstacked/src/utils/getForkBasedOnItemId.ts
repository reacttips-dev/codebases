import type { ConversationFork } from 'owa-graph-schema';

export default function getForkBasedOnItemId(
    forkItemId: string,
    forks: ConversationFork[]
): ConversationFork | null {
    for (let i = 0; i < forks.length; i++) {
        if (forks[i].id == forkItemId) {
            return forks[i];
        }
    }

    return null;
}
