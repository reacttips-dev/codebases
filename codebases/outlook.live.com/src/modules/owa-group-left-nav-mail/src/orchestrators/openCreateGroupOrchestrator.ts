import { openCreateGroup } from '../actions/internalActions';
import { lazyCreateGroup, UserType } from 'owa-group-create-integration';
import { lazyCreateGroupV2 } from 'owa-group-create-integration-v2';
import { getLeftNavGroupsStore } from 'owa-group-left-nav';
import { lazyLoadGroups } from 'owa-group-left-nav-actions';
import { getCurrentLanguage, getCurrentCulture } from 'owa-localize';
import { lazySelectGroup } from 'owa-mail-folder-forest-actions';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { orchestrator } from 'satcheljs';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getUnifiedGroupsSettingsStore } from 'owa-groups-shared-store/lib/UnifiedGroupsSettingsStore';

async function onGroupCreated(groupSmtpAddress?: string) {
    if (groupSmtpAddress) {
        const leftNavGroupsStore = getLeftNavGroupsStore();
        if (!leftNavGroupsStore.myOrgGroups.includes(groupSmtpAddress)) {
            // created group, reload left nav (this will also subscribe to unread)
            const loadGroups = await lazyLoadGroups.import();
            loadGroups();
        }

        await lazySelectGroup.importAndExecute(groupSmtpAddress, 'groups' /* treeType */);
    }
}

orchestrator(openCreateGroup, async actionMessage => {
    if (
        (isFeatureEnabled('grp-shareable-crud') ||
            getUnifiedGroupsSettingsStore().isSensitivityLabelsEnabled) &&
        !isConsumer()
    ) {
        const createGroup = await lazyCreateGroupV2.import();
        let sessionSettings = getUserConfiguration().SessionSettings;
        createGroup(
            sessionSettings.ExternalDirectoryUserGuid,
            getCurrentLanguage(),
            getCurrentCulture(),
            'OWA_LeftNav',
            onGroupCreated
        );
    } else {
        const createGroup = await lazyCreateGroup.import();
        createGroup(
            isConsumer() ? UserType.Consumer : UserType.Enterprise,
            getCurrentCulture(),
            'OWA',
            onGroupCreated
        );
    }
});
