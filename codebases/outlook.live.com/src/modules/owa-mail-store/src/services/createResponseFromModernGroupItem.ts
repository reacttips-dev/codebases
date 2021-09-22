import { getComposeItemResponseShape } from 'owa-mail-compose-item-response-shape/lib/getComposeItemResponseShape';
import type BodyType from 'owa-service/lib/contract/BodyType';
import type CreateItemResponse from 'owa-service/lib/contract/CreateItemResponse';
import type Item from 'owa-service/lib/contract/Item';
import createResponseFromModernGroupRequest from 'owa-service/lib/factory/createResponseFromModernGroupRequest';
import itemResponseShape from 'owa-service/lib/factory/itemResponseShape';
import propertyUri from 'owa-service/lib/factory/propertyUri';
import createResponseFromModernGroupOperation from 'owa-service/lib/operation/createResponseFromModernGroupOperation';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import getOutboundCharset from 'owa-session-store/lib/selectors/getOutboundCharset';

function createRequestBodyFromItem(
    groupSmtpAddress: string,
    itemType: Item,
    bodyType: BodyType,
    isSend: boolean,
    timeFormat: string,
    isInlineCompose?: boolean
) {
    const request = createResponseFromModernGroupRequest({
        ClientSupportsIrm: true,
        ComposeOperation: 'newPost',
        MessageDisposition: isSend ? 'SendAndSaveCopy' : 'SaveOnly',
        Items: [itemType],
        TimeFormat: timeFormat,
        ItemShape: itemResponseShape({
            // Pass IdOnly as ShapeName here so that the response will contain LastModifiedTime
            BaseShape: 'IdOnly',
            AdditionalProperties: [propertyUri({ FieldURI: 'ItemLastModifiedTime' })],
        }),
        ...getOutboundCharset(),
    });

    if (!isSend) {
        request.ItemShape = getComposeItemResponseShape(bodyType);
        request.ShapeName = 'MailCompose';
    } else if (isInlineCompose) {
        // If sending from inlineCompose, request the internetMessageId in case we don't have it yet.
        request.ItemShape.ReturnOnlyInternetMessageId = true;
    }

    request.GroupSmtpAddress = groupSmtpAddress;

    return request;
}

export default function createResponseFromGroup(
    groupSmtpAddress: string,
    itemType: Item,
    bodyType: BodyType,
    isSend: boolean,
    timeFormat: string,
    isInlineCompose?: boolean
): Promise<CreateItemResponse> {
    const requestBody = createRequestBodyFromItem(
        groupSmtpAddress,
        itemType,
        bodyType,
        isSend,
        timeFormat,
        isInlineCompose
    );

    return createResponseFromModernGroupOperation({
        Header: getJsonRequestHeader(),
        Body: requestBody,
    }).then(response => {
        return response
            ? Promise.resolve(response.Body)
            : Promise.reject(new Error('ErrorSessionTimeout')); // When get HTTP 401/440, the response will be null
    });
}
