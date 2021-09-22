import { getStore } from '../store/ucmaStore';
import type ChatViewState from '../store/schema/ChatViewState';
import ChatState from '../store/schema/ChatState';

export function getVisibleChats(): ChatViewState[] {
    const store = getStore();
    return store.chats.filter(
        chat => chat.state == ChatState.Normal || chat.state == ChatState.Minimized
    );
}

export function getPendingChats(): ChatViewState[] {
    const store = getStore();
    return store.chats.filter(chat => chat.state == ChatState.PendingAccept);
}

export function getUnreadChatsCount(): number {
    const { chats } = getStore();
    return chats.filter(
        chat => chat.state == ChatState.PendingAccept || getUnreadMessageCountForOneChat(chat) > 0
    ).length;
}

export function getUnreadMessageCountForOneChat(chat: ChatViewState): number {
    return chat.lastMessageSequence - chat.lastReadMessageSequence;
}

export function getMoreChats(): ChatViewState[] {
    const store = getStore();
    return store.chats.filter(chat => chat.state == ChatState.InMoreMenu);
}
