import { lazyStartChat } from '../index';
import { getStore } from '../store/chatStore';
import ChatProvider from '../store/schema/ChatProvider';
import StartChatSource from '../store/schema/StartChatSource';
import { isFeatureEnabled } from 'owa-feature-flags';

export interface StartChatProperty {
    smtpAddress: string;
    imAddress: string;
    imAddressUrl: string;
}

type CompleteCallbackType = (success: boolean, error?: string) => void;
type StartChatCallbackFunctionType = (
    properties: StartChatProperty,
    onChatStarted: CompleteCallbackType
) => void;

export default function getStartChatCallback(): StartChatCallbackFunctionType {
    const chatProvider = getStore().chatProvider;

    return isFeatureEnabled('fwk-teamsDeeplinkLPC')
        ? startChatViaTeamsDeeplink
        : chatProvider == ChatProvider.UCMA || chatProvider == ChatProvider.UCWA
        ? startChat
        : undefined;
}

function startChat(properties: StartChatProperty, onChatStarted: CompleteCallbackType) {
    const { imAddressUrl } = properties;
    lazyStartChat.import().then(startChat => {
        const success = startChat([imAddressUrl], undefined, StartChatSource.PersonaCard);
        onChatStarted(success, undefined);
    });
}

function startChatViaTeamsDeeplink(
    properties: StartChatProperty,
    onChatStarted: CompleteCallbackType
) {
    const { smtpAddress } = properties;
    if (smtpAddress) {
        window.open(
            'https://teams.microsoft.com/l/chat/0/0?users=' + smtpAddress + '&launchInBrowser=true'
        );
        onChatStarted(true);
    } else {
        onChatStarted(false, 'no smtp address provided');
    }
}
