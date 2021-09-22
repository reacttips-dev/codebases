import { action } from 'satcheljs';

export const onNudgeRemoved = action('ON_NUDGE_REMOVED', (rowKey: string) => ({
    rowKey,
}));
