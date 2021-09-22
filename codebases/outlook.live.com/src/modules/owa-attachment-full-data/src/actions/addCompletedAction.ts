import type ActionType from '../schema/ActionType';
import type AttachmentFullViewState from '../schema/AttachmentFullViewState';
import { action } from 'satcheljs/lib/legacy';

export default action('addCompletedAction')(function addCompletedAction(
    attachment: AttachmentFullViewState,
    action: ActionType
) {
    attachment.completedActions.push(action);
});
