import {
    AttachmentSelectionSource,
    lazyPreviewBeautifulLinkImageInSxS,
    SxSReadingPaneInitializeMethod,
} from 'owa-attachment-preview-sxs-actions';
import { previewBeautifulLinkImageInSxS } from 'owa-compose-link';
import {
    previewBeautifulLinkImageInSxSFromReadingPane,
    verifyLinkData,
} from 'owa-doc-link-click-handler';
import {
    lazyGetLinksIdContainer,
    lazyUpdateLinkContainerIdOfLink,
    lazyUpdateLinkIds,
} from 'owa-link-data';
import { orchestrator } from 'satcheljs';
import { getPreviewImageLinkIdsFromNodeList } from '../utils/getPreviewImageLinkIdsFromNodeList';
import { trace } from 'owa-trace';

/**
 * This orchestrator simply calls a function that handles the logic for
 * previewing beautiful link images in SxS.
 */
orchestrator(previewBeautifulLinkImageInSxS, actionMessage => {
    lazyPreviewBeautifulLinkImageInSxS.importAndExecute(
        actionMessage.parentItemId,
        AttachmentSelectionSource.ComposeDocLink,
        {
            method: SxSReadingPaneInitializeMethod.CopyMailReadingPaneContainer,
        },
        null /* instrumentationContext */,
        actionMessage.linkId,
        actionMessage.readOnly,
        actionMessage.window,
        actionMessage.linksContainerId
    );
});

/**
 * The purpose of this orchestrator is to maintain the correct state in the owa-link-data store
 * when the users switch between Conversation Views in the non-compose scenario.
 *
 * Currently, this orchestrator solely supports the doc-SxS-BeautifulLinks-ODC feature
 * for ODC Image Links.
 */
orchestrator(verifyLinkData, async actionMessage => {
    const itemPartLinkContainerId: string = actionMessage.linksContainerId;
    try {
        const beautifulLinkIds: string[] = await getPreviewImageLinkIdsFromNodeList(
            actionMessage.allElements
        );

        /*
                This action updates the linkIds property in the linkIdContainer to the beautifulLinks
                currently being shown in the body. This ensures that the linkIds array is always up-to-date
                especially when the user toggles their conversation view.
            */
        const updateLinkIds = await lazyUpdateLinkIds.import();

        /*
                Condition is triggered when user switches from Conversation View being ON to OFF in OWA Settings.
                Specifically is triggered when there are multiple emails (itemParts) when Conversation View is ON.

                When Conversation View is ON and there are multiple emails (itemParts) and each of them become expanded,
                the contents within each email is processed. This includes the links. These links get associated with a
                linksContainerId which is the itemPart.itemId.Id.

                Then, when the user switches to Conversation View being OFF, all the content from every-email is now condensed
                into the body of the latest itemPart from when the Conversation View is ON. This itemPart is now being processed.
                The links in this itemPart that belonged to the non-latest itemPart when Conversation View was ON will have a different
                linksContainerId.

                How to trigger this case:
                Draft an email and send it to yourself. Include 2 unique beautiful link images. Send that email.
                Once that email arrives, reply to that email with 1 or more unique beautiful link images.
                Once the response is recieved, preview each link from each itemPart and notice the behaviour.
                Then, switch to Conversation View being OFF and preview each of the links and notice the behaviour.
            */
        if (itemPartLinkContainerId !== actionMessage.linkSharingInformation.linksContainerId) {
            const updateLinkContainerIdOfLink = await lazyUpdateLinkContainerIdOfLink.import();

            updateLinkContainerIdOfLink(
                actionMessage.linkSharingInformation,
                itemPartLinkContainerId
            );
            updateLinkIds(itemPartLinkContainerId, beautifulLinkIds);
        } else {
            const getLinksIdContainer = await lazyGetLinksIdContainer.import();

            const itemPartLinksIdArray: string[] = getLinksIdContainer(itemPartLinkContainerId)
                .linkIds;
            if (itemPartLinksIdArray.length > beautifulLinkIds.length) {
                // Condition is triggered when user switches from Conversation View being OFF to ON.

                updateLinkIds(itemPartLinkContainerId, beautifulLinkIds);
            } else if (itemPartLinksIdArray.length < beautifulLinkIds.length) {
                /*
                        This occurs when multiple itemParts in a conversation have had their content
                        put into 1 singular itemPart. In other words, when conversation view is toggled
                        from ON to OFF for a conversation.
                    */
                updateLinkIds(itemPartLinkContainerId, beautifulLinkIds);
            }
        }
    } catch (e) {
        trace.warn(`An unexpected error occured while verifying link data: ${e}`);
    }
});

/**
 * This orchestrator simply calls a function that handles the logic for
 * previewing BeautifulLink Images in SxS from the ReadingPane Scenario.
 *
 * The reason why another action was created was because the previewBeautifulLinkImageInSxS (old action)
 * action currently resides in owa-compose-link cannot be used/ called where the
 * previewBeautifulLinkImageInSxSFromReadingPane (new action) is called. This is because it introduces
 * a circular dependency.
 */
orchestrator(previewBeautifulLinkImageInSxSFromReadingPane, actionMessage => {
    lazyPreviewBeautifulLinkImageInSxS.importAndExecute(
        actionMessage.parentItemId,
        AttachmentSelectionSource.ReadingPaneDocLink,
        {
            method: SxSReadingPaneInitializeMethod.CopyMailReadingPaneContainer,
        },
        null /* instrumentationContext */,
        actionMessage.linkId,
        actionMessage.readOnly,
        actionMessage.window,
        actionMessage.parentItemId.Id // In compose scenario, a unique string serves as linksContainerId. However, in ReadingPane, the itemId.Id is the linksContainerId
    );
});
