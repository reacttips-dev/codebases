import type BodyType from 'owa-service/lib/contract/BodyType';
import type CreateItemResponse from 'owa-service/lib/contract/CreateItemResponse';
import type Item from 'owa-service/lib/contract/Item';
import postUnifiedGroupItemOperation from 'owa-service/lib/operation/postUnifiedGroupItemOperation';
import postUnifiedGroupItemRequest from 'owa-service/lib/factory/postUnifiedGroupItemRequest';
import itemResponseShape from 'owa-service/lib/factory/itemResponseShape';
import propertyUri from 'owa-service/lib/factory/propertyUri';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import type RequestOptions from 'owa-service/lib/RequestOptions';

function createRequestBodyFromItem(
    groupId: string,
    itemType: Item,
    bodyType: BodyType,
    timeFormat: string,
    isInlineCompose?: boolean
) {
    const request = postUnifiedGroupItemRequest({
        ModernGroupEmailAddress: {
            EmailAddress: groupId,
            MailboxType: 'GroupMailbox',
        },
        SkipGroupSyncDelivery: true,
        ClientSupportsIrm: true,
        Item: itemType,
        ItemShape: itemResponseShape({
            // Pass IdOnly as ShapeName here so that the response will contain LastModifiedTime
            BaseShape: 'IdOnly',
            AdditionalProperties: [propertyUri({ FieldURI: 'ItemLastModifiedTime' })],
        }),
    });

    if (isInlineCompose) {
        // If sending from inlineCompose, request the internetMessageId in case we don't have it yet.
        request.ItemShape.ReturnOnlyInternetMessageId = true;
    }

    return request;
}

export default function createResponseFromGroup(
    groupId: string,
    itemType: Item,
    bodyType: BodyType,
    timeFormat: string,
    requestOptions: RequestOptions,
    isInlineCompose?: boolean
): Promise<CreateItemResponse> {
    const requestBody = createRequestBodyFromItem(
        groupId,
        itemType,
        bodyType,
        timeFormat,
        isInlineCompose
    );

    return postUnifiedGroupItemOperation(
        {
            Header: getJsonRequestHeader(),
            Body: requestBody,
        },
        requestOptions
    ).then(response => {
        return response
            ? Promise.resolve(response.Body)
            : Promise.reject(new Error('ErrorSessionTimeout')); // When get HTTP 401/440, the response will be null
    });
}
