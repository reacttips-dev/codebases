import moveComposeToTab from '../actions/moveComposeToTab';
import { AsyncSendState, getStore } from 'owa-mail-compose-store';
import openComposeViewStateInSecondaryTabHelper from 'owa-sxs-store/lib/utils/openComposeViewStateInSecondaryTabHelper';

async function recreateComposeFromSxS(composeId: string) {
    let composeViewState = composeId && getStore().viewStates.get(composeId);
    // Do nothing when the compose view state is already in an async send state or has already sent.
    // if there are issues in sending, the async send logic will pop a notification allowing the draft to
    // be re-opened.
    if (
        composeViewState.isSending ||
        composeViewState.asyncSendState === AsyncSendState.Delay ||
        composeViewState.asyncSendState === AsyncSendState.Sending ||
        composeViewState.asyncSendState === AsyncSendState.Sent
    ) {
        return;
    }
    moveComposeToTab(composeViewState, true, true);
    return;
}

openComposeViewStateInSecondaryTabHelper.register(recreateComposeFromSxS);
