import andType from 'owa-service/lib/factory/and';
import constant from 'owa-service/lib/factory/constant';
import type DistinguishedFolderIdName from 'owa-service/lib/contract/DistinguishedFolderIdName';
import fieldURIOrConstantType from 'owa-service/lib/factory/fieldURIOrConstantType';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import isEqualTo from 'owa-service/lib/factory/isEqualTo';
import type IsEqualToType from 'owa-service/lib/contract/IsEqualTo';
import isNotEqualTo from 'owa-service/lib/factory/isNotEqualTo';
import type IsNotEqualToType from 'owa-service/lib/contract/IsNotEqualTo';
import orType from 'owa-service/lib/factory/or';
import propertyUri from 'owa-service/lib/factory/propertyUri';
import type RestrictionType from 'owa-service/lib/contract/RestrictionType';
import restrictionType from 'owa-service/lib/factory/restrictionType';

export type { RestrictionType };
export const EXCLUDED_FOLDERS: DistinguishedFolderIdName[] = [
    'deleteditems',
    'conversationhistory',
    'teamchat',
];

export function createSearchPersonaRestriction(allEmailAddresses: string[]): RestrictionType {
    // A. Include items if displayName matches or any of the emails matches "From"
    const searchRestriction = orType({
        Items: allEmailAddresses.map(email => isEqualRestriction(email, 'From')),
    });

    // B. Don't include items from EXCLUDED_FOLDERS
    const excludedFoldersRestriction = andType({
        Items: EXCLUDED_FOLDERS.map(folderName => {
            const folderId = folderNameToId(folderName);
            return negativeRestriction(folderId, 'ParentFolderId');
        }),
    });

    // Return items only if A. and B. conditions are satisfied
    const restrictions = andType({
        Items: [searchRestriction, excludedFoldersRestriction],
    });

    return restrictionType({
        Item: restrictions,
    });
}

function isEqualRestriction(value: string, fieldURI: string): IsEqualToType {
    return isEqualTo({
        FieldURIOrConstant: fieldURIOrConstantType({
            Item: constant({
                Value: value,
            }),
        }),
        Item: propertyUri({
            FieldURI: fieldURI,
        }),
    });
}

function negativeRestriction(value: string, fieldURI: string): IsNotEqualToType {
    return isNotEqualTo({
        FieldURIOrConstant: fieldURIOrConstantType({
            Item: constant({
                Value: value,
            }),
        }),
        Item: propertyUri({
            FieldURI: fieldURI,
        }),
    });
}
