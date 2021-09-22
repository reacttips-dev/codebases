import { actionCreator } from 'satcheljs';

const addChatTab = actionCreator('ADD_CHAT_TAB', (id: string) => ({ chatConversationId: id }));

export default addChatTab;
