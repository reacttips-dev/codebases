import { action } from 'satcheljs';
import { addDatapointConfig } from 'owa-analytics-actions';

export const addFavoritePersonaV2 = action(
    'addFavoritePersonaV2',
    (emailAddress: string, displayName: string, actionSource: string) =>
        addDatapointConfig(
            {
                name: 'AddOutlookFavoritePersona',
                customData: { actionSource },
                options: {
                    isCore: true,
                },
            },
            {
                emailAddress,
                displayName,
            }
        )
);
