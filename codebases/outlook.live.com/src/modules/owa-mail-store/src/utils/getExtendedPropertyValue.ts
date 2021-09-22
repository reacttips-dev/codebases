import type Item from 'owa-service/lib/contract/Item';

export default function getExtendedPropertyValue(
    item: Item,
    tag: string,
    name?: string,
    id?: number
) {
    const extendedProperty = getExtendedProperty(item, tag, name, id);
    return extendedProperty ? extendedProperty.Value : null;
}

export function getExtendedProperty(item: Item, tag: string, name?: string, id?: number) {
    if (!item || !item.ExtendedProperty) {
        return null;
    }

    for (let i = 0; i < item.ExtendedProperty.length; i++) {
        const extendedProperty = item.ExtendedProperty[i];
        let propertyTag = null,
            propertyName = null,
            propertyId = null;
        if (extendedProperty?.ExtendedFieldURI) {
            propertyTag = extendedProperty.ExtendedFieldURI.PropertyTag;
            propertyName = extendedProperty.ExtendedFieldURI.PropertyName;
            propertyId = extendedProperty.ExtendedFieldURI.PropertyId;
        }

        if (tag && propertyTag == tag) {
            return extendedProperty;
        }
        if (name && propertyName == name) {
            return extendedProperty;
        }
        if (id && propertyId == id) {
            return extendedProperty;
        }
    }

    return null;
}
