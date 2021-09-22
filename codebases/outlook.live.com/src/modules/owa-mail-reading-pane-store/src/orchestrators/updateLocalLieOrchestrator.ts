import markConversationNodePendingNotPending from '../actions/markConversationNodePendingNotPending';
import setLocalLieSentTime from '../actions/setLocalLieSentTime';
import { AsyncSendState } from 'owa-mail-compose-store';
import conversationSendStateChanged from 'owa-mail-compose-actions/lib/actions/conversationSendStateChanged';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import { orchestrator } from 'satcheljs';

export default orchestrator(conversationSendStateChanged, actionMessage => {
    const { viewState, isSendPending } = actionMessage;

    if (!viewState) {
        return;
    }

    const isSending = isSendPending && viewState.asyncSendState === AsyncSendState.Sending;

    if (isSending && viewState.handledByDelaySend) {
        // If the send state has changed from delay to sending, conversationSendStateChanged
        // will have already occurred and markConversationNodePendingNotPending already done,
        // then stamp sent time for the local lie node
        setLocalLieSentTime(viewState);
        return;
    }

    // If we're using the default from address, continue local lie.
    // This will only be different for situations which we can't reconcile local lie fully, like replying to connected accounts
    const userConfig = getUserConfiguration();
    let address = isConsumer()
        ? userConfig.SessionSettings.DefaultFromAddress
        : userConfig.UserOptions.SendAddressDefault;

    if (!address) {
        address = userConfig.SessionSettings.UserEmailAddress;
    }

    const isDifferentFrom = viewState.fromViewState?.from?.email
        ? viewState.fromViewState.from.email.EmailAddress != address
        : false;

    if (!isDifferentFrom && !viewState.deferredSendTime) {
        markConversationNodePendingNotPending(viewState, isSendPending /* markAsPending */);

        if (isSending) {
            setLocalLieSentTime(viewState);
        }
    }
});
