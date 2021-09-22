import closeCompose from './closeCompose';
import removeInfoBarMessage from 'owa-info-bar/lib/actions/removeInfoBarMessage';
import setHandledByDelaySend from './setHandledByDelaySend';
import moveComposeToTab from './moveComposeToTab';
import { sendAndSaveInfobarIdsToRemove } from '../utils/InfoBarMessageId';
import endSession from 'owa-controls-findpeople-feedback-manager/lib/actions/endSession';
import { findTabByData, lazySetTabIsShown, TabViewState } from 'owa-tab-store';
import { action } from 'satcheljs/lib/legacy';
import { ComposeViewState, ComposeOperation, AsyncSendState } from 'owa-mail-compose-store';

const ASYNC_SEND_WAITING_TIME = 10000;
const ASYNC_SENT_DISMISS_TIME = 3000;

const setAsyncSendState = action('setAsyncSendState')(function (
    viewState: ComposeViewState,
    asyncSendState: AsyncSendState
) {
    if (viewState.changeAsyncSendStateTimer) {
        window.clearTimeout(viewState.changeAsyncSendStateTimer);
        viewState.changeAsyncSendStateTimer = 0;
    }

    viewState.asyncSendState = asyncSendState;

    const tab = findTabByData(viewState.composeId);

    switch (asyncSendState) {
        case AsyncSendState.None:
            setHandledByDelaySend(viewState, false /* handledByDelaySend */);
            break;

        case AsyncSendState.Delay:
            handleDelayOrSendState(viewState, tab);
            setHandledByDelaySend(viewState, true /* handledByDelaySend */);
            break;

        case AsyncSendState.Sending:
            if (!viewState.handledByDelaySend) {
                handleDelayOrSendState(viewState, tab);
            }
            viewState.changeAsyncSendStateTimer = window.setTimeout(() => {
                setAsyncSendState(viewState, AsyncSendState.Timeout);
            }, ASYNC_SEND_WAITING_TIME);
            break;

        case AsyncSendState.Sent:
            removeInfoBarMessage(viewState, sendAndSaveInfobarIdsToRemove);
            viewState.changeAsyncSendStateTimer = window.setTimeout(() => {
                setAsyncSendState(viewState, AsyncSendState.Closed);
            }, ASYNC_SENT_DISMISS_TIME);
            break;

        case AsyncSendState.Closed:
            endSession(viewState.toRecipientWell.findPeopleFeedbackManager, 'Send');
            closeCompose(viewState, 'Send');
            break;

        case AsyncSendState.Timeout:
            if (tab) {
                lazySetTabIsShown.importAndExecute(tab, true /*isShown*/);
            }
            break;
    }
});

function handleDelayOrSendState(viewState: ComposeViewState, tab?: TabViewState) {
    if (viewState.operation === ComposeOperation.EditDraft) {
        moveComposeToTab(viewState, false /* isShown */, false /* makeActive */);
    }
    if (tab) {
        lazySetTabIsShown.importAndExecute(tab, false /*isShown*/);
    }
}

export default setAsyncSendState;
