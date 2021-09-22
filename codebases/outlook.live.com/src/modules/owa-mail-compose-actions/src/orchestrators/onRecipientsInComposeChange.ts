import updateMailTipsForRecipients from '../actions/updateMailTipsForRecipients';
import { ComposeViewState, ComposeOperation, GroupComposeViewState } from 'owa-mail-compose-store';
import getCurrentComposeViewState from '../utils/findComposeFromRecipientWell';
import getRelativeComplementOfComposeRecipients from '../utils/getRelativeComplementOfComposeRecipients';
import getRecipientWellValues from '../utils/getRecipientWellValues';
import { getSharingTipRecipientInfoFromComposeViewState } from '../utils/getSharingTipRecipientInfoFromComposeViewState';
import {
    getTextPredictionFlightState,
    TextPredictionViaSCPlugin,
} from 'owa-proofing-option/lib/utils/getTextPredictionFlightState';
import { refreshSharingTips } from '../utils/refreshSharingTips';
import {
    lazyOnLaunchEventTriggered,
    lazyTriggerRecipientsChangedEvent,
    getComposeHostItemIndex,
} from 'owa-addins-core';
import { isCloudyAttachmentType } from 'owa-attachment-model-store/lib/utils/isCloudyAttachment';
import { updateRecipientsForSmartCompose } from 'owa-editor-smartcompose-plugin';
import triggerPolicyTips from '../actions/triggerPolicyTips';
import trySaveMessage from '../actions/trySaveMessage';
import { getStore } from 'owa-mail-store/lib/store/Store';
import { isPolicyTipsEnabled } from 'owa-policy-tips/lib/utils/isPolicyTipsEnabled';
import addRecipientsToRecipientWell from 'owa-recipient-common/lib/actions/addRecipientsToRecipientWell';
import onRecipientsChanged from 'owa-readwrite-recipient-well/lib/actions/onRecipientsChanged';
import removeRecipientFromRecipientWell from 'owa-recipient-common/lib/actions/removeRecipientFromRecipientWell';
import setRecipientsOnRecipientWell from 'owa-recipient-common/lib/actions/setRecipientsOnRecipientWell';
import reorderRecipientsInRecipientWell from 'owa-recipient-common/lib/actions/reorderRecipientsInRecipientWell';
import type ReadWriteRecipientViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';
import type ReadWriteRecipientWellViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientWellViewState';
import type RecipientWellWithFindControlViewState from 'owa-recipient-types/lib/types/RecipientWellWithFindControlViewState';
import { getReadWriteRecipientViewStateFromFindRecipientPersonaType } from 'owa-recipient-create-viewstate/lib/util/getReadWriteRecipientViewStateFromFindRecipientPersonaType';
import { lazyTryCheckPermForLinks } from 'owa-recipient-permission-checker';
import EventTrigger from 'owa-service/lib/contract/EventTrigger';
import getAttachmentPolicy from 'owa-session-store/lib/utils/getAttachmentPolicy';
import type { SharingTipRecipientInfo } from 'owa-sharing-data';
import { orchestrator } from 'satcheljs';
import type { RecipientsCollection } from '../schema/RecipientsCollection';
import { LazyOnUpdateRecipientsInCompose } from 'owa-recent-attachment-pills';
import isRecipientWellWithFindControlViewState from 'owa-readwrite-recipient-well/lib/utils/isRecipientWellWithFindControlViewState';
import removeInfoBarMessage from 'owa-info-bar/lib/actions/removeInfoBarMessage';
import { isAttachmentOfReferenceType } from 'owa-attachment-type/lib/isAttachmentOfReferenceType';
import { isFeatureEnabled } from 'owa-feature-flags';
import LaunchEventType from 'owa-service/lib/contract/LaunchEventType';

const NO_RECIPIENTS_MESSAGEID = 'errorMessageNoRecipentsMailCanNotBeSend';

// Exported for testing purposes only
export const composeIdsWithActedOnMostRecentAttachmentMessage: string[] = [];

export function removeComposeIdFromActedOnMostRecentAttachmentList(composeId: string) {
    const index = composeIdsWithActedOnMostRecentAttachmentMessage.indexOf(composeId);
    if (index !== -1) {
        composeIdsWithActedOnMostRecentAttachmentMessage.splice(index, 1);
    }
}

orchestrator(addRecipientsToRecipientWell, actionMessage => {
    const { newRecipients, recipientWell } = actionMessage;
    if (!isRecipientWellWithFindControlViewState(recipientWell)) {
        return;
    }

    if (isPolicyTipsEnabled()) {
        updatePolicyTips(recipientWell);
    }

    updateMailtips(recipientWell, newRecipients);
});

orchestrator(reorderRecipientsInRecipientWell, actionMessage => {
    const { newRecipients, recipientWell } = actionMessage;
    if (!isRecipientWellWithFindControlViewState(recipientWell)) {
        return;
    }

    if (isPolicyTipsEnabled()) {
        updatePolicyTips(recipientWell);
    }

    updateMailtips(recipientWell, newRecipients);
});

orchestrator(removeRecipientFromRecipientWell, actionMessage => {
    const { recipientWellRecipients } = actionMessage;

    updateInfoBarMessages(recipientWellRecipients);

    if (isPolicyTipsEnabled()) {
        updatePolicyTips(recipientWellRecipients);
    }
});

orchestrator(setRecipientsOnRecipientWell, actionMessage => {
    const { recipientWell, newRecipients } = actionMessage;
    if (isPolicyTipsEnabled()) {
        updatePolicyTips(recipientWell);
    }

    updateMailtips(recipientWell, newRecipients);

    const viewState = getCurrentComposeViewState(recipientWell);
    if (viewState) {
        // To handle recipient add from my contacts
        handleRecipientChangeEventForAddin(recipientWell, viewState);
    }
});

orchestrator(onRecipientsChanged, async actionMessage => {
    const { recipientWellRecipients, recipientData } = actionMessage;
    if (recipientData) {
        const recipients: ReadWriteRecipientViewState[] = recipientData.map(entry =>
            getReadWriteRecipientViewStateFromFindRecipientPersonaType(entry.newPersona)
        );

        recipients.forEach(newRecipient => {
            updateInfoBarMessages(recipientWellRecipients, newRecipient.displayText);
        });
    }

    const viewState = getCurrentComposeViewState(recipientWellRecipients);
    if (viewState) {
        // To handle recipient add/delete other than add from my contacts
        handleRecipientChangeEventForAddin(recipientWellRecipients, viewState);

        const recipientInfos: SharingTipRecipientInfo[] = await getSharingTipRecipientInfoFromComposeViewState(
            viewState
        );
        lazyTryCheckPermForLinks.importAndExecute(
            viewState.attachmentWell.sharingLinkIds,
            recipientInfos,
            viewState.composeId,
            false /* isCalendar */
        );
        refreshSharingTips(viewState);
    }

    if (getTextPredictionFlightState() & TextPredictionViaSCPlugin) {
        updateRecipientsForSmartCompose.importAndExecute(recipientWellRecipients.recipients);
    }
});

function updateMailtips(
    recipientWell: RecipientWellWithFindControlViewState,
    recipients: ReadWriteRecipientViewState[]
) {
    const composeViewState: ComposeViewState = getCurrentComposeViewState(recipientWell);
    if (!composeViewState) {
        return;
    }

    updateMailTipsForRecipients(composeViewState.composeId, recipientWell, recipients);
}

function updatePolicyTips(recipientWell: ReadWriteRecipientWellViewState) {
    const currentViewState: ComposeViewState = getCurrentComposeViewState(recipientWell);
    if (!currentViewState) {
        return;
    }

    triggerPolicyTips(currentViewState, EventTrigger.RecipientWell);
}

export async function updateInfoBarMessages(
    recipientWell: ReadWriteRecipientWellViewState,
    newRecipientName?: string
) {
    const currentViewState: ComposeViewState = getCurrentComposeViewState(recipientWell);
    if (!currentViewState) {
        return;
    }

    //If in groups, we may not have a saved draft message yet. Save it before going ahead to avoid attachment creation failure.
    if (!currentViewState.itemId && (currentViewState as GroupComposeViewState).groupId) {
        await trySaveMessage(currentViewState);
    }

    const recipients: RecipientsCollection = getRecipientWellValues(currentViewState);
    if (newRecipientName) {
        removeNoRecipientsError(currentViewState);
        updateIncludeMostRecentAttachmentsMessage(currentViewState, recipients, newRecipientName);
    } else {
        updateIncludeMostRecentAttachmentsMessage(currentViewState, recipients);
    }
}

function removeNoRecipientsError(viewState: ComposeViewState) {
    // VSO 28792: When adding a recipient, remove the no recipients error message if this exists
    removeInfoBarMessage(viewState, [NO_RECIPIENTS_MESSAGEID]);
}

// Exported for testing purposes only
export function updateIncludeMostRecentAttachmentsMessage(
    viewState: ComposeViewState,
    recipients: RecipientsCollection,
    newRecipientName?: string
) {
    if (viewState.referenceItemId) {
        const item = getStore().items.get(viewState.referenceItemId.Id);
        if (
            item?.HasAttachments &&
            !hasUserActedOnIncludeMostRecentAttachmentsMessage(viewState.composeId)
        ) {
            const addedRecipientsInCompose: string[] = getRelativeComplementOfComposeRecipients(
                recipients,
                item
            );
            const filteredAttachmentsBasedOnAttachmentPolicy = item.Attachments
                ? item.Attachments.filter(attachment =>
                      filterAttachmentsBasedOnAttachmentPolicy(attachment)
                  )
                : [];
            const filterInlineAttachments = filteredAttachmentsBasedOnAttachmentPolicy.filter(
                attachment => {
                    return !(attachment.IsInline && !isAttachmentOfReferenceType(attachment));
                }
            );
            const numberOfAddedRecipientsInCompose: number = addedRecipientsInCompose.length;
            const hasValidAttachments =
                item.HasAttachments && filteredAttachmentsBasedOnAttachmentPolicy.length > 0;
            const recipientName =
                numberOfAddedRecipientsInCompose === 1
                    ? addedRecipientsInCompose[0]
                    : newRecipientName;
            const shouldIncludeRecentAttachmentsSuggestion: boolean = shouldIncludeMostRecentAttachmentsInfoBarMessage(
                viewState,
                hasValidAttachments,
                numberOfAddedRecipientsInCompose
            );
            if (shouldIncludeRecentAttachmentsSuggestion) {
                LazyOnUpdateRecipientsInCompose.importAndExecute(
                    numberOfAddedRecipientsInCompose,
                    recipientName,
                    viewState.composeId,
                    filterInlineAttachments.map(attachment => {
                        return attachment?.AttachmentId;
                    })
                );
            }
        }
    }
}

export function filterAttachmentsBasedOnAttachmentPolicy(attachment): boolean {
    const attachmentPolicy = getAttachmentPolicy();
    return isCloudyAttachmentType(attachment)
        ? attachmentPolicy.ReferenceAttachmentsEnabled &&
              !isFeatureEnabled('doc-deprecateCloudyNoSecondPanelSplitButton') &&
              !isFeatureEnabled('doc-deprecateCloudyAttachments')
        : attachmentPolicy.ClassicAttachmentsEnabled;
}

// Exported for testing purposes only
export function shouldIncludeMostRecentAttachmentsInfoBarMessage(
    viewState: ComposeViewState,
    parentMessageHasAttachments: boolean,
    numberOfDistinctRecipientsAdded: number
) {
    const composeOperation: ComposeOperation = viewState.operation;

    return (
        parentMessageHasAttachments &&
        (composeOperation === ComposeOperation.Reply ||
            composeOperation === ComposeOperation.ReplyAll ||
            composeOperation === ComposeOperation.EditDraft)
    );
}

function hasUserActedOnIncludeMostRecentAttachmentsMessage(composeId: string) {
    return composeIdsWithActedOnMostRecentAttachmentMessage.indexOf(composeId) !== -1;
}

// Exported for testing reason only
export const updateActedComposeHandler = (composeId: string) => () => {
    composeIdsWithActedOnMostRecentAttachmentMessage.push(composeId);
};

function handleRecipientChangeEventForAddin(
    recipientWellRecipients: ReadWriteRecipientWellViewState,
    viewState: ComposeViewState
) {
    const hostItemIndex = getComposeHostItemIndex(viewState.composeId);
    const result = {
        to: recipientWellRecipients === viewState.toRecipientWell,
        cc: recipientWellRecipients === viewState.ccRecipientWell,
        bcc: recipientWellRecipients === viewState.bccRecipientWell,
    };

    if (
        isFeatureEnabled('addin-autoRun') &&
        isFeatureEnabled('addin-autoRun-recipientsAttendeesChangeEvent')
    ) {
        lazyOnLaunchEventTriggered.importAndExecute(
            hostItemIndex,
            LaunchEventType.OnMessageRecipientsChanged,
            { type: 'olkRecipientsChanged', changedRecipientFields: result }
        );
    }

    lazyTriggerRecipientsChangedEvent
        .import()
        .then(triggerRecipientsChangedEvent =>
            triggerRecipientsChangedEvent(hostItemIndex, result)
        );
}
