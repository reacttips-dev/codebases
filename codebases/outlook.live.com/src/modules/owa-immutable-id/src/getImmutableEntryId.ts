import type ExtendedPropertyType from 'owa-service/lib/contract/ExtendedPropertyType';
import type ExtendedPropertyUri from 'owa-service/lib/contract/ExtendedPropertyUri';
import type Item from 'owa-service/lib/contract/Item';
import type ItemInfoResponseMessage from 'owa-service/lib/contract/ItemInfoResponseMessage';
import type ItemResponseShape from 'owa-service/lib/contract/ItemResponseShape';
import type SingleResponseMessage from 'owa-service/lib/contract/SingleResponseMessage';
import extendedPropertyUri from 'owa-service/lib/factory/extendedPropertyUri';
import getItemRequest from 'owa-service/lib/factory/getItemRequest';
import itemId from 'owa-service/lib/factory/itemId';
import itemResponseShape from 'owa-service/lib/factory/itemResponseShape';
import getItemOperation from 'owa-service/lib/operation/getItemOperation';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import { trace } from 'owa-trace';

const IMMUTABLE_ENTRY_ID_PROPERTY_TAG = '0xe0b';
const BINARY_PROPERTY_TYPE = 'Binary';

const immutableEntryIdExtendedPropertyUri: ExtendedPropertyUri = extendedPropertyUri({
    PropertyTag: IMMUTABLE_ENTRY_ID_PROPERTY_TAG,
    PropertyType: BINARY_PROPERTY_TYPE,
});

// functionality of this file is almost identical to
// packages/mail/packages/controls/owa-content-handler/lib/utils/getImmutableEntryId.ts
// minus the ability to cache the result in mail store
export default async function getImmutableEntryId(itemId: string): Promise<string | null> {
    let extendedProperty: ExtendedPropertyType | null = null;
    const itemShape = itemResponseShape({
        BaseShape: 'IdOnly',
        AdditionalProperties: [immutableEntryIdExtendedPropertyUri],
    });

    const response = await getItem([itemId], itemShape);
    if (response?.[0]?.ResponseClass === 'Success') {
        const responseMessage = response[0] as ItemInfoResponseMessage;
        const message = responseMessage.Items[0];
        extendedProperty = getExtendedPropertyFromItem(message, IMMUTABLE_ENTRY_ID_PROPERTY_TAG);
    }

    if (extendedProperty) {
        return extendedProperty.Value;
    } else {
        trace.info('[getImmutableEntryId] extendedProperty could not be retrieved');
        return null;
    }
}

function getExtendedPropertyFromItem(item: Item, propertyTag: string): ExtendedPropertyType | null {
    if (item) {
        const extendedProperties = item.ExtendedProperty;
        if (extendedProperties) {
            const numProperties = extendedProperties.length;
            for (let i = 0; i < numProperties; i++) {
                const prop = extendedProperties[i];
                if (prop.ExtendedFieldURI?.PropertyTag === propertyTag) {
                    return prop;
                }
            }
        }
    }

    return null;
}

function getItem(
    ids: string[],
    itemShape: ItemResponseShape
): Promise<SingleResponseMessage[] | null | undefined> {
    const jsonRequestHeader = getJsonRequestHeader();

    const serviceItemIds = ids.map(id => {
        return itemId({ Id: id });
    });
    return getItemOperation({
        Header: jsonRequestHeader,
        Body: getItemRequest({
            ItemShape: itemShape,
            ItemIds: serviceItemIds,
        }),
    })
        .then(response => {
            return response?.Body?.ResponseMessages?.Items;
        })
        .catch(e => {
            trace.warn('GetItem:' + e.message);
            return null;
        });
}
