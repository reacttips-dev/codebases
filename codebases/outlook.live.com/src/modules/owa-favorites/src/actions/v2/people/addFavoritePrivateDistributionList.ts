import { action } from 'satcheljs';
import { addDatapointConfig } from 'owa-analytics-actions';
import type { PrivateDistributionListMember } from 'owa-persona-models';

export const addFavoritePrivateDistributionList = action(
    'addFavoritePrivateDistributionList',
    (
        displayName: string,
        members: PrivateDistributionListMember[],
        pdlId: string,
        owsPersonaId: string,
        actionSource: string
    ) =>
        addDatapointConfig(
            {
                name: 'AddFavoritePrivateDistributionList',
                customData: {
                    actionSource,
                    isNew: !pdlId,
                },
            },
            {
                displayName,
                members,
                pdlId,
                owsPersonaId,
            }
        )
);
