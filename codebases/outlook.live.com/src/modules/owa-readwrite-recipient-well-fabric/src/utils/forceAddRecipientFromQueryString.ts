import type FindControlViewState from 'owa-recipient-types/lib/types/FindControlViewState';
import findReadWriteRecipient from 'owa-readwrite-recipient-well/lib/actions/findReadWriteRecipient';
import { getReadWriteRecipientViewStateFromRecipientAddressString } from 'owa-recipient-create-viewstate/lib/util/getReadWriteRecipientViewStateFromRecipientAddressString';
import { getReadWriteRecipientViewStateFromFindRecipientPersonaType } from 'owa-recipient-create-viewstate/lib/util/getReadWriteRecipientViewStateFromFindRecipientPersonaType';
import { isNullOrWhiteSpace } from 'owa-string-utils';
import type ReadWriteRecipientViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';

export default async function forceAddRecipientFromQueryString(
    getViewState: () => FindControlViewState,
    addRecipients: (recipientsToAdd: ReadWriteRecipientViewState[]) => void
) {
    const queryString = getViewState().queryString;

    // Only force add if the query string isn't empty
    if (!isNullOrWhiteSpace(queryString)) {
        // Find recipients based on the query string
        await findReadWriteRecipient(getViewState(), queryString, true /*searchDirectory*/);

        let recipientToAdd: ReadWriteRecipientViewState =
            getViewState().findResultSet.length == 1
                ? // If we only found one result, use it
                  getReadWriteRecipientViewStateFromFindRecipientPersonaType(
                      getViewState().findResultSet[0]
                  )
                : // Otherwise, just create a recipient from the query string. If the query string
                  // is a full SMTP, this will be a valid recipient. If not, it will be invalid.
                  getReadWriteRecipientViewStateFromRecipientAddressString(queryString);

        // Add the recipient
        addRecipients([recipientToAdd]);
    }
}
