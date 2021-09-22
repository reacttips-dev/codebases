import { createStore } from 'satcheljs';
import UnifiedGroupsSettingsState, { GroupAccessType } from './schema/UnifiedGroupsSettingsState';

export const getUnifiedGroupsSettingsStore = createStore<UnifiedGroupsSettingsState>(
    'unifiedGroupsSettingsStore',
    {
        supportedClassifications: [],
        defaultClassification: '',
        namingPolicySettings: {},
        groupsGuidelinesLink: '',
        orgAllowAddGuests: false,
        defaultGroupAccessType: GroupAccessType.Private,
        groupCreationEnabled: false,
        isSensitivityLabelsEnabled: false,
    }
);
