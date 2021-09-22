import openCompose from './openCompose';
import {
    ComposeViewState,
    ComposeOperation,
    ComposeTarget,
    getStore,
    SharedFolderComposeViewStateInitProps,
    ComposeViewStateInitProps,
} from 'owa-mail-compose-store';
import filterNdrSubmittedRecipients from '../utils/filterNdrSubmittedRecipients';
import { HTML_BODY_TYPE } from '../utils/getDefaultBodyType';
import tryGetSmimeViewState from '../utils/tryGetSmimeViewState';
import isEncryptionEnabled from 'owa-encryption-common/lib/utils/isEncryptionEnabled';
import { ClientItem, mailStore } from 'owa-mail-store';
import getItem from 'owa-mail-store/lib/services/getItem';
import { getComposeItemResponseShape } from 'owa-mail-compose-item-response-shape/lib/getComposeItemResponseShape';
import isMeetingRequest from 'owa-meeting-message/lib/utils/isMeetingRequest';
import { isDeepLink } from 'owa-url';
import type BodyType from 'owa-service/lib/contract/BodyType';
import type Message from 'owa-service/lib/contract/Message';
import type Item from 'owa-service/lib/contract/Item';
import { lazySetSmimePropertiesInDraftMessage } from 'owa-smime';
import SmimeType from 'owa-smime-adapter/lib/store/schema/SmimeType';
import doesItemNeedToBeFetchedAgain from 'owa-smime/lib/utils/doesItemNeedToBeFetchedAgain';
import getStampedHeaderForSmime from 'owa-smime/lib/utils/getStampedHeaderForSmime';
import isSMIMEItem from 'owa-smime/lib/utils/isSMIMEItem';
import { isSxSDisplayed, getActiveSxSId } from 'owa-sxs-store';
import {
    getStore as getTabStore,
    lazyActivateTab,
    TabType,
    primaryTab,
    TabViewState,
    TabState,
    MailComposeTabViewState,
} from 'owa-tab-store';
import { trace } from 'owa-trace';
import { action } from 'satcheljs/lib/legacy';
import isCLPEnabled from 'owa-mail-protection/lib/utils/clp/isCLPEnabled';
import getCLPLabelExtendedPropertyValue from 'owa-mail-protection/lib/utils/clp/getCLPLabelExtendedPropertyValue';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import {
    getFolderOwnerEmailAddress,
    getFolderPermission,
    getIsInSharedFolder,
} from '../utils/sharedFolderUtils';
import {
    getAppendOnSendFromExtendedProperty,
    getComposeTypeFromExtendedProperty,
} from 'owa-editor-addin-plugin-types/lib/utils/createAddinViewState';
import { isFeatureEnabled } from 'owa-feature-flags';
import popoutCompose from '../utils/popoutCompose';

export interface LoadDraftOptions {
    isNdrResend?: boolean;
    forceInsertSignatureOperation?: ComposeOperation;
}

/**
 * This function gets the draft message response from server.
 * For S/MIME clear/opaque signed mail we need to stamp X-OWA-SmimeInstalled header
 * in request api, in order to get the p7m file as attachment in draft message response
 * so that we can decode it and load it to compose.
 */
async function getItemResponse(itemId: string): Promise<Item | Error | null> {
    const cachedItem = mailStore.items.get(itemId);
    /**
     * If item is already present in mailStore, we can determine whether
     * it is an S/MIME item and thus get the appropriate S/MIME headers
     * for it.
     */
    const headers = await getStampedHeaderForSmime(cachedItem);
    // Pass null as body type to use original body type of the draft
    const shape = getComposeItemResponseShape(null /*bodyType*/);
    const message = await getItem(
        itemId,
        shape,
        'MailCompose',
        null /*requestServerVersion*/,
        undefined /*mailboxInfo*/,
        { headers }
    );
    if (message && !(message instanceof Error)) {
        /**
         * Item might need to be fetched again to get the p7m dataPackage in case this was a clear/opaque signed message,
         * but ItemClass was not known before the first fetch.
         * eg: in case of popout and deeplink
         */
        if (doesItemNeedToBeFetchedAgain(message as ClientItem)) {
            const headers = await getStampedHeaderForSmime(message as Message);
            return getItem(
                itemId,
                shape,
                'MailCompose',
                null /* requestServerVersion */,
                undefined /*mailboxInfo*/,
                {
                    headers,
                }
            );
        }
    }

    return message;
}

/**
 * This function merges the decoded S/MIME properties
 * to draftMessage and returns smimeType of the decoded
 * message which is used to initialize composeViewState
 *
 * @param message S/MIME message to decode.
 * @return SmimeType of the decoded message.
 */
function processSmimeProperties(message: Message): Promise<SmimeType> {
    return lazySetSmimePropertiesInDraftMessage
        .import()
        .then(setSmimePropertiesInDraftMessage => setSmimePropertiesInDraftMessage(message));
}

export default action('loadDraftToCompose')(async function loadDraftToCompose(
    itemId: string,
    sxsId: string,
    openTarget: ComposeTarget = ComposeTarget.SecondaryTab,
    options?: LoadDraftOptions
) {
    sxsId = sxsId || getActiveSxSId(window);
    const { isNdrResend, forceInsertSignatureOperation } = options || {};
    // 1. Adjust open target
    if (openTarget == ComposeTarget.Popout) {
        // no op, always respect the setting
    } else if (isSxSDisplayed(sxsId)) {
        // When SxS is opened, always open in SxS and override the setting
        openTarget = ComposeTarget.SxS;
    } else if (!isDeepLink() && openTarget === ComposeTarget.SecondaryTab) {
        // no op, tab view is available, so respect the setting
    } else {
        openTarget = ComposeTarget.PrimaryReadingPane;
    }

    // 2. try to reuse existing compose tab if any
    if (
        openTarget === ComposeTarget.PrimaryReadingPane ||
        openTarget === ComposeTarget.SecondaryTab ||
        (isFeatureEnabled('mail-popout-projection') && openTarget === ComposeTarget.Popout)
    ) {
        const [tab, composeViewState] = findProperTabByDraftItemId(itemId);
        if (tab && composeViewState) {
            if (tab.state != TabState.Popout && openTarget === ComposeTarget.Popout) {
                popoutCompose(composeViewState);
                return;
            } else {
                // If there is a tab for this draft, activate it
                await lazyActivateTab.importAndExecute(tab);
                return;
            }
        }
    }

    // 3. Start load draft
    try {
        const responseMessage = await getItemResponse(itemId);
        if (responseMessage && !(responseMessage instanceof Error)) {
            const message = responseMessage as Message;
            let smimeType: SmimeType = SmimeType.None;
            if (isSMIMEItem(message)) {
                smimeType = await processSmimeProperties(message);
            }
            const bodyType: BodyType = message.Body.BodyType == HTML_BODY_TYPE ? 'HTML' : 'Text';

            const isInlineCompose = false;
            const isInSharedFolder = getIsInSharedFolder(message.ItemId);
            const conversationId = !!message.ConversationId ? message.ConversationId.Id : undefined;
            let existingLabelString = '';
            if (isCLPEnabled()) {
                existingLabelString = getCLPLabelExtendedPropertyValue(message);
            }
            // Populate rootItemId for each attachment since it's not populated in getItem response
            message.Attachments &&
                message.Attachments.forEach(attachment => {
                    attachment.AttachmentId.RootItemId = itemId;
                });

            let composeInitProps: ComposeViewStateInitProps = {
                operation: ComposeOperation.EditDraft,
                forceInsertSignatureOperation: forceInsertSignatureOperation,
                bodyType: bodyType,
                itemId: message.ItemId,
                subject: message.Subject,
                newContent: message.Body.Value,
                to:
                    isNdrResend && message.ToRecipients
                        ? filterNdrSubmittedRecipients(message.ToRecipients)
                        : message.ToRecipients,
                cc: message.CcRecipients,
                bcc: message.BccRecipients,
                attachments: message.Attachments,
                importance: message.Importance,
                isReadReceiptRequested: message.IsReadReceiptRequested,
                isDeliveryReceiptRequested: message.IsDeliveryReceiptRequested,
                preferAsyncSend: true,
                from: message.From != null ? message.From.Mailbox : null,
                pendingSocialActivityTags: message.PendingSocialActivityTagIds,
                IRMData: isEncryptionEnabled() ? message.RightsManagementLicenseData : null,
                meetingRequestItem:
                    isMeetingRequest(message.ItemClass) != null ? { ...message } : null,
                sensitivity: message.Sensitivity,
                isInlineCompose: isInlineCompose,
                conversationId: conversationId,
                smimeViewState: await tryGetSmimeViewState(
                    ComposeOperation.EditDraft,
                    message,
                    smimeType
                ),
                existingLabelString: existingLabelString,
                appendOnSend: getAppendOnSendFromExtendedProperty(message),
                draftComposeType: getComposeTypeFromExtendedProperty(message),
                referenceItemId: message.ParentMessageId,
            };

            if (isInSharedFolder) {
                composeInitProps = <SharedFolderComposeViewStateInitProps>{
                    ...composeInitProps,
                    isInSharedFolder: true,
                    folderOwnerEmailAddress: getFolderOwnerEmailAddress(message.ItemId),
                    folderPermission: getFolderPermission(message.ItemId),
                };
            }

            if (openTarget === ComposeTarget.SxS) {
                openCompose(composeInitProps, openTarget, sxsId);
            } else {
                openCompose(composeInitProps, openTarget);
            }
        }
    } catch (error) {
        // TODO: handle error. Add S/MIME Draft infobars
        trace.info(`[loadDraftToCompose] ${error.message}`);
    }
});

/**
 * If we have already opened the draft item in a tab, either in inline compose or full compose,
 * we should not open a new compose for it, but just reuse the existing one
 */
function findProperTabByDraftItemId(draftItemId: string): [TabViewState, ComposeViewState] {
    const composeStore = getStore();
    let composeViewState: ComposeViewState;
    composeStore.viewStates.forEach(vs => {
        if (vs.itemId && vs.itemId.Id == draftItemId) {
            composeViewState = vs;
        }
    });

    if (composeViewState) {
        const tabs = getTabStore().tabs;
        const composeId = composeViewState.composeId;

        if (composeId == composeStore.primaryComposeId) {
            // First, check if compose is already opened in primary tab
            return [primaryTab, composeViewState];
        } else if (composeViewState.isInlineCompose) {
            // Second, try to find reading pane which has inline compose opened with this draft item
            return [
                tabs.filter(
                    tab =>
                        tab.type == TabType.SecondaryReadingPane &&
                        tab.data.id &&
                        ((tab.data.listViewType == ReactListViewType.Conversation &&
                            tab.data.id.Id == composeViewState.conversationId) ||
                            (tab.data.listViewType == ReactListViewType.Message &&
                                tab.data.id.Id == composeViewState.referenceItemId.Id))
                )[0],
                composeViewState,
            ];
        } else {
            // Third, try to find full compose tab with this draft item id
            const tab = tabs.filter(
                tab => tab.type == TabType.MailCompose && tab.data == composeId
            )[0] as MailComposeTabViewState;
            return [tab, tab && getStore().viewStates.get(tab.data)];
        }
    }

    // Last, null of the above case, returns null
    return [null, null];
}
