import { orchestrator } from 'satcheljs';
import { addFavoritePrivateDistributionList } from '../../actions/v2/people/addFavoritePrivateDistributionList';
import {
    addFavoriteCompleted,
    addFavoriteToStore,
    addFavoriteFailed,
} from '../../actions/v2/addFavoriteActions';
import {
    default as markSearchFolderAsPopulated,
    MARK_FOLDER_POPULATED_TIMEOUT,
} from '../../actions/v2/people/markSearchFolderAsPopulated';
import { getGuid } from 'owa-guid';
import createOutlookFavoriteService from '../../services/v2/createOutlookFavoriteService';
import {
    createInitialFavoritePrivateDistributionListData,
    createAddFavoritePrivateDistributionListServicePayload,
    createAddFavoriteExistingPrivateDistributionListServicePayload,
} from '../../utils/convertPrivateDistributionListFavorite';
import { convertServiceResponseToFavoriteData } from '../../utils/favoriteServiceDataUtils';
import type { FavoritePrivateDistributionListData } from 'owa-favorites-types';
import loadFavoritePersonaSearchFolder from '../../actions/v2/people/loadFavoritePersonaSearchFolder';
import { isPrivateDLInFavorites } from '../../selectors/isInFavorites';
import isOutlookFavoritingInProgress from '../../selectors/v2/isOutlookFavoritingInProgress';

export default orchestrator(addFavoritePrivateDistributionList, async actionMessage => {
    const { displayName, members, pdlId, owsPersonaId } = actionMessage;

    // Generate temp guid for favorite
    const guid = getGuid();

    const initialFavoriteData = createInitialFavoritePrivateDistributionListData(
        guid,
        displayName,
        members,
        pdlId,
        owsPersonaId
    );

    if (
        isPrivateDLInFavorites(pdlId, members) ||
        isOutlookFavoritingInProgress(initialFavoriteData)
    ) {
        // No-op
        return;
    }

    try {
        // Add it to the store to be immediately displayed
        addFavoriteToStore(initialFavoriteData);

        // Create payload for service request
        const favoriteDataObject = pdlId
            ? createAddFavoriteExistingPrivateDistributionListServicePayload(
                  displayName,
                  pdlId,
                  owsPersonaId
              )
            : createAddFavoritePrivateDistributionListServicePayload(displayName, members);

        //Perform the request
        const response = await createOutlookFavoriteService(favoriteDataObject);

        // Convert the response to FavoritePersonaData, and update the store with the new info
        const favoriteData = convertServiceResponseToFavoriteData(
            response,
            'privatedistributionlist'
        );

        // Set isFolderPopulated as False, as this favorite was just added.
        (favoriteData as FavoritePrivateDistributionListData).isSearchFolderPopulated = false;

        // Add Favorite Data to the store, and clean up the temporary data;
        addFavoriteCompleted(initialFavoriteData, favoriteData);

        loadFavoritePersonaSearchFolder(favoriteData as FavoritePrivateDistributionListData);

        // After a search folder is created, it takes, on average, less than 30 seconds for the index to be populated
        // therefore, we set a timeout for 30s before starting to serve results from the search folder
        setTimeout(() => {
            markSearchFolderAsPopulated(favoriteData.favoriteId);
        }, MARK_FOLDER_POPULATED_TIMEOUT);
    } catch (error) {
        // In case of error, fire an action that callers can listen to
        addFavoriteFailed(error, initialFavoriteData);
    }
});
