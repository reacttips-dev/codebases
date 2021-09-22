import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import getFavorites from 'owa-session-store/lib/utils/getFavorites';
import { loadFavorites, parseFavoriteNode } from 'owa-favorites';
import type FolderInfoResponseMessage from 'owa-service/lib/contract/FolderInfoResponseMessage';
import type BaseFolderType from 'owa-service/lib/contract/BaseFolderType';
import { getSingleValueSettingValueForKey } from 'owa-favorites/lib/utils/favoriteServiceDataUtils';
import { isFeatureEnabled } from 'owa-feature-flags';
import populatePublicFolderOutlookFavoriteStore from '../actions/populatePublicFolderOutlookFavoriteStore';
import populatePublicFolderFavoriteStoreV1 from '../actions/populatePublicFolderFavoriteStoreV1';
import getPublicFolders from '../services/getPublicFolders';
import addPublicFolderToStore from '../actions/addPublicFolderToStore';
import publicFolderFavoriteStore from '../store/publicFolderFavoriteStore';
import { createLazyOrchestrator } from 'owa-bundling';
import {
    OutlookFavoriteServiceDataType,
    FolderForestNode,
    FolderForestNodeType,
} from 'owa-favorites-types';

export default createLazyOrchestrator(loadFavorites, 'clone_loadFavorites', async () => {
    let folderIds: string[] = [];
    if (isFeatureEnabled('tri-favorites-roaming')) {
        const outlookFavorites = getFavorites()?.value;
        if (!outlookFavorites) {
            // Nothing to load
            return;
        }

        outlookFavorites.forEach((serviceData: OutlookFavoriteServiceDataType) => {
            const isPublicFolderSetting = getSingleValueSettingValueForKey(
                serviceData,
                'IsPublicFolder'
            );

            if (isPublicFolderSetting && isPublicFolderSetting.toLowerCase() === 'true') {
                folderIds.push(getSingleValueSettingValueForKey(serviceData, 'FolderId'));
            }
        });
    } else {
        const userOptions = getUserConfiguration().UserOptions;
        if (!userOptions.FavoriteNodes) {
            // Nothing to load
            return;
        }

        const favoriteNodes = userOptions.FavoriteNodes;
        favoriteNodes.forEach(rawNode => {
            const parsedNode: FolderForestNode = parseFavoriteNode(rawNode);
            if (parsedNode && parsedNode.type == FolderForestNodeType.PublicFolder) {
                folderIds.push(parsedNode.id);
            }
        });
    }

    let getFolderResponse = await getPublicFolders(folderIds);

    if (getFolderResponse) {
        getFolderResponse.Items.forEach((item: FolderInfoResponseMessage) => {
            item.Folders?.forEach((folder: BaseFolderType) => {
                if (folder != null) {
                    addPublicFolderToStore(publicFolderFavoriteStore, folder);
                }
            });
        });

        if (isFeatureEnabled('tri-favorites-roaming')) {
            populatePublicFolderOutlookFavoriteStore();
        } else {
            populatePublicFolderFavoriteStoreV1();
        }
    }
});
