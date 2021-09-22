import RequestedCapabilities from 'owa-service/lib/contract/RequestedCapabilities';
import { getAddinCommandForControl, IAddinCommand } from 'owa-addins-store';
export default function doesAddinHaveRequiredPermission(
    controlId: string,
    apiPermissionLevelRequired: RequestedCapabilities
) {
    const addInCommand: IAddinCommand = getAddinCommandForControl(controlId);
    var requiredPermissions = false;
    var addinPermission = addInCommand?.extension?.RequestedCapabilities;
    switch (apiPermissionLevelRequired) {
        case RequestedCapabilities.Restricted:
            requiredPermissions = true;
            break;
        case RequestedCapabilities.ReadItem:
            if (
                addinPermission == RequestedCapabilities.ReadItem ||
                addinPermission == RequestedCapabilities.ReadWriteItem ||
                addinPermission == RequestedCapabilities.ReadWriteMailbox
            ) {
                requiredPermissions = true;
            }
            break;
        case RequestedCapabilities.ReadWriteItem:
            if (
                addinPermission == RequestedCapabilities.ReadWriteItem ||
                addinPermission == RequestedCapabilities.ReadWriteMailbox
            ) {
                requiredPermissions = true;
            }
            break;
        case RequestedCapabilities.ReadWriteMailbox:
            if (addinPermission == RequestedCapabilities.ReadWriteMailbox) {
                requiredPermissions = true;
            }
            break;
    }
    return requiredPermissions;
}
