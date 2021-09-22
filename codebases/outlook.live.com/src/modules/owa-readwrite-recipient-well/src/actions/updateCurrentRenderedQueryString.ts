import type FindControlViewState from 'owa-recipient-types/lib/types/FindControlViewState';
import { action } from 'satcheljs/lib/legacy';

export default action('updateCurrentRenderedQueryString')(function updateCurrentRenderedQueryString(
    recipientWell: FindControlViewState,
    currentRenderedQueryString: string
) {
    recipientWell.currentRenderedQueryString = currentRenderedQueryString;
});
