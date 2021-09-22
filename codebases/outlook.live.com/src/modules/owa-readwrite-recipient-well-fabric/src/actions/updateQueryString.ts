import type FindControlViewState from 'owa-recipient-types/lib/types/FindControlViewState';
import { action } from 'satcheljs/lib/legacy';

export default action('updateQueryString')(function updateQueryString(
    recipientWell: FindControlViewState,
    queryString: string
) {
    recipientWell.queryString = queryString;
});
