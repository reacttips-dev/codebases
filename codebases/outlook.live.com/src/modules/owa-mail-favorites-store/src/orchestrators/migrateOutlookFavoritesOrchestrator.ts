import { logUsage, DatapointStatus, PerformanceDatapoint } from 'owa-analytics';
import { getMasterCategoryList } from 'owa-categories';
import {
    FolderForestNodeType,
    FavoritePersonaData,
    FavoritePersonaNode,
    OutlookFavoriteServiceDataType,
    FavoriteData,
    FolderForestNode,
} from 'owa-favorites-types';
import { getGuid } from 'owa-guid';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import outlookFavoritePersonasLoaded from '../actions/v2/people/outlookFavoritePersonasLoaded';
import {
    isCategoryInFavorites,
    migrateOutlookFavorites,
    getIsBitEnabled,
    parseFavoriteNode,
    FavoritesBitFlagsMasks,
    lazyCreateMultipleOutlookFavoritesService,
    createClientFavoriteCategoryData,
    createOwsFavoriteCategoryData,
    isPersonaInFavorites,
    lazyAddMultipleFavoritesCompleted,
    lazyAddMultipleFavoritesToStore,
    convertServiceResponseToFavoriteData,
    lazySetOutlookFavoritesBitFlag,
} from 'owa-favorites';
import {
    createOwsFavoritePersonaData,
    createClientFavoritePersonaData,
} from '../utils/favoritePersonaDataHelper';
import { createLazyOrchestrator } from 'owa-bundling';

export interface FavoritesDataToMigrate {
    owsFavoritesData: OutlookFavoriteServiceDataType[];
    clientFavoritesData: FavoriteData[];
}

const MAX_NUMBER_OF_FAVORITES_PER_REQUEST = 20;

export default createLazyOrchestrator(
    migrateOutlookFavorites,
    'migrateOutlookFavoritesClone',
    async () => {
        // 1. Read from UserOptions.FavoritesNodes(used by React Mail Favorites V1 API)
        // this is done inside getFavoritesDataToMigrate
        // 2. Get the favorites data to migrate in both service and client format
        const favoritesDataToMigrate = getFavoritesDataToMigrate();
        const owsFavoritesToMigrate = favoritesDataToMigrate.owsFavoritesData;
        const clientFavoritesData = favoritesDataToMigrate.clientFavoritesData;

        if (owsFavoritesToMigrate.length === 0) {
            // Mark the migration completed if there is no favorite to migrate
            markMigrationCompleted();
            return;
        }

        // 3. Append all de-duped favorites data to migrate at the bottom of the favorite list
        const addMultipleFavoritesToStore = await lazyAddMultipleFavoritesToStore.import();
        addMultipleFavoritesToStore(clientFavoritesData);

        const personasToMigrate = clientFavoritesData.filter(
            favorite => favorite.type === 'persona'
        ) as FavoritePersonaData[];
        if (personasToMigrate.length > 0) {
            // 3.1. Fire another outlookFavoritesLoaded action to check the existence of search folders for the new favorite personas
            outlookFavoritePersonasLoaded(personasToMigrate);
        }

        // 4. Sends the migrate service requests in batch size one by one
        // We need to do this because OWS Prime has a limit on the paralleled request it can process
        const numberOfRequests = Math.ceil(
            owsFavoritesToMigrate.length / MAX_NUMBER_OF_FAVORITES_PER_REQUEST
        );
        let hasFailureDuringMigration = false;

        // Start logging datapoint to track the total time for migration services call
        const migrationServiceDatapoint = new PerformanceDatapoint(
            'MigrateOutlookFavoriteService',
            {
                isCore: true,
            }
        );
        migrationServiceDatapoint.addCustomProperty('totalBatchCount', numberOfRequests);

        for (
            let i = 0, index = 0;
            i < numberOfRequests;
            i++, index += MAX_NUMBER_OF_FAVORITES_PER_REQUEST
        ) {
            const batchedOwsFavoritesData = owsFavoritesToMigrate.slice(
                index,
                index + MAX_NUMBER_OF_FAVORITES_PER_REQUEST
            );

            // Start logging datapoint to track the time for a single migration service call
            const migrationSingleBatchServiceDatapoint = new PerformanceDatapoint(
                'MigrateOutlookFavoriteSingleBatchService',
                {
                    isCore: true,
                }
            );

            // Log the number of total favorites to be migrated
            migrationSingleBatchServiceDatapoint.addCustomProperty(
                'favoritesCount',
                batchedOwsFavoritesData.length
            );

            const batchTempData = clientFavoritesData.slice(
                index,
                index + MAX_NUMBER_OF_FAVORITES_PER_REQUEST
            );

            hasFailureDuringMigration = await makeMigrationRequestAndProcessResult(
                batchedOwsFavoritesData,
                batchTempData,
                migrationSingleBatchServiceDatapoint
            );
        }

        // 5. End logging datapoints to track the total time of migration service requests
        if (hasFailureDuringMigration) {
            migrationServiceDatapoint.endWithError(DatapointStatus.ServerError);
        } else {
            migrationServiceDatapoint.end();
        }

        // 6. Mark migration bits
        const isFirstAttemptToMigrate = !getIsBitEnabled(
            FavoritesBitFlagsMasks.RoamingFavoritesMigrationFirstAttemptDone
        );

        if (isFirstAttemptToMigrate) {
            markFirstAttemptMigrationDone();

            if (!hasFailureDuringMigration) {
                // Mark user as migrated if 1st attempt succeeds
                markMigrationCompleted();
            }
        } else {
            // Force as migration completed if it is the 2nd attempt
            markMigrationCompleted();
        }

        // 7. Log migration datapoint to track if the migration completes in first or second attempt, and if there is an error during the migraiton process
        /*
    TODO: turn off iscore for all outlook migration datapoints once the flight scope in production increases
    tracking workitem:
    https://msfast.visualstudio.com/FAST/_workitems/edit/253351
    */

        logUsage(
            isFirstAttemptToMigrate
                ? 'FirstAttemptMigrationCompleted'
                : 'SecondAttemptMigrationCompleted',
            [hasFailureDuringMigration],
            {
                isCore: true,
            }
        );
    }
);

/**
 * Perform a createMultiple request with favorites to migrate, add the results to store if successful
 * @param batchedOwsFavoritesData The Service data to be sent to Prime
 * @param batchTempData The temp data added to the store
 * @param migrationSingleBatchServiceDatapoint The migration datapoint for this batch
 * @returns A boolean indicating whether a migration error occurred
 */
async function makeMigrationRequestAndProcessResult(
    batchedOwsFavoritesData: OutlookFavoriteServiceDataType[],
    batchTempData: FavoriteData[],
    migrationSingleBatchServiceDatapoint: PerformanceDatapoint
): Promise<boolean> {
    let response;

    // Perform the network request, and end with server error in case one is thrown
    try {
        response = await lazyCreateMultipleOutlookFavoritesService.importAndExecute(
            batchedOwsFavoritesData
        );
    } catch (e) {
        // Log a server error if it occurred
        migrationSingleBatchServiceDatapoint.endWithError(DatapointStatus.ServerError, e);
        return true;
    }

    // Process the results, and end with client error if one occurs
    try {
        const convertedResponses: FavoriteData[] = (response.value || []).map(favorite =>
            convertServiceResponseToFavoriteData(favorite, favorite.Type.toLowerCase())
        );

        const addMultipleFavoritesCompleted = await lazyAddMultipleFavoritesCompleted.import();

        // Add favorites to the store
        addMultipleFavoritesCompleted(batchTempData, convertedResponses);

        // Log the number of migrated favorite personas and categories
        const migratedPersonas = convertedResponses.filter(favorite => favorite.type === 'persona');
        const migratedCategories = convertedResponses.filter(
            favorite => favorite.type === 'category'
        );
        migrationSingleBatchServiceDatapoint.addCustomProperty(
            'migratedPersonasCount',
            migratedPersonas.length
        );
        migrationSingleBatchServiceDatapoint.addCustomProperty(
            'migratedCategoriesCount',
            migratedCategories.length
        );
        // End logging datapoint to track the time for a single migration service call
        migrationSingleBatchServiceDatapoint.end();
    } catch (e) {
        // Log a client error if it occurred
        migrationSingleBatchServiceDatapoint.endWithError(DatapointStatus.ClientError, e);
        return true;
    }

    return false;
}

/**
 * Get the favorites data to migrate as two lists
 * @param rawFavoritesNodes the favorite nodes data in UserOptions
 * @return two lists which represents the service favorites data list and client favorites data list to be migrated
 */
function getFavoritesDataToMigrate(): FavoritesDataToMigrate {
    const rawFavoritesNodes = getUserConfiguration().UserOptions.FavoriteNodes;
    if (!rawFavoritesNodes) {
        return { owsFavoritesData: [], clientFavoritesData: [] };
    }

    // Convert each raw favorite node to service type and client type
    const owsFavoritesDataList = [];
    const clientFavoritesDataList = [];

    rawFavoritesNodes.forEach(rawNode => {
        const parsedNode: FolderForestNode = parseFavoriteNode(rawNode);
        switch (parsedNode.type) {
            case FolderForestNodeType.Persona:
                const personaNode = parsedNode as FavoritePersonaNode;
                if (!isPersonaInFavorites(personaNode.personaId, personaNode.mainEmailAddress)) {
                    const temporaryGuid = getGuid();
                    const clientFavoritePersonaData = createClientFavoritePersonaData(
                        temporaryGuid,
                        personaNode,
                        true /* isMigration */
                    );
                    const owsFavoritePersonaData = createOwsFavoritePersonaData(personaNode);

                    if (owsFavoritePersonaData) {
                        owsFavoritesDataList.push(owsFavoritePersonaData);
                        clientFavoritesDataList.push(clientFavoritePersonaData);
                    }
                }
                break;

            case FolderForestNodeType.Category:
                const categoryIdToMigrate = parsedNode.id;
                const category = getMasterCategoryList().filter(
                    category => category.Id === categoryIdToMigrate
                )[0];

                // Migrate the category only if
                // - it is still a valid category because user might already deleted this category from other client
                // - category hasn't been favorited in SDS
                if (category && !isCategoryInFavorites(categoryIdToMigrate)) {
                    const temporaryGuid = getGuid();
                    const clientFavoriteCategoryData = createClientFavoriteCategoryData(
                        temporaryGuid,
                        category,
                        true /* isMigration */
                    );
                    const owsFavoriteCategoryData = createOwsFavoriteCategoryData(
                        category,
                        true /* isMigration */
                    );
                    owsFavoritesDataList.push(owsFavoriteCategoryData);
                    clientFavoritesDataList.push(clientFavoriteCategoryData);
                }

                break;

            default:
                // No need to migrate other type of favorites
                break;
        }
    });

    // Only add the favorite data to migration list if it is not present in SDS
    return { owsFavoritesData: owsFavoritesDataList, clientFavoritesData: clientFavoritesDataList };
}

/**
 * Mark the user as migrate completed
 */
function markMigrationCompleted() {
    lazySetOutlookFavoritesBitFlag.importAndExecute(
        FavoritesBitFlagsMasks.RoamingFavoritesMigrationCompleted
    );
}

/**
 * Mark the bit to indicate the fist attempt to migrate outlook favorites has been done
 */
function markFirstAttemptMigrationDone() {
    lazySetOutlookFavoritesBitFlag.importAndExecute(
        FavoritesBitFlagsMasks.RoamingFavoritesMigrationFirstAttemptDone
    );
}
