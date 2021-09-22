import type { ComposeViewState } from 'owa-mail-compose-store';

export let getConversationId = (viewState: ComposeViewState) => (): string => {
    return viewState.conversationId;
};
