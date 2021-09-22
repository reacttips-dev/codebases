import { getAdapter, MessageComposeAdapter } from 'owa-addins-adapters';
import type { ApiMethodCallback } from '../ApiMethod';
import type { SetDataAdapterMethod } from '../setData/SetDataAdapterMethod';
import type { SetDataArgs } from '../setData/SetDataArgs';
import setDataAsyncApiMethodBase from '../setData/setDataAsyncApiMethodBase';
import { returnErrorIfUserCannotEditItem } from '../sharedProperties/itemPermissions';

export default async function setBodySelectedDataAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    args: SetDataArgs,
    callback: ApiMethodCallback
) {
    const adapter: MessageComposeAdapter = getAdapter(hostItemIndex) as MessageComposeAdapter;

    if (returnErrorIfUserCannotEditItem(adapter, callback)) {
        return;
    }

    await setDataAsyncApiMethodBase(
        hostItemIndex,
        controlId,
        args,
        callback,
        adapter.setBodySelectedData as SetDataAdapterMethod,
        adapter.getSelectedData
    );
}
