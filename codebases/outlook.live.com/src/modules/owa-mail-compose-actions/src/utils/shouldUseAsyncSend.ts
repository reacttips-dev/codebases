import type { ComposeViewState } from 'owa-mail-compose-store';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import isSmimeEnabledInViewState from 'owa-smime/lib/utils/isSmimeEnabledInViewState';
import { lazyAddNotification } from 'owa-header-toast-notification';
import { isDeepLink } from 'owa-url';

export default function shouldUseAsyncSend(viewState: ComposeViewState) {
    return (
        lazyAddNotification.isLoaded() && // Only do async send when notification code is loaded otherwise server side error can't be displayed
        getUserConfiguration().AsyncSendEnabled &&
        viewState.preferAsyncSend &&
        !isDeepLink() && //Popout behavior needs sync send in order to close the window when the message is sent.
        !isSmimeEnabledInViewState(viewState.smimeViewState) //Smime message needs a sync send, because it needs user interaction before sending message.
    );
}
