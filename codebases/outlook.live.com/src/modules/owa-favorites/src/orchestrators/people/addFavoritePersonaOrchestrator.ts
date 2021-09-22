import { orchestrator } from 'satcheljs';
import { addFavoritePersonaV2 } from '../../actions/v2/people/addFavoritePersonaV2';
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
    createInitialFavoritePersonaData,
    createAddFavoritePersonaServicePayload,
} from '../../utils/convertPersonaFavorite';
import { isPersonaInFavorites } from '../../selectors/isInFavorites';
import { convertServiceResponseToFavoriteData } from '../../utils/favoriteServiceDataUtils';
import type { FavoritePersonaData } from 'owa-favorites-types';
import loadFavoritePersonaSearchFolder from '../../actions/v2/people/loadFavoritePersonaSearchFolder';
import isOutlookFavoritingInProgress from '../../selectors/v2/isOutlookFavoritingInProgress';

export default orchestrator(addFavoritePersonaV2, async actionMessage => {
    const { displayName, emailAddress } = actionMessage;

    // Generate temp guid for favorite
    const guid = getGuid();

    // Create a stub favoritePersonaData object with the provided info.
    const initialFavoritePersonaData = createInitialFavoritePersonaData(
        guid,
        displayName,
        emailAddress
    );

    if (isPersonaInFavorites(null, emailAddress) || isOutlookFavoritingInProgress(emailAddress)) {
        // No-op
        return;
    }

    try {
        // Add it to the store to be immediately displayed
        addFavoriteToStore(initialFavoritePersonaData);

        // Create payload for service request
        const favoritePersonaDataObject = createAddFavoritePersonaServicePayload(
            displayName,
            emailAddress
        );

        //Perform the request
        const response = await createOutlookFavoriteService(favoritePersonaDataObject);

        // Convert the response to FavoritePersonaData, and update the store with the new info
        const favoriteData = convertServiceResponseToFavoriteData(response, 'persona');

        // Set isFolderPopulated as False, as this favorite was just added.
        (favoriteData as FavoritePersonaData).isSearchFolderPopulated = false;

        // Add Favorite Data to the store, and clean up the temporary data;
        addFavoriteCompleted(initialFavoritePersonaData, favoriteData);

        loadFavoritePersonaSearchFolder(favoriteData as FavoritePersonaData);

        // After a search folder is created, it takes, on average, less than 30 seconds for the index to be populated
        // therefore, we set a timeout for 30s before starting to serve results from the search folder
        setTimeout(() => {
            markSearchFolderAsPopulated(favoriteData.favoriteId);
        }, MARK_FOLDER_POPULATED_TIMEOUT);
    } catch (error) {
        // In case of error, fire an action that callers can listen to
        addFavoriteFailed(error, initialFavoritePersonaData);
    }
});
