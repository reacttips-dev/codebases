import type { ActionType } from 'owa-mail-actions/lib/triage/userMailInteractionAction';
import { logUsage } from 'owa-analytics';
import type { NudgedReason } from 'owa-mail-nudge-store';

export function logNudgeRemoved(
    rowKey: string,
    actionType: ActionType | string,
    nudgeReason?: NudgedReason
) {
    logUsage(
        'Nudge_RowRemove',
        {
            owa_1: actionType,
            owa_2: nudgeReason,
            rKey: rowKey,
        },
        {
            isCore: true,
        }
    );
}
