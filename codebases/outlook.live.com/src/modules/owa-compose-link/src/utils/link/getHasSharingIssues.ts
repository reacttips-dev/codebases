import { InfoBarMessageRank } from 'owa-info-bar/lib/schema/InfoBarMessageViewState';
import {
    getSharingDataFromLink,
    lazyGetSharingTipRecipientInfo,
    RecipientContainer,
} from 'owa-link-data';
import {
    lazyGetSharingIssuesForSharingData,
    SharingTipRecipientInfo,
    SharingTipInfo,
} from 'owa-sharing-data';
import { SharingIssueLevel } from './SharingIssueLevel';

export function getHasSharingIssues(
    linkId: string,
    getRecipientWells: () => RecipientContainer[],
    fromAddress: string
): SharingIssueInfo {
    const recipientWells = getRecipientWells();
    const sharingData = getSharingDataFromLink(linkId);

    // We do not check for sharing issues unless the link is beautified and the feature is enabled
    if (sharingData === null) {
        return { sharingIssueLevel: SharingIssueLevel.None, sharingIssues: null };
    }
    const getSharingTipRecipientInfo = lazyGetSharingTipRecipientInfo.tryImportForRender();
    const getSharingIssuesForSharingData = lazyGetSharingIssuesForSharingData.tryImportForRender();

    let recipientInfo: SharingTipRecipientInfo[] = [];
    if (getSharingTipRecipientInfo && getSharingIssuesForSharingData) {
        recipientInfo = getSharingTipRecipientInfo(recipientWells, fromAddress);

        const sharingIssues = getSharingIssuesForSharingData(sharingData, recipientInfo);
        if (sharingIssues && sharingIssues.length > 0) {
            if (sharingIssues.some(issue => issue.messageRank === InfoBarMessageRank.Error)) {
                return {
                    sharingIssueLevel: SharingIssueLevel.Error,
                    sharingIssues: sharingIssues,
                };
            }
            return { sharingIssueLevel: SharingIssueLevel.Warning, sharingIssues: null };
        }
    }

    return { sharingIssueLevel: SharingIssueLevel.None, sharingIssues: null };
}

export interface SharingIssueInfo {
    sharingIssueLevel: SharingIssueLevel;
    sharingIssues: SharingTipInfo[] | null;
}
