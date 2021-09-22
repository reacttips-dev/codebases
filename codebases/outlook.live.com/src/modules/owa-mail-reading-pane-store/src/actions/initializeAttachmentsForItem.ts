import { lazyGetAccessIssuesForAttachments } from 'owa-attachment-policy-access-issue-checker';
import {
    lazyGetAttachmentWellInitialValue,
    lazyInitializeAttachments,
    lazyReinitializeAttachments,
    AttachmentWellViewState,
} from 'owa-attachment-well-data';
import type { ClientItem } from 'owa-mail-store';
import getSmimeAttachmentType from 'owa-smime/lib/utils/getSmimeAttachmentType';
import isSmimeDecoded from 'owa-smime/lib/utils/isSmimeDecoded';
import isSMIMEItem from 'owa-smime/lib/utils/isSMIMEItem';
import { mutatorAction } from 'satcheljs';
import type ItemViewState from '../store/schema/ItemViewState';
import registerGetAttachmentWellViewStateByItemHelper from '../utils/registerGetAttachmentWellViewStateByItemHelper';
import addInfoBarMessage from 'owa-info-bar/lib/actions/addInfoBarMessage';

export default async function initializeAttachmentsForItem(
    itemViewState: ItemViewState,
    item: ClientItem,
    reinitialize: boolean = false
) {
    if (
        !item ||
        (isSMIMEItem(item) && !showSMIMEAttachments(itemViewState, item)) ||
        !item.Attachments
    ) {
        return;
    }

    if (!itemViewState.attachmentWell) {
        const getAttachmentWellInitialValue = await lazyGetAttachmentWellInitialValue.import();
        setAttachmentWellForItem(
            itemViewState,
            getAttachmentWellInitialValue(
                true /*isReadOnly*/,
                false /*isInitialized*/,
                '' /*composeId is empty in read only mode*/
            )
        );
    }

    registerGetAttachmentWellViewStateByItemHelper();

    if (reinitialize) {
        await lazyReinitializeAttachments.importAndExecute(
            item.Attachments,
            item.MailboxInfo,
            itemViewState.attachmentWell,
            true /* forceUpdateAttachmentsInStore */,
            null /* unsupportedMenuActions */,
            null /* parentItemId */,
            !!item.RightsManagementLicenseData /* isMessageEncrypted */,
            isSMIMEItem(item),
            isProtectedUMVoiceMessageItemClass(item.ItemClass)
        );
    } else {
        await lazyInitializeAttachments.importAndExecute(
            item.Attachments,
            item.MailboxInfo,
            itemViewState.attachmentWell,
            true /* forceUpdateAttachmentsInStore */,
            false /* isInitializationForCompose */,
            null /* unsupportedMenuActions */,
            null /* parentItemId */,
            !!item.RightsManagementLicenseData /* isMessageEncrypted */,
            isSMIMEItem(item),
            isProtectedUMVoiceMessageItemClass(item.ItemClass)
        );
    }

    const getAccessIssuesForAttachments = await lazyGetAccessIssuesForAttachments.import();
    const infoBarIds = getAccessIssuesForAttachments(item.Attachments);
    infoBarIds.forEach(id => addInfoBarMessage(itemViewState, id));
}

const setAttachmentWellForItem = mutatorAction(
    'setAttachmentWellForItem',
    (itemViewState: ItemViewState, viewState: AttachmentWellViewState) => {
        itemViewState.attachmentWell = viewState;
    }
);

function showSMIMEAttachments(itemViewState: ItemViewState, item: ClientItem): boolean {
    // If the attachment type is not smime, it means this is not of p7m format and it should be treated as normal attachment and we should allow initialization
    if (!getSmimeAttachmentType(item)) {
        return true;
    }
    // For smime attachment types, we support them only in message view and after they have been decoded
    if (!itemViewState.isConversationItemPart && isSmimeDecoded(item)) {
        return true;
    }
    return false;
}

function isProtectedUMVoiceMessageItemClass(itemClass: string) {
    switch (itemClass) {
        case 'IPM.Note.rpmsg.Microsoft.Voicemail.UM.CA':
        case 'IPM.Note.rpmsg.Microsoft.Voicemail.UM':
            return true;
        default:
            return false;
    }
}
