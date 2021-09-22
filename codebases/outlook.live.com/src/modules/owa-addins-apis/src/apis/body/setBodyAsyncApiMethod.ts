import { getAdapter, MessageComposeAdapter } from 'owa-addins-adapters';
import type { ApiMethodCallback } from '../ApiMethod';
import { CoercionType } from '../../index';
import type { SetDataAdapterMethod } from '../setData/SetDataAdapterMethod';
import type { SetDataArgs } from '../setData/SetDataArgs';
import setDataAsyncApiMethodBase from '../setData/setDataAsyncApiMethodBase';
import { returnErrorIfUserCannotEditItem } from '../sharedProperties/itemPermissions';
import type BodyType from 'owa-service/lib/contract/BodyType';

export default async function setBodyAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    args: SetDataArgs,
    callback: ApiMethodCallback
) {
    const adapter: MessageComposeAdapter = getAdapter(hostItemIndex) as MessageComposeAdapter;

    if (returnErrorIfUserCannotEditItem(adapter, callback)) {
        return;
    }

    const bodyType: BodyType = args.coercionType == CoercionType.Html ? 'HTML' : 'Text';
    const setBody: SetDataAdapterMethod = (content: string) => adapter.setBody(content, bodyType);

    await setDataAsyncApiMethodBase(hostItemIndex, controlId, args, callback, setBody);
}
