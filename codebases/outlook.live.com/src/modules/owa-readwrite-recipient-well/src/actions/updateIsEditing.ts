import type ReadWriteRecipientViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';
import { action } from 'satcheljs/lib/legacy';
export default action('updateIsEditing')(function updateIsEditing(
    recipient: ReadWriteRecipientViewState,
    isEditing: boolean
) {
    recipient.isEditing = isEditing;
});
