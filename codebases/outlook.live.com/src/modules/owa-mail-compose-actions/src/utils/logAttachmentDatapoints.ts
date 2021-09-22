import { AttachmentFileType } from 'owa-attachment-file-types';
import { getExtensionWithoutDotFromFileNameForLogging, isImageFile } from 'owa-file';
import { ComposeViewState, ComposeOperation } from 'owa-mail-compose-store';
import {
    getSharingLinkInfo,
    SharingLinkInfo,
    AnchorElementsSource,
    isFluidFile,
} from 'owa-link-data';
import { isFeatureEnabled } from 'owa-feature-flags';
import { logUsage } from 'owa-analytics';
import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import safelyGetSmartReplyExtractionId from './safelyGetSmartReplyExtractionId';
import getAttachment from 'owa-attachment-model-store/lib/selectors/getAttachment';
import type ReferenceAttachment from 'owa-service/lib/contract/ReferenceAttachment';

interface AttachmentData {
    fileType: AttachmentFileType;
    isCloudy: boolean;
    extension: string;
    providerType: string;
}

interface LinkData {
    source: AnchorElementsSource;
    extension: string;
    providerType: number;
}

export function logAttachmentDatapoints(viewState: ComposeViewState) {
    // Attachment Count Information
    let classicAttachmentCount: number;
    let cloudyAttachmentCount: number;
    let linkInBodyCount: number;
    let imageClassicCount: number = 0;
    let imageCloudyCount: number = 0;
    let imageLinkCount: number = 0;
    let ODSPLinkInBodyCount: number = 0;
    let ODCLinkInBodyCount: number = 0;
    let smartDocCount: number;
    let attachmentsData: AttachmentData[];
    const linksData: LinkData[] = [];

    // attachmentWell and allAttachments are not typecast to avoid uneccesary imports into this package
    const attachmentWell = viewState.attachmentWell;
    if (attachmentWell) {
        const allAttachments: any[] = attachmentWell.docViewAttachments.concat(
            attachmentWell.imageViewAttachments
        );

        attachmentsData = allAttachments.map(attachment => {
            const attachmentModelContainer = getAttachment(attachment.attachmentId);
            const referenceAttachment = attachmentModelContainer.model as ReferenceAttachment;
            if (isImageFile(attachmentModelContainer.model.Name)) {
                if (attachment.isCloudy) {
                    imageCloudyCount++;
                } else {
                    imageClassicCount++;
                }
            }

            return {
                fileType: attachment.fileType,
                isCloudy: attachment.isCloudy,
                extension: getExtensionWithoutDotFromFileNameForLogging(
                    attachmentModelContainer.model.Name
                ),
                providerType: attachment.isCloudy ? referenceAttachment.ProviderType : '',
            };
        });

        // Cosmos only logs datapoints if each custom data field has at most 24 unique values.
        // We expect more than 23 attachments/links in body to be a rare situation, so we round down to 23
        // in this case to preserve the rest of the data.
        const MAX_COUNT: number = 23;
        classicAttachmentCount = Math.min(
            allAttachments.filter(attachment => !attachment.isCloudy).length,
            MAX_COUNT
        );
        cloudyAttachmentCount = Math.min(
            allAttachments.filter(attachment => attachment.isCloudy).length,
            MAX_COUNT
        );

        for (let i = 0; i < attachmentWell.sharingLinkIds.length; i++) {
            const sharingLink: SharingLinkInfo = getSharingLinkInfo(
                attachmentWell.sharingLinkIds[i]
            );

            if (sharingLink) {
                if (sharingLink.providerType === AttachmentDataProviderType.OneDrivePro) {
                    ODSPLinkInBodyCount++;
                }
                if (sharingLink.providerType === AttachmentDataProviderType.OneDriveConsumer) {
                    ODCLinkInBodyCount++;
                }
                if (isImageFile(sharingLink.fileName)) {
                    imageLinkCount++;
                }
                linksData.push({
                    source: sharingLink.source,
                    extension: getExtensionWithoutDotFromFileNameForLogging(sharingLink.fileName),
                    providerType: sharingLink.providerType,
                });
            }
        }

        ODSPLinkInBodyCount = Math.min(ODSPLinkInBodyCount, MAX_COUNT);
        ODCLinkInBodyCount = Math.min(ODCLinkInBodyCount, MAX_COUNT);

        linkInBodyCount = Math.min(attachmentWell.sharingLinkIds.length, MAX_COUNT);
        smartDocCount = Math.min(
            allAttachments.filter(attachment => attachment.fileType == AttachmentFileType.SmartDoc)
                .length,
            MAX_COUNT
        );

        if (isFeatureEnabled('cmp-prague')) {
            const fluidFilesCount = attachmentWell.sharingLinkIds.filter(id => {
                const sharingLink: SharingLinkInfo = getSharingLinkInfo(id);
                return isFluidFile(sharingLink?.fileName);
            }).length;

            if (fluidFilesCount > 1) {
                logUsage(
                    'MultipleFluidComponentsInserted',
                    {
                        // long term logging
                        numberOfFluidComponents_1: fluidFilesCount,
                    },
                    { isCore: true }
                );
            } else if (fluidFilesCount === 1) {
                logUsage('SingleFluidComponentsInserted', null /* custom data */, { isCore: true });
            }
        }
    }

    // Compose Operation Type Information
    const operation: ComposeOperation = viewState.operation;
    const isReply: boolean =
        operation == ComposeOperation.Reply || operation == ComposeOperation.ReplyAll;

    // Reference Item Id of the Previous Email, undefined if not reply/forward.
    const referenceItemId: string = viewState.referenceItemId?.Id;
    const cosmosOnlyDataString: string = JSON.stringify([
        {
            smartDocExtractionId: safelyGetSmartReplyExtractionId(viewState, 'smartDoc' /* type */),
            isReply: isReply,
            referenceItemId: referenceItemId,
            attachmentsData: attachmentsData,
            linksData: linksData,
        },
    ]);

    const allCloudyAreDoc: boolean = cloudyAttachmentCount > 0 && imageCloudyCount == 0;
    const allLinksAreDoc: boolean = linkInBodyCount > 0 && imageLinkCount == 0;
    logUsage(
        'AttachmentCountsOnMessageSent',
        [
            classicAttachmentCount,
            linkInBodyCount,
            cloudyAttachmentCount,
            smartDocCount,
            ODSPLinkInBodyCount,
            ODCLinkInBodyCount,
            imageClassicCount,
            imageCloudyCount,
            imageLinkCount,
            allCloudyAreDoc,
            allLinksAreDoc,
        ],
        {
            cosmosOnlyData: cosmosOnlyDataString,
            isCore: true,
            excludeFromKusto: true, // only log this datapoint to Cosmos and not to Aria to avoid over-populating Aria
        }
    );
}
