import setOngoingAction from './setOngoingAction';
import setShouldShowImageOverlay from './setShouldShowImageOverlay';
import type ActionMessageId from '../schema/ActionMessageId';
import type ActionType from '../schema/ActionType';
import type AttachmentFullViewState from '../schema/AttachmentFullViewState';
import shouldAlwaysShowImageOverlay from '../utils/shouldAlwaysShowImageOverlay';
import { action } from 'satcheljs/lib/legacy';

export default action('setOngoingActionAndActionMessage')(function setOngoingActionAndActionMessage(
    attachment: AttachmentFullViewState,
    actionType: ActionType,
    message: ActionMessageId
) {
    setOngoingAction(attachment, actionType);

    // The order of the following lines can not change as shouldAlwaysShowImageOverlay needs to look up the actionMessage to decide whether to show image overlay
    attachment.actionMessage = message;
    if (shouldAlwaysShowImageOverlay(attachment)) {
        setShouldShowImageOverlay(attachment, true);
    } else {
        setShouldShowImageOverlay(attachment, false);
    }
});
