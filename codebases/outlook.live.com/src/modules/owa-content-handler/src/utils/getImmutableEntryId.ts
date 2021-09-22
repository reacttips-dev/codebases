import updateExtendedProperty from 'owa-mail-compose-actions/lib/actions/updateExtendedProperty';
import getItem from 'owa-mail-store/lib/services/getItem';
import type ExtendedPropertyType from 'owa-service/lib/contract/ExtendedPropertyType';
import type ExtendedPropertyUri from 'owa-service/lib/contract/ExtendedPropertyUri';
import type Item from 'owa-service/lib/contract/Item';
import extendedPropertyUri from 'owa-service/lib/factory/extendedPropertyUri';
import itemResponseShape from 'owa-service/lib/factory/itemResponseShape';
import { trace } from 'owa-trace';

const IMMUTABLE_ENTRY_ID_PROPERTY_TAG = '0xe0b';
const BINARY_PROPERTY_TYPE = 'Binary';

const immutableEntryIdExtendedPropertyUri: ExtendedPropertyUri = extendedPropertyUri({
    PropertyTag: IMMUTABLE_ENTRY_ID_PROPERTY_TAG,
    PropertyType: BINARY_PROPERTY_TYPE,
});

export default async function getImmutableEntryId(item: Item): Promise<string> {
    let extendedProperty = getExtendedPropertyFromItem(item, IMMUTABLE_ENTRY_ID_PROPERTY_TAG);
    if (!extendedProperty) {
        const itemShape = itemResponseShape({
            BaseShape: 'IdOnly',
            AdditionalProperties: [immutableEntryIdExtendedPropertyUri],
        });

        // VSO 30283: Use null for shape name instead of ItemPart.
        // ItemPart is meant for GCI and hurts performance when used with GetItem.
        const itemOrError = await getItem(item.ItemId.Id, itemShape);
        if (itemOrError && !(itemOrError instanceof Error)) {
            extendedProperty = getExtendedPropertyFromItem(
                itemOrError,
                IMMUTABLE_ENTRY_ID_PROPERTY_TAG
            );
            updateExtendedProperty(item, extendedProperty);
        }
    }

    if (extendedProperty) {
        return extendedProperty.Value;
    } else {
        trace.info('[getImmutableEntryId] extendedProperty could not be retrieved');
        return null;
    }
}

function getExtendedPropertyFromItem(item: Item, propertyTag: string): ExtendedPropertyType {
    if (item) {
        const extendedProperties = item.ExtendedProperty;
        if (extendedProperties) {
            const numProperties = extendedProperties.length;
            for (let i = 0; i < numProperties; i++) {
                const prop = extendedProperties[i];
                if (prop?.ExtendedFieldURI?.PropertyTag === propertyTag) {
                    return prop;
                }
            }
        }
    }

    return null;
}
