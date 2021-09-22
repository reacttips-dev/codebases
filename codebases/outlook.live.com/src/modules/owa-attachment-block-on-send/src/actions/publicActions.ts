import { action } from 'satcheljs';

export const setTelemetrySharingIssueState = action(
    'SET_SHARING_ISSUE_STATE',
    (
        composeId: string,
        sharingTipId: string,
        errorSource: string,
        totalLinkCount: number,
        newLinkCount: number
    ) => ({
        composeId,
        sharingTipId,
        errorSource,
        totalLinkCount,
        newLinkCount,
    })
);
