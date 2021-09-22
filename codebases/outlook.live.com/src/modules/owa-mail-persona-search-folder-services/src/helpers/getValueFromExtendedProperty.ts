import { PERSONA_NODE_ID_PROPERTY } from '../services/fetchFavoritePersonaSearchFolder';
import type FolderType from 'owa-service/lib/contract/Folder';

export function getValueFromExtendedProperty(
    propertyName: string,
    folder: FolderType
): string | undefined {
    const properties =
        folder.ExtendedProperty &&
        folder.ExtendedProperty.filter(
            property =>
                property.ExtendedFieldURI && property.ExtendedFieldURI.PropertyName === propertyName
        );

    if (properties && properties.length > 0) {
        return properties[0].Value;
    }

    return undefined;
}

export function getPersonaNodeIdFromExtendedProperty(folder: FolderType): string | undefined {
    return getValueFromExtendedProperty(PERSONA_NODE_ID_PROPERTY, folder);
}
