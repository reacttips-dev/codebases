import getGroupDetails from './getGroupDetails';
import type UnifiedGroupDetails from 'owa-service/lib/contract/UnifiedGroupDetails';

export const getGroupMailboxExternalId = (group: string | UnifiedGroupDetails): string => {
    const groupDetails = typeof group === 'string' ? getGroupDetails(group) : group;
    if (!groupDetails) {
        return null;
    }

    return groupDetails.ExternalDirectoryObjectId;
};
