import createSetItemExtendedPropertyField from './utils/createSetItemExtendedPropertyField';
import createSetItemField from './utils/createSetItemField';
import createDeleteItemExtendedPropertyField from './utils/createDeleteItemExtendedPropertyField';
import type Item from 'owa-service/lib/contract/Item';
import type Message from 'owa-service/lib/contract/Message';
import type PropertyUpdate from 'owa-service/lib/contract/PropertyUpdate';
import type RightsManagementLicenseDataType from 'owa-service/lib/contract/RightsManagementLicenseDataType';
import type UpdateItemResponse from 'owa-service/lib/contract/UpdateItemResponse';
import itemChange from 'owa-service/lib/factory/itemChange';
import itemId from 'owa-service/lib/factory/itemId';
import itemResponseShape from 'owa-service/lib/factory/itemResponseShape';
import propertyUri from 'owa-service/lib/factory/propertyUri';
import updateItemRequest from 'owa-service/lib/factory/updateItemRequest';
import updateItemOperation from 'owa-service/lib/operation/updateItemOperation';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import getOutboundCharset from 'owa-session-store/lib/selectors/getOutboundCharset';

function createRequestBody(
    messageType: Message,
    isSend: boolean,
    IRMData: RightsManagementLicenseDataType,
    keysOfInternetHeadersToBeRemoved: string[]
) {
    const smimeUpdates = [];
    // Add MimeContent when the current message is S/MIME
    if (messageType.MimeContent) {
        smimeUpdates.push(createSetItemField('MimeContent', messageType.MimeContent));
    }

    const updates: PropertyUpdate[] = [
        createSetItemField('ToRecipients', messageType.ToRecipients),
        createSetItemField('CcRecipients', messageType.CcRecipients),
        createSetItemField('BccRecipients', messageType.BccRecipients),
        createSetItemField('Subject', messageType.Subject),
        createSetItemField('Body', messageType.Body),
        createSetItemField('Importance', messageType.Importance),
        createSetItemField('IsReadReceiptRequested', messageType.IsReadReceiptRequested),
        createSetItemField('IsDeliveryReceiptRequested', messageType.IsDeliveryReceiptRequested),
    ];

    if (messageType.Attachments?.length) {
        updates.push(createSetItemField('Attachments', messageType.Attachments));
    }

    if (messageType.ItemClass) {
        updates.push(createSetItemField('ItemClass', messageType.ItemClass));
    }

    if (messageType.From) {
        updates.push(createSetItemField('From', messageType.From));
    }

    if (keysOfInternetHeadersToBeRemoved.length > 0) {
        keysOfInternetHeadersToBeRemoved.map(key => {
            updates.push(createDeleteItemExtendedPropertyField('InternetHeaders', key));
        });
    }

    if (isSend) {
        updates.push(createDeleteItemExtendedPropertyField('Common', 'AppendOnSend'));
    }

    if (messageType.MentionsEx) {
        updates.push(createSetItemField('MentionsEx', messageType.MentionsEx));
    }

    if (messageType.PendingSocialActivityTagIds) {
        updates.push(
            createSetItemField(
                'PendingSocialActivityTagIds',
                messageType.PendingSocialActivityTagIds
            )
        );
    }

    if (messageType.Sensitivity) {
        updates.push(createSetItemField('Sensitivity', messageType.Sensitivity));
    }

    if (messageType.ExtendedProperty) {
        messageType.ExtendedProperty.map(extendedProperty => {
            updates.push(createSetItemExtendedPropertyField(extendedProperty));
        });
    }

    if (isSend && messageType.DocLinks && messageType.DocLinks.length > 0) {
        updates.push(createSetItemField('DocLinks', messageType.DocLinks));
    }

    const itemChanges = itemChange({
        /**
            It is important for the S/MIME updates to be listed before other updates.
            Otherwise, "preview" will not be set to "" by the server in case of S/MIME encrypted messages
        " */
        Updates: [...smimeUpdates, ...updates],
        ItemId: itemId({
            Id: messageType.ItemId.Id,
            ChangeKey: messageType.ItemId.ChangeKey,
        }),
    });

    const request = updateItemRequest({
        ItemChanges: [itemChanges],
        ConflictResolution: 'AlwaysOverwrite',
        ClientSupportsIrm: true,
        SendCalendarInvitationsOrCancellations: 'SendToNone',
        MessageDisposition: isSend ? 'SendAndSaveCopy' : 'SaveOnly',
        SuppressReadReceipts: false,
        ComposeOperation: 'newMail',
        PromoteInlineAttachments: false,
        SendOnNotFoundError: true,
        ItemShape: itemResponseShape({
            // Pass IdOnly as ShapeName here so that the response will contain LastModifiedTime
            BaseShape: 'IdOnly',
            AdditionalProperties: [propertyUri({ FieldURI: 'ItemLastModifiedTime' })],
        }),
        ...getOutboundCharset(),
    });

    if (IRMData?.IsOwner) {
        // If no encryption, need to explicitly set complianceId to '0' to remove any pre set IRM state
        request.ComplianceId = IRMData.RmsTemplateId ? IRMData.RmsTemplateId.toUpperCase() : '0';
    }

    return request;
}

export default function sendOrSaveMessageService(
    itemType: Item,
    isSend: boolean,
    IRMData: RightsManagementLicenseDataType,
    keysOfInternetHeadersToBeRemoved: string[]
): Promise<UpdateItemResponse> {
    const requestBody = createRequestBody(
        itemType as Message,
        isSend,
        IRMData,
        keysOfInternetHeadersToBeRemoved
    );

    return updateItemOperation({
        Header: getJsonRequestHeader(),
        Body: requestBody,
    }).then(response => {
        return response
            ? Promise.resolve(response.Body)
            : Promise.reject(new Error('ErrorSessionTimeout')); // When get HTTP 401/440, the response will be null
    });
}
