import type RecipientWellWithFindControlViewState from 'owa-recipient-types/lib/types/RecipientWellWithFindControlViewState';
import { action } from 'satcheljs/lib/legacy';

export default action('clearRecipientWell')(function clearRecipientWell(
    recipientWell: RecipientWellWithFindControlViewState
) {
    recipientWell.recipients = [];
    recipientWell.isDirty = true;
});
