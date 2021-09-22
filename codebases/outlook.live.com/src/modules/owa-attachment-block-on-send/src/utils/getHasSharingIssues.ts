import { logUsage } from 'owa-analytics';
import {
    AttachmentWellViewState,
    lazyGetLastCloudyAttachmentsSharingIssueForBlockOnSend,
} from 'owa-attachment-well-data';
import {
    InfoBarCustomAction,
    InfoBarMessageRank,
} from 'owa-info-bar/lib/schema/InfoBarMessageViewState';
import type InfoBarMessageViewStateCreator from 'owa-info-bar/lib/schema/InfoBarMessageViewStateCreator';
import {
    getSharingDataFromLink,
    isNewLink,
    lazyGetSharingTipRecipientInfo,
    RecipientContainer,
} from 'owa-link-data';
import loc, { format } from 'owa-localize';
import { composeGetHasSharingIssues } from 'owa-recipient-permission-checker';
import {
    getSharingTipIdsList,
    IdType,
    lazyGetInfoBarCreator,
    lazyGetSharingIssuesForSharingData,
    SharingData,
    SharingTipId,
    SharingTipInfo,
    SharingTipRecipientInfo,
} from 'owa-sharing-data';
import { setTelemetrySharingIssueState } from '../actions/publicActions';
import {
    sharingIssueSubTitle,
    sharingIssueSubTitleFromCloudyAttachment,
    sharingIssueSubTitleFromLink,
    MultipleWarningSharingCSLWithExternalRecipientsText,
} from './getHasSharingIssues.locstring.json';

const MAX_NUMBER_OF_LINKS_TO_LOG = 23;

interface SharingIssueAndCount {
    sharingTipInfo: SharingTipInfo;
    totalLinks: number;
    newLinks: number;
}

let getInfoBarCreator: (
    sharingData: SharingData[],
    sharingTipId: SharingTipId,
    recipientInfo: SharingTipRecipientInfo[],
    skipActionRecommendation: boolean,
    convertCloudyToClassicAction?: (id: IdType) => InfoBarCustomAction
) => InfoBarMessageViewStateCreator | null;
let getLastCloudyAttachmentsSharingIssueForBlockOnSend: (
    sharingTipIds: SharingTipId[],
    attachmentWellViewState: AttachmentWellViewState,
    recipientInfo: SharingTipRecipientInfo[],
    getInfoBarCreator: (
        sharingData: SharingData[],
        sharingTipId: SharingTipId,
        recipientInfo: SharingTipRecipientInfo[],
        skipActionRecommendation: boolean,
        convertCloudyToClassicAction?: (id: IdType) => InfoBarCustomAction
    ) => InfoBarMessageViewStateCreator | null
) => string;
// Export is for testing only, do not use outside this file.
export let getSharingTipRecipientInfo: (
    recipientContainers: RecipientContainer[],
    fromAddress: string
) => SharingTipRecipientInfo[] = null;
// Export is for testing only, do not use outside this file.
export let getSharingIssuesForSharingData: (
    sharingData: SharingData,
    recipientInfo: SharingTipRecipientInfo[]
) => SharingTipInfo[] = null;

export function getSharingLinkCountInBody(
    attachmentWell: AttachmentWellViewState | null | undefined
) {
    const linkIds = attachmentWell?.sharingLinkIds ? attachmentWell.sharingLinkIds : [];
    let newLinkCount = 0;
    linkIds.forEach(linkId => {
        if (isNewLink(linkId)) {
            newLinkCount++;
        }
    });

    return { linkInBodyCount: linkIds.length, newLinkCount: newLinkCount };
}

let withLinkSharingIssue: boolean = false; // used to cache the result from the last run of getHasSharingIssues
export function hasLinkSharingIssue(): boolean {
    return withLinkSharingIssue;
}

export async function getHasSharingIssues(
    infoBarIds: string[],
    attachmentWell: AttachmentWellViewState,
    fromAddress: string,
    recipientContainers: RecipientContainer[],
    isCalendar: boolean,
    logSharingIssueDatapoint: boolean = true
): Promise<boolean> {
    // log how many links are being sent. We want to do this even if we aren't checking for sharing issues
    const { linkInBodyCount, newLinkCount } = getSharingLinkCountInBody(attachmentWell);

    if (logSharingIssueDatapoint) {
        logUsage('ValidateSharingIssuesBeforeSend', {
            linkInBodyCount: Math.min(linkInBodyCount, MAX_NUMBER_OF_LINKS_TO_LOG),
            newLinkCount: Math.min(newLinkCount, MAX_NUMBER_OF_LINKS_TO_LOG),
        });
    }

    // If it hasn't been loaded, it means that either there is no sharing issues or it has failed to load.
    // Then we just return false as we don't want to delay the check for load failure.
    if (!lazyGetSharingTipRecipientInfo.isLoaded()) {
        return false;
    }

    composeGetHasSharingIssues(attachmentWell.composeId);
    const sharingTipIds: SharingTipId[] = getSharingTipIdsList();

    const refAttachmentSharingIssues = isCalendar
        ? []
        : infoBarIds.filter(id => (<string[]>sharingTipIds).indexOf(id) !== -1);

    if (!getSharingTipRecipientInfo) {
        getSharingTipRecipientInfo = await lazyGetSharingTipRecipientInfo.import();
    }

    let linkSharingIssues: SharingIssueAndCount[] = [];
    if (lazyGetSharingIssuesForSharingData.isLoaded()) {
        if (!getSharingIssuesForSharingData) {
            getSharingIssuesForSharingData = await lazyGetSharingIssuesForSharingData.import();
        }

        linkSharingIssues = getLinkSharingIssues(attachmentWell, fromAddress, recipientContainers);
    }

    withLinkSharingIssue = linkSharingIssues.length !== 0;
    return refAttachmentSharingIssues.length !== 0 || linkSharingIssues.length !== 0;
}

export async function preloadLazyImports() {
    if (!getLastCloudyAttachmentsSharingIssueForBlockOnSend) {
        getLastCloudyAttachmentsSharingIssueForBlockOnSend = await lazyGetLastCloudyAttachmentsSharingIssueForBlockOnSend.import();
    }

    if (!getInfoBarCreator) {
        getInfoBarCreator = await lazyGetInfoBarCreator.import();
    }
}

// Current export is for testing only. Do not use outside this file except in
// scenarios where you know everything that needs to be initialized will be.
export function getLinkSharingIssues(
    attachmentWell: AttachmentWellViewState,
    fromAddress: string,
    recipientContainers: RecipientContainer[]
): SharingIssueAndCount[] {
    let sharingIssueAndCount: SharingIssueAndCount[] = [];
    if (!getSharingTipRecipientInfo || !getSharingIssuesForSharingData) {
        return sharingIssueAndCount;
    }
    const linkIds = attachmentWell.sharingLinkIds;

    if (!linkIds || linkIds.length === 0) {
        return sharingIssueAndCount;
    }

    const sharingData: SharingData[] = linkIds.map(id => getSharingDataFromLink(id));
    const recipientInfo: SharingTipRecipientInfo[] = getSharingTipRecipientInfo(
        recipientContainers,
        fromAddress
    );

    sharingData.forEach(function (data) {
        if (data === null) {
            return;
        }

        const sharingIssues = getSharingIssuesForSharingData(data, recipientInfo).filter(
            issue => issue.messageRank === InfoBarMessageRank.Error
        );

        // We can safely cast the Id as a string because this function is link specific
        const isNew: boolean = isNewLink(<string>data.id);
        sharingIssues.forEach(issue => {
            sharingIssueAndCount = addIssueIntoArray(sharingIssueAndCount, issue, isNew);
        });
    });

    return sharingIssueAndCount;
}

function addIssueIntoArray(
    sharingIssueAndCount: SharingIssueAndCount[],
    sharingTipInfo: SharingTipInfo,
    isNewLink: boolean
): SharingIssueAndCount[] {
    let hasUpdated: boolean = false;
    sharingIssueAndCount.forEach(issue => {
        if (issue.sharingTipInfo.id === sharingTipInfo.id) {
            issue.totalLinks++;
            if (isNewLink) {
                issue.newLinks++;
            }
            hasUpdated = true;
        }
    });

    if (!hasUpdated) {
        sharingIssueAndCount = sharingIssueAndCount.concat({
            sharingTipInfo: sharingTipInfo,
            totalLinks: 1,
            newLinks: isNewLink ? 1 : 0,
        });
    }

    return sharingIssueAndCount;
}

export function getSharingIssuesString(
    infoBarIds: string[],
    attachmentWell: AttachmentWellViewState,
    fromAddress: string,
    recipientContainers: RecipientContainer[],
    composeId: string,
    isCalendar: boolean,
    isCollabSpace?: boolean
): string | null {
    if (!getSharingTipRecipientInfo) {
        logUsage('genericSharingIssueBlockOnSendLazyImportFailure');
        return loc(sharingIssueSubTitle);
    }

    const sharingTipIds: SharingTipId[] = getSharingTipIdsList();
    const refAttachmentSharingIssues = infoBarIds.filter(
        id => (<string[]>sharingTipIds).indexOf(id) !== -1
    );

    const linkSharingIssues: SharingIssueAndCount[] = getLinkSharingIssues(
        attachmentWell,
        fromAddress,
        recipientContainers
    );

    if (refAttachmentSharingIssues.length + linkSharingIssues.length === 1) {
        if (
            refAttachmentSharingIssues.length === 1 &&
            getInfoBarCreator &&
            getLastCloudyAttachmentsSharingIssueForBlockOnSend
        ) {
            const recipientInfo: SharingTipRecipientInfo[] = getSharingTipRecipientInfo(
                recipientContainers,
                fromAddress
            );
            const refAttachmentSharingIssue: string = getLastCloudyAttachmentsSharingIssueForBlockOnSend(
                sharingTipIds,
                attachmentWell,
                recipientInfo,
                getInfoBarCreator
            );
            if (refAttachmentSharingIssue) {
                if (isCalendar) {
                    logUsage('sharingIssueBlockOnSendFromCalendar', {
                        sharingTipId: refAttachmentSharingIssues[0],
                        errorSource: 'attachments',
                    });
                } else if (composeId) {
                    // issue triggered from mail, log the custom data into telemetry store and retrieve that later
                    setTelemetrySharingIssueState(
                        composeId,
                        refAttachmentSharingIssues[0], // sharingTipId
                        'attachments', // errorSource
                        null, // totalLinkCount
                        null // newLinkCount
                    );
                }
                return format(
                    loc(sharingIssueSubTitleFromCloudyAttachment),
                    refAttachmentSharingIssue
                );
            }
        } else if (linkSharingIssues.length === 1) {
            if (isCalendar) {
                logUsage('sharingIssueBlockOnSendFromCalendar', {
                    sharingTipId: linkSharingIssues[0].sharingTipInfo.id,
                    errorSource: 'links',
                    newLinks: Math.min(linkSharingIssues[0].newLinks, MAX_NUMBER_OF_LINKS_TO_LOG),
                    totalLinks: Math.min(
                        linkSharingIssues[0].totalLinks,
                        MAX_NUMBER_OF_LINKS_TO_LOG
                    ),
                });
            } else if (composeId) {
                // issue triggered from mail, log the custom data into telemetry store and retrieve that later
                setTelemetrySharingIssueState(
                    composeId,
                    linkSharingIssues[0].sharingTipInfo.id, // sharingTipId
                    'links', // errorSource
                    Math.min(linkSharingIssues[0].totalLinks, MAX_NUMBER_OF_LINKS_TO_LOG), // totalLinkCount
                    Math.min(linkSharingIssues[0].newLinks, MAX_NUMBER_OF_LINKS_TO_LOG) // newLinkCount
                );
            }

            let subTitleText: string = linkSharingIssues[0].sharingTipInfo.sharingTipString;
            if (
                linkSharingIssues[0].sharingTipInfo.id == SharingTipId.externalRecipientCSL &&
                linkSharingIssues[0].totalLinks > 1
            ) {
                subTitleText = MultipleWarningSharingCSLWithExternalRecipientsText;
            }

            return isCollabSpace
                ? subTitleText
                : format(loc(sharingIssueSubTitleFromLink), subTitleText);
        }
    } else if (refAttachmentSharingIssues.length + linkSharingIssues.length > 1) {
        let errorSource: string = 'linksAndAttachments';
        if (refAttachmentSharingIssues.length === 0) {
            errorSource = 'links';
        } else if (linkSharingIssues.length === 0) {
            errorSource = 'attachments';
        }

        let totalLinkCount = 0;
        let newLinkCount = 0;
        linkSharingIssues.forEach(issue => {
            totalLinkCount += issue.totalLinks;
            newLinkCount += issue.newLinks;
        });
        if (isCalendar) {
            logUsage('sharingIssueBlockOnSendFromCalendar', {
                sharingTipId: 'multiple',
                errorSource: errorSource,
                totalLinkCount: Math.min(totalLinkCount, MAX_NUMBER_OF_LINKS_TO_LOG),
                newLinkCount: Math.min(newLinkCount, MAX_NUMBER_OF_LINKS_TO_LOG),
            });
        } else if (composeId) {
            // issue triggered from mail, log the custom data into telemetry store and retrieve that later
            setTelemetrySharingIssueState(
                composeId,
                'multiple', // sharingTipId
                errorSource, // errorSource
                Math.min(totalLinkCount, MAX_NUMBER_OF_LINKS_TO_LOG), // totalLinkCount
                Math.min(newLinkCount, MAX_NUMBER_OF_LINKS_TO_LOG) // newLinkCount
            );
        }
        return loc(sharingIssueSubTitle);
    }

    return null;
}
