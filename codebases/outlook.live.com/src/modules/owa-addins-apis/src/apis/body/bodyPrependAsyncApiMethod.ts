import { getAdapter, MessageComposeAdapter } from 'owa-addins-adapters';
import { ApiErrorCode } from '../ApiErrorCode';
import type { ApiMethodCallback } from '../ApiMethod';
import { createErrorResult } from '../ApiMethodResponseCreator';
import { CoercionType } from '../../index';
import type { SetDataAdapterMethod } from '../setData/SetDataAdapterMethod';
import type { SetDataArgs } from '../setData/SetDataArgs';
import setDataAsyncApiMethodBase from '../setData/setDataAsyncApiMethodBase';
import { returnErrorIfUserCannotEditItem } from '../sharedProperties/itemPermissions';

export default async function bodyPrependAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    args: SetDataArgs,
    callback: ApiMethodCallback
) {
    const adapter: MessageComposeAdapter = getAdapter(hostItemIndex) as MessageComposeAdapter;

    if (returnErrorIfUserCannotEditItem(adapter, callback)) {
        return;
    }

    if (args.coercionType === CoercionType.Html && adapter.getBodyType() === 'Text') {
        callback(createErrorResult(ApiErrorCode.OoeInvalidDataFormat));
        return;
    }

    await setDataAsyncApiMethodBase(
        hostItemIndex,
        controlId,
        args,
        callback,
        adapter.prependBody as SetDataAdapterMethod
    );
}
