import type BaseFolderType from 'owa-service/lib/contract/BaseFolderType';

function getExtendedProperty(item: BaseFolderType, propertyNameOrTag?: string): string | undefined {
    if (item.ExtendedProperty) {
        for (let i = 0; i < item.ExtendedProperty.length; i++) {
            let extendedProperty = item.ExtendedProperty[i];
            if (
                extendedProperty?.ExtendedFieldURI?.PropertyTag === propertyNameOrTag ||
                extendedProperty?.ExtendedFieldURI?.PropertyName === propertyNameOrTag
            ) {
                return extendedProperty.Value;
            }
        }
    }

    return undefined;
}

export default getExtendedProperty;
