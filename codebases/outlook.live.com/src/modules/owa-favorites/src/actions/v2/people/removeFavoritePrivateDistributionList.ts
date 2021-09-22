import { action } from 'satcheljs';
import { addDatapointConfig } from 'owa-analytics-actions';

export const removeFavoritePrivateDistributionList = action(
    'removeFavoritePrivateDistributionList',
    (favoriteId: string, actionSource: string) =>
        addDatapointConfig(
            {
                name: 'RemoveFavoritePrivateDistributionList',
                customData: {
                    actionSource,
                },
            },
            {
                favoriteId,
            }
        )
);
