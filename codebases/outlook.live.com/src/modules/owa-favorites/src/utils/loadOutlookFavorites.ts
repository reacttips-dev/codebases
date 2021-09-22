import favoritesStore from '../store/store';
import folderStore, { getPrimaryMailFolders } from 'owa-folders';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import getFavorites from 'owa-session-store/lib/utils/getFavorites';
import migrateOutlookFavorites from '../actions/v2/migrateOutlookFavorites';
import setFavoritesLoaded from '../actions/setFavoritesLoaded';
import { addFavoriteToStoreInitial } from '../actions/v2/addFavoriteActions';
import { addToOrderedFavoriteIdList } from '../actions/v2/loadOutlookFavorites';
import { convertServiceResponseToFavoriteData } from '../utils/favoriteServiceDataUtils';
import { isCategoryInMasterList, lazySubscribeToCategoryNotifications } from 'owa-categories';
import { isFeatureEnabled } from 'owa-feature-flags';
import { logUsage } from 'owa-analytics';
import {
    FavoritesBitFlagsMasks,
    getIsBitEnabled,
} from '../actions/helpers/favoritesBitFlagsActions';
import type {
    OutlookFavoriteKind,
    OutlookFavoriteServiceDataType,
    FavoriteFolderData,
    FavoriteGroupData,
    FavoriteCategoryData,
} from 'owa-favorites-types';
import {
    isGroupInFavorites,
    lazySetOutlookFavoritesBitFlag,
    lazyAddNewMailboxDefaultFavorites,
} from '../index';
import getOutlookFavoritesService from '../services/v2/getOutlookFavoritesService';

const HOUR_TIMESPAN_IN_MS = 1000 * 60 * 60;

/**
 * Load outlook favorites
 */
export default async function loadOutlookFavorites() {
    if (favoritesStore.favoritesLoaded) {
        return;
    }

    if (folderStore.folderTable.size === 0) {
        getPrimaryMailFolders();
    }
    // Load UserConfiguration.Favorites if there is any
    // We want to load the Favorites to store first and then migrate, because migrateOutlookFavorites
    // will send multiple create service call and await for all of them succeeds, and we don't want to delay boot
    await loadOutlookFavoritesToStore();

    const firstRunCompleted = getIsBitEnabled(FavoritesBitFlagsMasks.FirstRunFavoritesMigration);
    const roamingFavoritesMigrationCompleted = getIsBitEnabled(
        FavoritesBitFlagsMasks.RoamingFavoritesMigrationCompleted
    );

    if (!roamingFavoritesMigrationCompleted) {
        // Migrate favorites if it hasn't completed
        migrateOutlookFavorites();
    }
    // Add default favorites for new users
    if (!firstRunCompleted) {
        // Only add default folders for new outlook users
        if (favoritesStore.orderedOutlookFavoritesIds.length == 0 && isNewUser()) {
            lazyAddNewMailboxDefaultFavorites.importAndExecute();
        }
        lazySetOutlookFavoritesBitFlag.importAndExecute(
            FavoritesBitFlagsMasks.FirstRunFavoritesMigration
        );
    }

    setFavoritesLoaded();
    logLoadOutlookFavoritesDatapoints();
}

async function loadOutlookFavoritesToStore() {
    const userConfiguration = getUserConfiguration();
    let outlookFavorites = getFavorites()?.value;
    const isExplicitLogon = userConfiguration?.SessionSettings?.IsExplicitLogon;

    if (!outlookFavorites && !isExplicitLogon) {
        // If there are no favorites in session data, retry using OWS' call
        let outlookFavoritesResponse;

        try {
            outlookFavoritesResponse = await getOutlookFavoritesService();
        } catch (error) {
            logUsage('GetOutlookFavoritesRetryFailed', {
                errorMessage: error.toString(),
            });
            return;
        }

        outlookFavorites = outlookFavoritesResponse?.value;

        if (!outlookFavorites) {
            return;
        }

        logUsage('FavoritesRetrySuccess');
    }

    // Populate favorites based on the OutlookFavorites
    outlookFavorites?.forEach((serviceData: OutlookFavoriteServiceDataType) => {
        const favoriteType = serviceData.Type.toLocaleLowerCase() as OutlookFavoriteKind;
        let favoriteData = null;

        try {
            favoriteData = convertServiceResponseToFavoriteData(serviceData, favoriteType);

            switch (favoriteType) {
                case 'folder':
                    tryAddSingleFavoriteFolderToStore(
                        favoriteData as FavoriteFolderData,
                        serviceData.SingleValueSettings[0].Value
                    );
                    break;

                case 'persona':
                    addFavoriteToStoreInitial(favoriteData);
                    break;

                case 'group':
                    tryAddSingleFavoriteGroupToStore(favoriteData as FavoriteGroupData);
                    break;

                case 'category':
                    tryAddSingleFavoriteCategoryToStore(favoriteData as FavoriteCategoryData);
                    break;

                case 'privatedistributionlist':
                    if (isFeatureEnabled('peo-favoritePdls')) {
                        addFavoriteToStoreInitial(favoriteData);
                    }
                    break;
                default:
                    // VSO 26085: Optimize updating the favorite position data
                    // For unknown type, we have to update orderedOutlookFavoritesIds in order to
                    // record the index, which is used to locally update the favorite store
                    addToOrderedFavoriteIdList(favoriteData.favoriteId);
                    break;
            }
        } catch (error) {
            // continue execution if a favorite could not be loaded
            logUsage('AddFavoriteToStoreInitialFailed', {
                favoriteType,
                errorMessage: error.toString(),
            });
        }
    });
}

/**
 * Add single favorite folder
 * @param favoriteData the favorite folder data to be added
 */
function tryAddSingleFavoriteFolderToStore(favoriteData: FavoriteFolderData, restFolderId: string) {
    if (shouldAddFavoriteFolder(restFolderId, favoriteData.folderId /* ewsFolderId */)) {
        addFavoriteToStoreInitial(favoriteData);
    }
}

/**
 * Should add folder to favorite list
 * @param restFolderId the rest folder id to add to favorites
 * @param ewsFolderId the ews folder id to add to favorites
 * @param state the LoadFavoritesState which contains favorites store, folder table
 */
function shouldAddFavoriteFolder(restFolderId: string, ewsFolderId: string): boolean {
    if (folderStore.folderTable.size === 0) {
        // Do not add the folder if the folder store hasn't been initiated yet
        return false;
    }

    // Add the folders if
    // - the folder is not in favorites yet. This could happen during firstRun, if user already has the default favorite folder.
    // - the folder is in the folder store. Skip unsupported favorites type or stale folders which could be deleted in other clients.
    // If the folderTable is empty, the call comes not from owa-mail, but from photo hub. It this case we omit the check for folderTable
    // the stale folder will be removed the next time owa-mail starts
    return (
        !favoritesStore.outlookFavorites.has(restFolderId) &&
        folderStore.folderTable.has(ewsFolderId)
    );
}

/**
 * Add single favorite category
 * @param favoriteData the favorite category data to be added
 */
function tryAddSingleFavoriteCategoryToStore(favoriteData: FavoriteCategoryData) {
    if (shouldAddFavoriteCategory(favoriteData)) {
        addFavoriteToStoreInitial(favoriteData);
        lazySubscribeToCategoryNotifications.importAndExecute();
    }
}

/**
 * Should add folder to favorite list
 * @param favoriteData the favorite category data
 * @return a boolean which indicates whether we should add a favorite category
 */
function shouldAddFavoriteCategory(favoriteData: FavoriteCategoryData): boolean {
    // Add the category to favorites if it is still valid and it is not favorited
    // Otherwise skip adding it, e.g the category has been deleted by the user from other client
    return (
        isCategoryInMasterList(favoriteData.categoryId) &&
        !favoritesStore.outlookFavorites.has(favoriteData.favoriteId)
    );
}

/**
 * Add single favorite group
 * @param favoriteData the favorite group data to be added
 * @param favoritesStore which contains all favorite data
 */
function tryAddSingleFavoriteGroupToStore(favoriteData: FavoriteGroupData) {
    if (!isGroupInFavorites(favoriteData.groupId)) {
        addFavoriteToStoreInitial(favoriteData);
    }
}

function logLoadOutlookFavoritesDatapoints() {
    const allFavorites = [...favoritesStore.outlookFavorites.values()];

    const outlookFavoriteFolders = allFavorites.filter(favorite => favorite.type === 'folder');

    const migratedFolders = outlookFavoriteFolders.filter(
        favorite => favorite.client === 'Migration'
    );

    const outlookFavoriteCategories = allFavorites.filter(favorite => favorite.type === 'category');

    const migratedCategories = outlookFavoriteCategories.filter(
        favorite => favorite.client == 'Migration'
    );

    const outlookFavoritePersonas = allFavorites.filter(favorite => favorite.type === 'persona');

    const migratedPersonas = outlookFavoritePersonas.filter(
        favorite => favorite.client == 'Migration'
    );

    const outlookFavoriteGroups = allFavorites.filter(favorite => favorite.type === 'group');

    const outlookFavoritePrivateDistributionLists = allFavorites.filter(
        favorite => favorite.type === 'privatedistributionlist'
    );

    logUsage('LoadOutlookFavorites', [
        outlookFavoriteFolders.length,
        outlookFavoriteGroups.length,
        outlookFavoriteCategories.length,
        outlookFavoritePersonas.length,
        outlookFavoritePrivateDistributionLists.length,
        migratedFolders.length,
        migratedCategories.length,
        migratedPersonas.length,
    ]);
}

// Returns true if the user's mailbox has been created within the last hour
function isNewUser() {
    let createDate = new Date(getUserConfiguration().MailboxCreateDate);
    return Date.now() - createDate.getTime() < HOUR_TIMESPAN_IN_MS;
}
