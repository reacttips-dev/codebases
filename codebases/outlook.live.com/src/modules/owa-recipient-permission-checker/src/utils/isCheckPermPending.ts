import getPermissionCheckerInfo from '../selectors/getPermissionCheckerInfo';

export default function isCheckPermPending(composeId: string): boolean {
    const permissionCheckerInfo = getPermissionCheckerInfo(composeId);
    return permissionCheckerInfo?.pendingCheckPermCount > 0;
}
