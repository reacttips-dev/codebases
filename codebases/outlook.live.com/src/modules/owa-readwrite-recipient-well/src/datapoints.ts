import type { FindResultType } from 'owa-recipient-types/lib/types/FindControlViewState';

// The reducer limits you to 24 unique entries currently.
const MAX_INDEX = 23;

export default {
    SearchPeopleIndex: {
        name: 'SearchPeopleIndex',
    },
    AddRecipientFromFindControl: {
        name: 'AddRecipientFromFindControl',
        customData: (index: number, source: FindResultType): { [key: string]: string } => {
            return {
                index: (index > MAX_INDEX ? MAX_INDEX : index).toString(),
                source: source.toString(),
            };
        },
    },
    SearchCacheFirst: {
        name: 'SearchCacheFirst',
    },
};
