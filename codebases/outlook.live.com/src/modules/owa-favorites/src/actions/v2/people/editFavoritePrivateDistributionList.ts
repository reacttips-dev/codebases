import { action } from 'satcheljs';
import { addDatapointConfig } from 'owa-analytics-actions';
import type { PrivateDistributionListMember } from 'owa-persona-models';

export const editFavoritePrivateDistributionList = action(
    'editFavoritePrivateDistributionList',
    (
        favoriteId: string,
        newMembers: PrivateDistributionListMember[],
        newName: string,
        newNotes: string,
        actionSource: string
    ) =>
        addDatapointConfig(
            {
                name: 'EditFavoritePrivateDistributionList',
                customData: {
                    actionSource,
                },
            },
            {
                favoriteId,
                newMembers,
                newName,
                newNotes,
            }
        )
);
