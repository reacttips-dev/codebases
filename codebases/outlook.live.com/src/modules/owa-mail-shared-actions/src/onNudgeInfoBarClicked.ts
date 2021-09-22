import { action } from 'satcheljs';

export enum NudgeInfoBarResponse {
    Dismiss = 0,
    MarkComplete = 1,
}

export const onNudgeInfoBarClicked = action(
    'onNudgeInfoBarClicked',
    (rowKey: string, itemId: string, response: NudgeInfoBarResponse) => ({
        rowKey,
        itemId,
        response,
    })
);
