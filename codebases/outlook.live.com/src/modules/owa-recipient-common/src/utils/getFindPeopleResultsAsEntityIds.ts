import type FindRecipientPersonaType from 'owa-recipient-types/lib/types/FindRecipientPersonaType';

export default function getFindPeopleResultsAsEntityIds(
    findPeopleResults: FindRecipientPersonaType[]
): string[] {
    let entityIds = [];

    if (findPeopleResults) {
        findPeopleResults.forEach((result, index) => {
            // we should use ID whenever it's available
            entityIds[index] =
                result.Id || result.EmailAddress.EmailAddress || result.EmailAddress.Name;
        });
    }

    return entityIds;
}
