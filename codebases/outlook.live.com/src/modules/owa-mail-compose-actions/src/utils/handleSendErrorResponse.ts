import type { CustomError } from './sendSaveUtils';
import type { ComposeViewState } from 'owa-mail-compose-store';
import getErrorMessageFromResponseCode from './getErrorMessageFromResponseCode';
import { presentHipChallengeOnSendFail } from './presentHipChallengeOnSendFail';
import addInfoBarMessage from 'owa-info-bar/lib/actions/addInfoBarMessage';
import getDetailErrorInfobarHandler from './getDetailErrorInfobarHandler';
import { UNDO_SEND_ERROR_MESSAGE } from './sendConstants';
import { CANCEL_SMIME_SEND_ERROR_MESSAGE } from 'owa-smime/lib/utils/constants';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';

export function handleSendErrorResponse(
    error: CustomError,
    viewState: ComposeViewState,
    isSend: boolean,
    targetWindow: Window
) {
    if (
        error.message == UNDO_SEND_ERROR_MESSAGE ||
        error.message == CANCEL_SMIME_SEND_ERROR_MESSAGE
    ) {
        return;
    }

    const messageId = getErrorMessageFromResponseCode(error ? error.message : null, isSend);

    if (messageId == 'errorMessageMessageSubmissionBlocked' && isConsumer()) {
        // Instead of presenting an infobar for users who have their send blocked
        // immediately spawn the modal that the infobar's button would have opened.
        presentHipChallengeOnSendFail(viewState, targetWindow);
    }

    if (messageId == 'errorMessageMessageCanNotBeSent' && error.messageText) {
        // Add detailed message text to common send failure error infobar
        addInfoBarMessage(
            viewState,
            'errorMessageErrorWithDetail',
            getDetailErrorInfobarHandler(error.messageText)
        );
    } else {
        addInfoBarMessage(viewState, messageId);
    }
}
