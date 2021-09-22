import type { AttachmentWellViewState } from 'owa-attachment-well-data';
import getConversationReadingPaneViewState from '../utils/getConversationReadingPaneViewState';
import mailStore from 'owa-mail-store/lib/store/Store';
import type Message from 'owa-service/lib/contract/Message';
import { getAttachmentWellViewStateByItemIdHelper } from 'owa-sxs-store/lib/utils/getAttachmentWellViewStateByItemIdHelper';

// get the attachmentWellViewState from itemId, where itemId is the unqiue identifier for each conversation in the conversation reading pane
function getAttachmentWellViewStateByItemId(
    conversationId: string,
    itemId: string
): AttachmentWellViewState {
    const message: Message = mailStore.items.get(itemId) as Message;
    if (!!message) {
        const nodeId = message.InternetMessageId;
        const itemPart = getConversationReadingPaneViewState(conversationId)?.itemPartsMap.get(
            nodeId
        );
        return !!itemPart ? itemPart.attachmentWell : null;
    }
    return null;
}

export default function registerGetAttachmentWellViewStateByItemHelper() {
    getAttachmentWellViewStateByItemIdHelper.register(getAttachmentWellViewStateByItemId);
}
