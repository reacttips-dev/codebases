import type ExchangeVersionType from 'owa-service/lib/contract/ExchangeVersionType';
import type ItemResponseShape from 'owa-service/lib/contract/ItemResponseShape';
import type Message from 'owa-service/lib/contract/Message';
import type MeetingMessage from 'owa-service/lib/contract/MeetingMessage';
import type MeetingResponseMessageType from 'owa-service/lib/contract/MeetingResponseMessageType';
import type MeetingRequestMessageType from 'owa-service/lib/contract/MeetingRequestMessageType';
import type Item from 'owa-service/lib/contract/Item';
import getItemRequest from 'owa-service/lib/factory/getItemRequest';
import itemId from 'owa-service/lib/factory/itemId';
import managementRoleType from 'owa-service/lib/factory/managementRoleType';
import getItemOperation from 'owa-service/lib/operation/getItemOperation';
import type RequestOptions from 'owa-service/lib/RequestOptions';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import { trace } from 'owa-trace';
import type ItemInfoResponseMessage from 'owa-service/lib/contract/ItemInfoResponseMessage';
import handleServerResponseSuccessAndError from 'owa-service-utils/lib/handleServerResponseSuccessAndError';

export default function getItem(
    id: string,
    itemShape: ItemResponseShape,
    shapeName?: string,
    requestServerVersion?: ExchangeVersionType,
    options?: RequestOptions,
    isDiscovery?: boolean
): Promise<
    | Item
    | Message
    | MeetingResponseMessageType
    | MeetingRequestMessageType
    | MeetingMessage
    | Error
    | null
>;

export default function getItem(
    id: string[],
    itemShape: ItemResponseShape,
    shapeName?: string,
    requestServerVersion?: ExchangeVersionType,
    options?: RequestOptions,
    isDiscovery?: boolean
): Promise<
    | (Item | Message | MeetingResponseMessageType | MeetingRequestMessageType | MeetingMessage)[]
    | Error
    | null
>;

export default function getItem(
    id: null,
    itemShape: ItemResponseShape,
    shapeName: string | undefined,
    requestServerVersion: ExchangeVersionType | undefined,
    options: RequestOptions | undefined,
    isDiscovery: boolean | undefined,
    internetMessageId: string
): Promise<
    | (Item | Message | MeetingResponseMessageType | MeetingRequestMessageType | MeetingMessage)[]
    | Error
    | null
>;

export default function getItem(
    id: string | string[] | null,
    itemShape: ItemResponseShape,
    shapeName?: string,
    requestServerVersion?: ExchangeVersionType,
    options?: RequestOptions,
    isDiscovery?: boolean,
    internetMessageId?: string
): Promise<
    | (Item | Message | MeetingResponseMessageType | MeetingRequestMessageType | MeetingMessage)[]
    | Item
    | Message
    | MeetingResponseMessageType
    | MeetingRequestMessageType
    | MeetingMessage
    | Error
    | null
> {
    const jsonRequestHeader = getJsonRequestHeader();

    if (requestServerVersion) {
        jsonRequestHeader.RequestServerVersion = requestServerVersion;
    }

    if (isDiscovery) {
        jsonRequestHeader.ManagementRole = managementRoleType({ UserRoles: ['MailboxSearch'] });
    }

    return getItemOperation(
        {
            Header: jsonRequestHeader,
            Body: getItemRequest({
                ItemShape: itemShape,
                ItemIds: Array.isArray(id)
                    ? id.map(id => itemId({ Id: id }))
                    : id
                    ? [itemId({ Id: id })]
                    : [],
                ShapeName: shapeName ?? undefined,
                InternetMessageId: internetMessageId,
            }),
        },
        options
    )
        .then(
            response =>
                response?.Body?.ResponseMessages?.Items as ItemInfoResponseMessage[] | undefined
        )
        .then(responseMessages =>
            handleServerResponseSuccessAndError(responseMessages).then(() => responseMessages)
        )
        .then(responseMessages => {
            if (!responseMessages?.length) {
                return null;
            }

            let allItems: Item[] = [];

            // Concatenate all the items from their response messages
            // ResponseMessages has an array of Items and each entry is an array of Items
            responseMessages.forEach(responseMessage => {
                allItems = allItems.concat(responseMessage.Items);
            });

            if (!allItems.length) {
                return null;
            }

            return Array.isArray(id) || internetMessageId !== undefined ? allItems : allItems[0];
        })
        .catch(e => {
            trace.warn('GetItem:' + e.message);
            // Squash errors and explictly return them.
            //
            // Consumers must explicitly handle errors
            return e;
        });
}
