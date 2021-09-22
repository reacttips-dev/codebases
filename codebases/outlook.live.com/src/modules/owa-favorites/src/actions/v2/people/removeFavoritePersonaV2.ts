import { action } from 'satcheljs';
import { addDatapointConfig } from 'owa-analytics-actions';

export const removeFavoritePersonaV2 = action(
    'removeFavoritePersonaV2',
    (favoriteId: string, actionSource: string) =>
        addDatapointConfig(
            {
                name: 'RemoveOutlookFavoritePersona',
                customData: { actionSource },
                options: {
                    isCore: true,
                },
            },
            {
                favoriteId,
            }
        )
);
