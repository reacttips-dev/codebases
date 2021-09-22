import ApiItemTypeEnum from './ApiItemTypeEnum';
import type InitialData from './InitialData';
import type { MessageComposeAdapter } from 'owa-addins-adapters';

export default function getInitialMessageComposeData(
    adapter: MessageComposeAdapter,
    data: InitialData
): InitialData {
    data.itemType = ApiItemTypeEnum.MessageCompose;
    data.conversationId = adapter.getConversationId();
    data.isRead = false;
    return data;
}
