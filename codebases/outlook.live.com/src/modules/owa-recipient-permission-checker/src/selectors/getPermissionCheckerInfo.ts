import type PermissionCheckerInfo from '../store/schema/PermissionCheckerInfo';
import getStore from '../store/store';

export default function getPermissionCheckerInfo(composeId: string): PermissionCheckerInfo {
    const store = getStore();

    return store.permissionCheckers.get(composeId);
}
