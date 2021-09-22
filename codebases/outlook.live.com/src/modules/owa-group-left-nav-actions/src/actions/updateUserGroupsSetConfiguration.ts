import updateUserGroupsSetConfigurationOperation from 'owa-service/lib/operation/updateUserGroupsSetConfigurationOperation';
import updateUserGroupsSetConfigurationRequest from 'owa-service/lib/factory/updateUserGroupsSetConfigurationRequest';
import type UnifiedGroupsSet from 'owa-service/lib/contract/UnifiedGroupsSet';

export default function updateUserGroupsSetConfiguration(groupsSet: UnifiedGroupsSet[]) {
    updateUserGroupsSetConfigurationOperation({
        request: updateUserGroupsSetConfigurationRequest({
            GroupsSet: groupsSet,
        }),
    });
}
