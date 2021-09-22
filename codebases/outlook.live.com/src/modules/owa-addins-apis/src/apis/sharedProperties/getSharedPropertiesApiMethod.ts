import { getAdapter, CommonAdapter } from 'owa-addins-adapters';
import type { ApiMethodCallback } from '../ApiMethod';
import { createSuccessResult } from '../ApiMethodResponseCreator';
import { getExtensibilityContext } from 'owa-addins-store';
import { getUserEmailAddress } from 'owa-session-store';
import {
    ApiSharedProperties,
    DelegatePermissions,
    DelegatePermissionsBitMapValues,
} from 'owa-addins-apis-types';
import getAutoDiscoverRestUrl from '../../services/getAutoDiscoverRestUrl';

export default async function getSharedPropertiesAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: any,
    callback: ApiMethodCallback
) {
    const adapter: CommonAdapter = getAdapter(hostItemIndex) as CommonAdapter;
    const adapterSharedProperties = adapter.getSharedProperties();
    let targetRestUrl;
    let targetMailbox;

    // All shared folders in Mail are links to the remote folder. In Calendar, there could be single
    // copy or delegate can have copy of the calendar in their local mailbox depending on old or new infra.
    if (adapter.isRemoteItem()) {
        targetMailbox = adapterSharedProperties.owner;
        try {
            targetRestUrl = await getAutoDiscoverRestUrl(adapterSharedProperties.owner);
        } catch {
            targetRestUrl = undefined;
        }
    } else {
        targetMailbox = getUserEmailAddress();
        targetRestUrl = getExtensibilityContext().RestUrl;
    }

    const delegatePermissions = getDelegatePermissionsBitMap(
        adapterSharedProperties.delegatePermissions
    );

    const apiSharedProperties: ApiSharedProperties = {
        delegatePermissions: delegatePermissions,
        owner: adapterSharedProperties.owner,
        targetRestUrl: targetRestUrl,
        targetMailbox: targetMailbox,
    };

    callback(createSuccessResult(apiSharedProperties));
}

function getDelegatePermissionsBitMap(permissions: DelegatePermissions): number {
    let permissionsBitMap = 0;

    if (permissions.Read) {
        permissionsBitMap += DelegatePermissionsBitMapValues.Read;
    }

    if (permissions.Create) {
        permissionsBitMap += DelegatePermissionsBitMapValues.Create;
    }

    if (permissions.DeleteOwn) {
        permissionsBitMap += DelegatePermissionsBitMapValues.DeleteOwn;
    }

    if (permissions.DeleteAll) {
        permissionsBitMap += DelegatePermissionsBitMapValues.DeleteAll;
    }

    if (permissions.EditOwn) {
        permissionsBitMap += DelegatePermissionsBitMapValues.EditOwn;
    }

    if (permissions.EditAll) {
        permissionsBitMap += DelegatePermissionsBitMapValues.EditAll;
    }

    return permissionsBitMap;
}
