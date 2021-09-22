import type Message from 'owa-service/lib/contract/Message';
import { saveWithAction } from './trySaveMessage';
import insertContentIntoEditor from '../utils/insertContentIntoEditor';
import buildReplyForwardMessageBody from '../utils/buildReplyForwardMessageBody';
import convertInlineCssForHtml from '../utils/convertInlineCssForHtml';
import createAppendOnSendBlock from '../utils/createAppendOnSendBlock';
import getFromViewState from '../utils/getFromViewState';
import shouldAlwaysShowFrom from '../utils/shouldAlwaysShowFrom';
import { logUsage } from 'owa-analytics';
import { lazyInitializeAttachments } from 'owa-attachment-well-data';
import { getUserMailboxInfo } from 'owa-client-ids';
import addInfoBarMessage from 'owa-info-bar/lib/actions/addInfoBarMessage';
import removeInfoBarMessage from 'owa-info-bar/lib/actions/removeInfoBarMessage';
import isPublicFolderComposeViewState from 'owa-mail-compose-store/lib/utils/isPublicFolderComposeViewState';
import isMeetingRequest from 'owa-meeting-message/lib/utils/isMeetingRequest';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { ContentPosition } from 'roosterjs-editor-types';
import { mutatorAction } from 'satcheljs';
import {
    getStore,
    ComposeViewState,
    ComposeOperation,
    AsyncSendState,
    SaveAndUpgradeTask,
} from 'owa-mail-compose-store';
import createSmartResponseItem from '../services/createSmartResponseItem';
import { lazyInitializeMessageExtensionCards } from 'owa-message-extension-cards';
import { isSearchMessageExtensionEnabled } from 'owa-message-extension-config';
import { isFeatureEnabled } from 'owa-feature-flags';
import disableSmartResponse from './disableSmartResponse';
import setVirtualEditContent from 'owa-editor-virtual-edit/lib/actions/setVirtualEditContent';

const UPGRADE_TIMEOUT = 5000;
const UPGRADE_CHANGE_SOURCE = 'UpgradeCompose';

const UpgradeCompletedDatapoint = 'UpgradeComposeCompleted';

export default async function upgradeCompose(
    viewState: ComposeViewState,
    task: SaveAndUpgradeTask
) {
    // Should do upgrade for full compose
    const shouldUpgrade = !viewState.isInlineCompose;
    const {
        itemToSave,
        groupId,
        suppressServerMarkReadOnReplyOrForward,
        remoteExecute,
        smimeQuotedBody,
    } = task;

    if (smimeQuotedBody) {
        const isForward = viewState.operation === ComposeOperation.Forward;
        setSmimeQuotedBody(viewState, smimeQuotedBody);
        insertContentIntoEditor(
            viewState,
            smimeQuotedBody /* htmlContent */,
            smimeQuotedBody /* plainTextContent */,
            ContentPosition.End /* insertContentPosition */,
            UPGRADE_CHANGE_SOURCE /* changeSource */,
            isForward /* dontSetFocusToEditor */
        );
        return;
    }

    let upgradeCompleted = false;
    let upgradeTimer: NodeJS.Timer = null;

    if (shouldUpgrade) {
        logUsage('UpgradeCompose');

        upgradeTimer = setTimeout(() => {
            // Make sure compose is not closed
            if (getStore().viewStates.has(viewState.composeId) && !upgradeCompleted) {
                // Add "quoted body will be loaded" infobar if quoted body is not loaded in time limit
                showUpgradeMessageInfobar(viewState);
                logUsage('UpgradeComposeTimedOut');
            }
        }, UPGRADE_TIMEOUT);
    }

    // Saving action is active until upgrade is complete, so that createAttachments is
    // paused on waitForActiveSaving if the itemId has not been retrieved yet. This
    // prevents double draft and inline images being created with the wrong itemId (VSO 33271)
    saveWithAction(
        viewState,
        createSmartResponseItem(
            itemToSave,
            groupId,
            suppressServerMarkReadOnReplyOrForward,
            remoteExecute
        ).then(message => {
            if (message) {
                applySaveResult(viewState, message);
                applyAttachments(viewState, message);
                applyMessageExtensionCard(viewState, message);
            }

            if (shouldUpgrade) {
                internalUpgradeCompose(viewState, message);
                upgradeCompleted = true;
                clearTimeout(upgradeTimer);
            }
        })
    );
}

const setSmimeQuotedBody = mutatorAction(
    'setSmimeQuotedBody',
    (viewState: ComposeViewState, smimeQuotedBody: string) => {
        viewState.quotedBody = smimeQuotedBody;
    }
);

const applySaveResult = mutatorAction(
    'Compose_ApplySmartRersponseResult',
    (viewState: ComposeViewState, message: Message) => {
        const { ItemId, Body, Subject, ItemClass, From } = message;

        viewState.itemId = ItemId;
        viewState.quotedBody = Body.Value;
        viewState.subject = Subject;

        const isForward = viewState.operation === ComposeOperation.Forward;
        if (isForward) {
            const meetingRequestItem = ItemClass && isMeetingRequest(ItemClass) ? message : null;
            viewState.meetingRequestItem = meetingRequestItem;

            if (shouldAlwaysShowFrom() && From) {
                viewState.fromViewState = getFromViewState(
                    From.Mailbox,
                    meetingRequestItem,
                    viewState.referenceItemId,
                    isPublicFolderComposeViewState(viewState)
                );
            }
        }
    }
);

function applyMessageExtensionCard(viewState: ComposeViewState, message: Message) {
    if (isSearchMessageExtensionEnabled() && viewState.messageExtensionCard) {
        lazyInitializeMessageExtensionCards.importAndExecute(
            viewState.messageExtensionCard,
            message
        );
    }
}

function applyAttachments(viewState: ComposeViewState, message: Message) {
    const { ItemId, Attachments } = message;

    if (Attachments) {
        lazyInitializeAttachments.importAndExecute(
            Attachments,
            getUserMailboxInfo(),
            viewState.attachmentWell,
            true /* forceUpdateAttachmentsInStore */,
            true /* isInitializationForCompose */,
            null,
            ItemId
        );
    }
}

async function internalUpgradeCompose(viewState: ComposeViewState, message: Message) {
    if (message) {
        // Upgrade compose if message isn't already sending
        // Otherwise, skip upgrade but alert the user the quoted body will be loaded
        if (viewState.asyncSendState == AsyncSendState.None && !viewState.isSending) {
            if (viewState.quotedBody) {
                const isForward = viewState.operation === ComposeOperation.Forward;
                const formattedQuotedBody = formatQuotedBody(viewState, isForward);
                if (isFeatureEnabled('cmp-virtual-edit') && viewState.bodyType == 'HTML') {
                    setVirtualEditContent(viewState, formattedQuotedBody);
                } else {
                    await insertContentIntoEditor(
                        viewState,
                        formattedQuotedBody /* htmlContent */,
                        formattedQuotedBody /* plainTextContent */,
                        ContentPosition.DomEnd /* insertContentPosition */,
                        UPGRADE_CHANGE_SOURCE /* changeSource */,
                        isForward /* dontSetFocusToEditor */
                    );
                    disableSmartResponse(viewState); // Quoted body is loaded, no need to use smart response now
                }
                removeInfoBarMessage(viewState, 'warningNoQuotedBody');
                logUsage(UpgradeCompletedDatapoint, [true]);
            }
        } else {
            // Add "quoted body will be loaded" infobar if upgrade should be skipped
            showUpgradeMessageInfobar(viewState);
            logUsage(UpgradeCompletedDatapoint, [false, 'messageAlreadySending']);
        }
    } else {
        // Add "original message can't be shown right now" infobar if quoted body is not loaded for smart response in full compose
        showFailureToShowOriginalMessageInfobar(viewState);
        logUsage(UpgradeCompletedDatapoint, [false, 'quotedBodyNotLoaded']);
    }

    // NOTE: createSmartResponseItem currently returns null in the case of failure
    // If this is changed, showFailureToShowOriginalMessageInfobar should be invoked in a catch
}

// There should be a new line above the quoted body (VSO 40399)
// This is already handled when:
// 1. The user has auto-signature enabled (see createSignatureBlock)
// 2. Replying in item view (see createReply > createReplyItem)
function formatQuotedBody(viewState: ComposeViewState, isForward: boolean) {
    const userConfig = getUserConfiguration();
    const isAutoSignature = userConfig?.UserOptions?.AutoAddSignatureOnReply;

    if (isAutoSignature || !isForward) {
        let quotedBody = convertInlineCssForHtml(viewState.quotedBody, viewState.bodyType);
        return createAppendOnSendBlock(viewState.bodyType) + quotedBody;
    }

    return buildReplyForwardMessageBody(viewState.quotedBody, viewState.bodyType);
}

function showUpgradeMessageInfobar(viewState: ComposeViewState) {
    addInfoBarMessage(viewState, 'warningNoQuotedBody');
}

function showFailureToShowOriginalMessageInfobar(viewState: ComposeViewState) {
    removeInfoBarMessage(viewState, 'warningNoQuotedBody');
    addInfoBarMessage(viewState, 'warningFailureToShowOriginalMessage');
}
