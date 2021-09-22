import { orchestrator } from 'satcheljs';
import { editFavoritePrivateDistributionList } from '../../actions/v2/people/editFavoritePrivateDistributionList';
import { editExistingFavoriteInStore } from '../../actions/v2/editFavoriteActions';
import type { OutlookFavoriteKind } from 'owa-favorites-types';
import {
    default as markSearchFolderAsPopulated,
    MARK_FOLDER_POPULATED_TIMEOUT,
} from '../../actions/v2/people/markSearchFolderAsPopulated';
import editOutlookFavoriteService from '../../services/v2/editOutlookFavoriteService';
import { createEditPDLServiceData } from '../../utils/convertPrivateDistributionListFavorite';

export default orchestrator(editFavoritePrivateDistributionList, async actionMessage => {
    const { favoriteId, newMembers, newName } = actionMessage;
    const updatedFavoriteData = {
        favoriteId,
        type: 'privatedistributionlist' as OutlookFavoriteKind,
        members: newMembers,
        displayName: newName,
        isSearchFolderPopulated: false,
    };

    try {
        // Edit the local store so changes are immediately visible
        editExistingFavoriteInStore(updatedFavoriteData);

        // Create payload for service request
        const editPdlServiceData = createEditPDLServiceData(newName, newMembers);

        // //Perform the request
        await editOutlookFavoriteService(favoriteId, editPdlServiceData);

        // After a search folder is created, it takes, on average, less than 30 seconds for the index to be populated
        // therefore, we set a timeout for 30s before starting to serve results from the search folder
        setTimeout(() => {
            markSearchFolderAsPopulated(favoriteId);
        }, MARK_FOLDER_POPULATED_TIMEOUT);
    } catch (error) {
        // In case of error, fire an action that callers can listen to
        // editFavoriteFailed(error, initialFavoriteData);
    }
});
