import type ItemResponseShape from 'owa-service/lib/contract/ItemResponseShape';
import itemResponseShape from 'owa-service/lib/factory/itemResponseShape';
import propertyUri from 'owa-service/lib/factory/propertyUri';
import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';

const FindItemShapeName: string = 'MailListItem';

/**
 * Gets find item response shape.
 * @returns The ItemResponsShapee
 */
export function getFindItemResponseShape(folderId?: string): ItemResponseShape {
    // If we are in the scheduled folder, additionally request ReturnTime
    if (folderId && folderIdToName(folderId) == 'scheduled') {
        return itemResponseShape({
            BaseShape: 'IdOnly',
            AdditionalProperties: [propertyUri({ FieldURI: 'ReturnTime' })],
        });
    }
    return itemResponseShape({ BaseShape: 'IdOnly' });
}

/**
 * Gets find item shape name
 * @returns the shape name
 */
export function getFindItemShape(): string {
    return FindItemShapeName;
}
