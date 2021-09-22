import addRecipientsToRecipientWell from 'owa-recipient-common/lib/actions/addRecipientsToRecipientWell';
import findReadWriteRecipient from './findReadWriteRecipient';
import setDirectorySearchType from './setDirectorySearchType';
import setIsSearching from './setIsSearching';
import { DirectorySearchType } from 'owa-recipient-types/lib/types/FindControlViewState';
import type RecipientWellWithFindControlViewState from 'owa-recipient-types/lib/types/RecipientWellWithFindControlViewState';
import { getReadWriteRecipientViewStateFromRecipientAddressString } from 'owa-recipient-create-viewstate/lib/util/getReadWriteRecipientViewStateFromRecipientAddressString';

export default async function resolveQueryStringToRecipient(
    recipientWell: RecipientWellWithFindControlViewState,
    shouldDirectlyResolve: boolean,
    searchDirectory?: boolean,
    resolveIfSingle?: boolean
): Promise<void> {
    setDirectorySearchType(
        recipientWell,
        searchDirectory ? DirectorySearchType.Manual : DirectorySearchType.None
    );
    let inputText = recipientWell.queryString.trim();
    if (inputText) {
        if (shouldDirectlyResolve || recipientWell.inForceResolve) {
            recipientWell.queryString = '';
            setIsSearching(recipientWell, false /* isSearching */);
            addRecipientsToRecipientWell(
                [getReadWriteRecipientViewStateFromRecipientAddressString(inputText)],
                recipientWell
            );
        } else {
            setIsSearching(recipientWell, true /* isSearching */);
            await findReadWriteRecipient(
                recipientWell,
                recipientWell.queryString,
                searchDirectory,
                resolveIfSingle
            );
        }
    } else {
        // If query string is empty, hide find result with existing result cleared.
        setIsSearching(recipientWell, false /* isSearching */);
    }
}
