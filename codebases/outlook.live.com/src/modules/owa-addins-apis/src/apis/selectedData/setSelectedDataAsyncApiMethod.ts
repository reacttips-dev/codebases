import { getAdapter, MessageComposeAdapter } from 'owa-addins-adapters';
import { ApiErrorCode } from '../ApiErrorCode';
import type { ApiMethodCallback } from '../ApiMethod';
import { createErrorResult } from '../ApiMethodResponseCreator';
import { CoercionType } from '../../index';
import type { SetDataAdapterMethod } from '../setData/SetDataAdapterMethod';
import type { SetDataArgs } from '../setData/SetDataArgs';
import setDataAsyncApiMethodBase from '../setData/setDataAsyncApiMethodBase';
import { returnErrorIfUserCannotEditItem } from '../sharedProperties/itemPermissions';

export default async function setSelectedDataAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    args: SetDataArgs,
    callback: ApiMethodCallback
) {
    const adapter: MessageComposeAdapter = getAdapter(hostItemIndex) as MessageComposeAdapter;

    if (returnErrorIfUserCannotEditItem(adapter, callback)) {
        return;
    }

    const selectedData = adapter.getSelectedData();

    if (selectedData == null) {
        callback(createErrorResult(ApiErrorCode.InvalidSelection));
        return;
    }

    if (
        args.coercionType === CoercionType.Html &&
        (selectedData.sourceProperty === 'subject' ||
            (selectedData.sourceProperty === 'body' && adapter.getBodyType() === 'Text'))
    ) {
        callback(createErrorResult(ApiErrorCode.OoeInvalidDataFormat));
        return;
    }

    await setDataAsyncApiMethodBase(
        hostItemIndex,
        controlId,
        args,
        callback,
        adapter.setSelectedData as SetDataAdapterMethod,
        adapter.getSelectedData
    );
}
