import type ReadWriteRecipientViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';
import { action } from 'satcheljs/lib/legacy';

export default action('updateIsExpanding')(function updateIsExpanding(
    recipientToExpand: ReadWriteRecipientViewState,
    isExpanding: boolean
) {
    recipientToExpand.isExpanding = isExpanding;
});
