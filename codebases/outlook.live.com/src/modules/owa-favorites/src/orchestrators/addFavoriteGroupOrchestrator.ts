import { orchestrator } from 'satcheljs';
import addFavoriteGroup from '../actions/v2/addFavoriteGroup';
import { getGuid } from 'owa-guid';
import createOutlookFavoriteService from '../services/v2/createOutlookFavoriteService';
import type { OutlookFavoriteServiceDataType, FavoriteGroupData } from 'owa-favorites-types';
import { convertServiceResponseToFavoriteData } from '../utils/favoriteServiceDataUtils';
import {
    addFavoriteToStore,
    addFavoriteCompleted,
    addFavoriteFailed,
} from '../actions/v2/addFavoriteActions';
import isOutlookFavoritingInProgress from '../selectors/v2/isOutlookFavoritingInProgress';

export default orchestrator(addFavoriteGroup, async actionMessage => {
    const { groupSmtp, displayName } = actionMessage;
    const temporaryGuid = getGuid();
    const groupId = groupSmtp.toLowerCase();

    const favoriteGroupData: FavoriteGroupData = {
        treeType: 'favorites',
        type: 'group',
        favoriteId: temporaryGuid,
        displayName: displayName,
        groupId,
        client: 'OWA',
    };

    if (isOutlookFavoritingInProgress(groupId)) {
        // No-op
        return;
    }

    // Local update to add Group to favorites store
    addFavoriteToStore(favoriteGroupData);

    const owsFavoriteGroupData: OutlookFavoriteServiceDataType = {
        Type: 'group',
        DisplayName: displayName,
        SingleValueSettings: [
            {
                Key: 'EmailAddress',
                Value: groupSmtp,
            },
        ],
        Client: 'OWA',
    };

    // Use Favorite Roaming API to create a new outlook favorite
    createOutlookFavoriteService(owsFavoriteGroupData)
        .then(response => {
            const asGroup = convertServiceResponseToFavoriteData(response, 'group');
            addFavoriteCompleted(favoriteGroupData, asGroup);
        })
        .catch(error => {
            addFavoriteFailed(error, favoriteGroupData);
        });
});
