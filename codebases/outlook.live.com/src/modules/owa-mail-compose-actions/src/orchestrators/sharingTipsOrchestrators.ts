import findComposeViewStateById, { IdSource } from '../utils/findComposeViewStateById';
import { refreshSharingTips } from '../utils/refreshSharingTips';
import { logUsage } from 'owa-analytics';
import { refreshSharingTipsForAttachment } from 'owa-attachment-model-store';
import { removeSharingLinks } from 'owa-editor-link-plugin';
import { isNewLink, sharingLinkRemoved, getSharingLinkInfo, SharingLinkInfo } from 'owa-link-data';
import { lazyLogSharingTipChangesForLinkRemoval } from 'owa-sharing-data';
import { orchestrator } from 'satcheljs';

orchestrator(refreshSharingTipsForAttachment, actionMessage => {
    const viewState = findComposeViewStateById(actionMessage.attachmentId, IdSource.Attachment);
    if (viewState !== null) {
        refreshSharingTips(viewState);
    }
});

orchestrator(removeSharingLinks, async actionMessage => {
    if (actionMessage.linkIds.length < 1) {
        return;
    }
    const viewState = findComposeViewStateById(actionMessage.linkIds[0], IdSource.Link);

    if (viewState !== null) {
        const logSharingTipChanges = await lazyLogSharingTipChangesForLinkRemoval.import();
        actionMessage.linkIds.forEach(id => {
            const typeOfLink = isNewLink(id) ? 'newLink' : 'oldLink';
            const sharingLink: SharingLinkInfo = getSharingLinkInfo(id);
            sharingLinkRemoved(
                id,
                viewState.attachmentWell.sharingLinkIds,
                sharingLink.fileName,
                sharingLink.providerType,
                viewState.linksContainerId
            );
            logUsage(
                'SharingLinkDeleted',
                { isCalendar: false, providerType: sharingLink?.providerType },
                { cosmosOnlyData: id }
            );

            // Also log that sharing issues were fixed because of the link being removed
            logSharingTipChanges(id, typeOfLink);
        });
    }
});
