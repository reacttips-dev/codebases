import { getHeaders } from 'owa-headers';
import type BodyType from 'owa-service/lib/contract/BodyType';
import type CreateItemResponse from 'owa-service/lib/contract/CreateItemResponse';
import type Item from 'owa-service/lib/contract/Item';
import type RightsManagementLicenseDataType from 'owa-service/lib/contract/RightsManagementLicenseDataType';
import itemResponseShape from 'owa-service/lib/factory/itemResponseShape';
import postGroupItemRequest from 'owa-service/lib/factory/postGroupItemRequest';
import propertyUri from 'owa-service/lib/factory/propertyUri';
import postGroupItemOperation from 'owa-service/lib/operation/postGroupItemOperation';
import type RequestOptions from 'owa-service/lib/RequestOptions';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import getOutboundCharset from 'owa-session-store/lib/selectors/getOutboundCharset';

function createRequestBodyFromItem(
    groupId: string,
    itemType: Item,
    bodyType: BodyType,
    timeFormat: string,
    IRMData: RightsManagementLicenseDataType,
    isInlineCompose?: boolean
) {
    const request = postGroupItemRequest({
        ModernGroupEmailAddress: {
            EmailAddress: groupId,
            MailboxType: 'GroupMailbox',
        },
        ClientSupportsIrm: true,
        ComposeOperation: 'newPost',
        MessageDisposition: 'SendAndSaveCopy',
        Items: [itemType],
        TimeFormat: timeFormat,
        ItemShape: itemResponseShape({
            // Pass IdOnly as ShapeName here so that the response will contain LastModifiedTime
            BaseShape: 'IdOnly',
            AdditionalProperties: [propertyUri({ FieldURI: 'ItemLastModifiedTime' })],
        }),
        ...getOutboundCharset(),
    });

    if (isInlineCompose) {
        // If sending from inlineCompose, request the internetMessageId in case we don't have it yet.
        request.ItemShape.ReturnOnlyInternetMessageId = true;
    }

    if (IRMData?.IsOwner) {
        // If no encryption, need to explicitly set complianceId to '0' to remove any pre set IRM state
        request.ComplianceId = IRMData.RmsTemplateId ? IRMData.RmsTemplateId.toUpperCase() : '0';
    }

    return request;
}

export default function postGroupItem(
    groupId: string,
    itemType: Item,
    bodyType: BodyType,
    timeFormat: string,
    IRMData: RightsManagementLicenseDataType,
    isInlineCompose?: boolean
): Promise<CreateItemResponse> {
    const requestBody = createRequestBodyFromItem(
        groupId,
        itemType,
        bodyType,
        timeFormat,
        IRMData,
        isInlineCompose
    );

    const requestOptions: RequestOptions = {
        headers: getHeaders(
            null, // explicit logon smtp, PostGroupItem requests needs to go to the user's mailbox
            'GroupMailbox' // client action name
        ),
    };

    return postGroupItemOperation(
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
