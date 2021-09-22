import type ItemId from 'owa-service/lib/contract/ItemId';
import type RequestOptions from 'owa-service/lib/RequestOptions';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import cancelDeferredSendOperation from 'owa-service/lib/operation/cancelDeferredSendOperation';
import cancelDeferredSendRequest from 'owa-service/lib/factory/cancelDeferredSendRequest';
import { logUsage } from 'owa-analytics';

export default function cancelDeferredSendService(
    itemId: ItemId,
    options?: RequestOptions
): Promise<boolean> {
    logUsage('MailComposeDeferredSendCanceled');
    const jsonRequestHeader = getJsonRequestHeader();

    return cancelDeferredSendOperation(
        cancelDeferredSendRequest({
            Header: jsonRequestHeader,
            ItemId: itemId,
        }),
        options
    );
}
