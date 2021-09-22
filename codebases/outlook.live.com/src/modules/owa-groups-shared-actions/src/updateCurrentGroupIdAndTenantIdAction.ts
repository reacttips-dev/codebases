import { getCurrentGroupInformationStore } from 'owa-groups-shared-store/lib/CurrentGroupInformationStore';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'updateCurrentGroupIdAndTenantIdAction',
    (groupId: string, tenantId: string) => {
        getCurrentGroupInformationStore().groupId = groupId;
        getCurrentGroupInformationStore().tenantId = tenantId;
    }
);
