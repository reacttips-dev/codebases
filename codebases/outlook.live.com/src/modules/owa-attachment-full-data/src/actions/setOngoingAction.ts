import type AttachmentFullViewState from '../schema/AttachmentFullViewState';
import type ActionType from '../schema/ActionType';
import { action } from 'satcheljs/lib/legacy';

export default action('setOngoingAction')(function setOngoingAction(
    attachment: AttachmentFullViewState,
    action: ActionType
) {
    attachment.ongoingAction = action;
});
