import { convertRestFolderIdToEWSFolderId } from './ewsRestFolderIdConverter';
import type {
    OutlookFavoriteKind,
    OutlookFavoriteServiceDataType,
    FavoriteData,
    FavoriteFolderData,
    FavoritePublicFolderData,
    FavoritePersonaData,
    FavoriteGroupData,
    FavoriteCategoryData,
    FavoritePrivateDistributionListData,
    FavoriteDataClient,
    FavoriteSearchData,
} from 'owa-favorites-types';
import type { PrivateDistributionListMember } from 'owa-persona-models';

export const SEARCH_FOLDER_ID_KEY = 'SearchFolderId';
export const PERSONA_ID_KEY = 'PersonaId';
export const MAIN_EMAIL_ADDRESS_KEY = 'MainEmailAddress';
export const EMAIL_ADDRESSES_KEY = 'EmailAddresses';
export const CONTACT_DISPLAYNAME_KEY = 'ContactDisplayName';
export const CONTACT_EMAIL_ADDRESS_KEY = 'ContactMainEmailAddress';
export const PDL_ID_KEY = 'PdlId';
export const MEMBER_NAMES_KEY = 'MemberNames';
export const GROUP_SMTP_KEY = 'EmailAddress';
export const GROUP_EXTERNAL_DIRCTORY_OBJECT_ID_KEY = 'ExtDirId';

/**
 * Retrieves the single value setting for the provided key from the provided serviceData object
 * or undefined if the key is not found
 * @param serviceData the serviceData object
 * @param key the key
 */
export function getSingleValueSettingValueForKey(
    serviceData: OutlookFavoriteServiceDataType,
    key: string
): string {
    const settings =
        serviceData.SingleValueSettings &&
        serviceData.SingleValueSettings.filter(data => data.Key == key);
    return settings && settings.length === 1 ? settings[0].Value : undefined;
}

/**
 * Retrieves the multi value setting for the provided key from the provided serviceData object
 * or [] if the key is not found
 * @param serviceData the serviceData object
 * @param key the key
 */
export function getMultiValueSettingValueForKey(
    serviceData: OutlookFavoriteServiceDataType,
    key: string
): string[] {
    const settings =
        serviceData.MultiValueSettings &&
        serviceData.MultiValueSettings.filter(data => data.Key == key);
    return settings && settings.length === 1 ? settings[0].Values : [];
}

export function convertServiceResponseToFavoriteData(
    serviceData: OutlookFavoriteServiceDataType,
    favoriteKind: OutlookFavoriteKind
): FavoriteData {
    let favoriteData;

    switch (favoriteKind) {
        case 'folder':
            const favoriteFolderData: Partial<FavoriteFolderData> = {
                type: 'folder',
                folderId: convertRestFolderIdToEWSFolderId(
                    serviceData.SingleValueSettings[0].Value
                ),
            };
            favoriteData = favoriteFolderData;
            break;

        case 'persona':
            const searchFolderId = getSingleValueSettingValueForKey(
                serviceData,
                SEARCH_FOLDER_ID_KEY
            );

            // Conversion necessary because OWA uses OWS (and EWS Ids) for managing folders
            const convertedSearchFolderId = searchFolderId
                ? convertRestFolderIdToEWSFolderId(searchFolderId)
                : null;

            const allEmailAddresses = getMultiValueSettingValueForKey(
                serviceData,
                EMAIL_ADDRESSES_KEY
            );
            const mailEmailAddress = getSingleValueSettingValueForKey(
                serviceData,
                MAIN_EMAIL_ADDRESS_KEY
            );
            const personaId = getSingleValueSettingValueForKey(serviceData, PERSONA_ID_KEY);

            const contactDisplayName = getSingleValueSettingValueForKey(
                serviceData,
                CONTACT_DISPLAYNAME_KEY
            );
            const contactMainEmailAddress = getSingleValueSettingValueForKey(
                serviceData,
                CONTACT_EMAIL_ADDRESS_KEY
            );

            const favoritePersonaData: Partial<FavoritePersonaData> = {
                type: 'persona',
                searchFolderId: convertedSearchFolderId,
                allEmailAddresses: allEmailAddresses,
                mainEmailAddress: mailEmailAddress,
                isSearchFolderPopulated: !!convertedSearchFolderId,
                personaId: personaId,
                contactDisplayName: contactDisplayName,
                contactMainEmailAddress: contactMainEmailAddress,
                isSyncUpdateDone: false,
            };
            favoriteData = favoritePersonaData;
            break;

        case 'privatedistributionlist':
            const pdlSearchFolderId = getSingleValueSettingValueForKey(
                serviceData,
                SEARCH_FOLDER_ID_KEY
            );

            // Conversion necessary because OWA uses OWS (and EWS Ids) for managing folders
            const pdlConvertedSearchFolderId = pdlSearchFolderId
                ? convertRestFolderIdToEWSFolderId(pdlSearchFolderId)
                : null;

            const pdlId = getSingleValueSettingValueForKey(serviceData, PDL_ID_KEY);

            const owsPersonaId = getSingleValueSettingValueForKey(serviceData, 'PersonaId');
            const convertedOwsPersonaId = owsPersonaId
                ? convertRestFolderIdToEWSFolderId(owsPersonaId)
                : null;

            const memberEmails = getMultiValueSettingValueForKey(serviceData, EMAIL_ADDRESSES_KEY);
            const memberNames = getMultiValueSettingValueForKey(serviceData, MEMBER_NAMES_KEY);

            const members: PrivateDistributionListMember[] = [];

            for (let index = 0; index < memberEmails.length; index++) {
                members.push({
                    name: memberNames[index],
                    emailAddress: memberEmails[index],
                });
            }

            const favoritePrivateDistributionListData: Partial<FavoritePrivateDistributionListData> = {
                type: 'privatedistributionlist',
                searchFolderId: pdlConvertedSearchFolderId,
                isSearchFolderPopulated: !!pdlConvertedSearchFolderId,
                pdlId: pdlId,
                members: members,
                owsPersonaId: convertedOwsPersonaId,
            };

            favoriteData = favoritePrivateDistributionListData;

            break;

        case 'group':
            const favoriteGroupData: Partial<FavoriteGroupData> = {
                type: 'group',
                groupId: serviceData.SingleValueSettings[0].Value.toLowerCase(),
                groupSmtp: getSingleValueSettingValueForKey(
                    serviceData,
                    GROUP_SMTP_KEY
                ).toLowerCase(),
                groupExternalDirectoryObjectId: getSingleValueSettingValueForKey(
                    serviceData,
                    GROUP_EXTERNAL_DIRCTORY_OBJECT_ID_KEY
                ),
            };

            favoriteData = favoriteGroupData;
            break;

        case 'category':
            const favoriteCategoryData: Partial<FavoriteCategoryData> = {
                type: 'category',
                categoryId: serviceData.SingleValueSettings[0].Value,
            };

            favoriteData = favoriteCategoryData;
            break;

        case 'search':
            const favoriteSearchData: Partial<FavoriteSearchData> = {
                type: 'search',
                searchQuery: serviceData.SingleValueSettings[0].Value,
            };

            favoriteData = favoriteSearchData;
            break;

        case 'publicFolder':
            const favoritePublicFolderData: Partial<FavoritePublicFolderData> = {
                type: 'publicFolder',
                publicFolderId: getSingleValueSettingValueForKey(serviceData, 'FolderId'),
            };

            favoriteData = favoritePublicFolderData;
            break;
        default:
            const favoriteDataLocal: Partial<FavoriteData> = {
                type: serviceData.Type,
            };

            favoriteData = favoriteDataLocal;
            break;
    }

    favoriteData.treeType = 'favorites';
    favoriteData.favoriteId = serviceData.Id;
    favoriteData.displayName = serviceData.DisplayName;
    favoriteData.client = serviceData.Client as FavoriteDataClient;
    favoriteData.lastModifiedTime = serviceData.LastModifiedTime;

    return favoriteData as FavoriteData;
}
