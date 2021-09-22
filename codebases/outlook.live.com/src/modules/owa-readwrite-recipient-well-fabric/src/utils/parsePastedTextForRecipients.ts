import type ReadWriteRecipientViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';
import { getReadWriteRecipientViewStateFromRecipientAddressString } from 'owa-recipient-create-viewstate/lib/util/getReadWriteRecipientViewStateFromRecipientAddressString';
import { splitPasteInputIntoRecipientStrings } from './splitPasteInputIntoRecipientStrings';

export default function parsePastedTextForRecipients(
    pastedText: string
): ReadWriteRecipientViewState[] {
    let recipientList = splitPasteInputIntoRecipientStrings(pastedText);
    return recipientList.map(getReadWriteRecipientViewStateFromRecipientAddressString);
}
