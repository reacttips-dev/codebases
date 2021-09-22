import getItemOperation from 'owa-service/lib/operation/getItemOperation';
import getItemRequest from 'owa-service/lib/factory/getItemRequest';
import type Item from 'owa-service/lib/contract/Item';
import itemId from 'owa-service/lib/factory/itemId';
import type ItemInfoResponseMessage from 'owa-service/lib/contract/ItemInfoResponseMessage';
import type ItemResponseShape from 'owa-service/lib/contract/ItemResponseShape';
import type ResponseClass from 'owa-service/lib/contract/ResponseClass';
import type SingleResponseMessage from 'owa-service/lib/contract/SingleResponseMessage';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';

const SuccessClass: ResponseClass = 'Success';

export default function getItem(
    ids: string[],
    itemShape: ItemResponseShape,
    shapeName: string
): Promise<Item> {
    const serviceItemIds = ids.map(id => {
        return itemId({ Id: id });
    });

    return getItemOperation({
        Header: getJsonRequestHeader(),
        Body: getItemRequest({
            ItemShape: itemShape,
            ItemIds: serviceItemIds,
            ShapeName: shapeName,
        }),
    }).then(response => processResponse(response.Body.ResponseMessages.Items[0]));
}

function processResponse(responseMessage: SingleResponseMessage): Item {
    if (responseMessage.ResponseClass == SuccessClass) {
        const response = responseMessage as ItemInfoResponseMessage;
        return response.Items[0];
    } else {
        return {};
    }
}
