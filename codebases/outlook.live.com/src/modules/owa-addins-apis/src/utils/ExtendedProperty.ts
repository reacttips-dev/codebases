import type Item from 'owa-service/lib/contract/Item';

export function getExtendedProperty(item: Item, propertyTag: string): string {
    if (!item.ExtendedProperty) {
        return null;
    }

    for (let i = 0; i < item.ExtendedProperty.length; i++) {
        const extendedProperty = item.ExtendedProperty[i];
        if (
            extendedProperty?.ExtendedFieldURI &&
            extendedProperty.ExtendedFieldURI.PropertyTag === propertyTag
        ) {
            return extendedProperty.Value;
        }
    }

    return null;
}
