import type FindRecipientPersonaType from 'owa-recipient-types/lib/types/FindRecipientPersonaType';
import type ReadWriteRecipientViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';

const MAX_RESULTS = 5;

export default function getPrioritizedResults(
    searchQuery: string,
    currentWellContents: ReadWriteRecipientViewState[]
): FindRecipientPersonaType[] {
    let resultList: FindRecipientPersonaType[] = [];

    if (currentWellContents) {
        let i = 0;
        searchQuery = searchQuery.toLowerCase();
        while (resultList.length < MAX_RESULTS && i < currentWellContents.length) {
            let email = currentWellContents[i].persona.EmailAddress;
            if (
                (email.EmailAddress &&
                    email.EmailAddress.toLowerCase().indexOf(searchQuery) == 0) ||
                (email.Name && email.Name.toLowerCase().indexOf(searchQuery) == 0)
            ) {
                resultList.push({ EmailAddress: email });
            }
            i++;
        }
    }

    return resultList;
}
