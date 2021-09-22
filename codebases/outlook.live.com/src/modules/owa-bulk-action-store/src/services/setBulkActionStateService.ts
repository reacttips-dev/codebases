import itemChange from 'owa-service/lib/factory/itemChange';
import itemId from 'owa-service/lib/factory/itemId';
import type PropertyUpdate from 'owa-service/lib/contract/PropertyUpdate';
import updateItemOperation from 'owa-service/lib/operation/updateItemOperation';
import updateItemRequest from 'owa-service/lib/factory/updateItemRequest';
import type UpdateItemResponse from 'owa-service/lib/contract/UpdateItemResponse';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import * as trace from 'owa-trace';
import { BulkActionStateServerEnum } from '../store/schema/BulkActionStateEnum';

function createRequestBody(itemIdToUpdate: string, bulkActionState: string) {
    const singleItemChange = itemChange({
        Updates: [
            <PropertyUpdate>{
                __type: 'SetItemField:#Exchange',
                Path: {
                    __type: 'ExtendedPropertyUri:#Exchange',
                    DistinguishedPropertySetId: 'Common',
                    PropertyName: 'BulkActionState',
                    PropertyType: 'Integer',
                },
                Item: {
                    __type: 'Message:#Exchange',
                    ExtendedProperty: [
                        {
                            __type: 'ExtendedPropertyType:#Exchange',
                            ExtendedFieldURI: {
                                __type: 'ExtendedPropertyUri:#Exchange',
                                DistinguishedPropertySetId: 'Common',
                                PropertyName: 'BulkActionState',
                                PropertyType: 'Integer',
                            },
                            Value: bulkActionState,
                        },
                    ],
                },
            },
        ],
        ItemId: itemId({
            Id: itemIdToUpdate,
        }),
    });

    return updateItemRequest({
        ItemChanges: [singleItemChange],
        ConflictResolution: 'AlwaysOverwrite',
        MessageDisposition: 'SaveOnly',
    });
}

/**
 * Modify state of BulkAction item
 * @param itemIdToUpdate Item id to be updated
 * @param BulkActionState Int mapping to BulkActionState enum (running, complete etc.)
 */
export default function setBulkActionStateService(
    itemIdToUpdate: string,
    bulkActionState: number
): Promise<UpdateItemResponse> {
    if (bulkActionState in BulkActionStateServerEnum === false) {
        trace.errorThatWillCauseAlert('Invalid BulkActionState value sent to server.');
        return null;
    }
    const requestBody = createRequestBody(itemIdToUpdate, bulkActionState.toString());
    const jsonRequestHeader = getJsonRequestHeader();
    jsonRequestHeader.TimeZoneContext.TimeZoneDefinition.Id = 'UTC';

    return updateItemOperation({
        Header: jsonRequestHeader,
        Body: requestBody,
    }).then(response => {
        return response.Body.ResponseMessages.Items[0];
    });
}
