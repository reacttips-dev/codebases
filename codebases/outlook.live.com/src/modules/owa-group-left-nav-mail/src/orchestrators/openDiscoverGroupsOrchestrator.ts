import { openDiscoverGroups } from '../actions/internalActions';
import {
    EnterpriseGroup,
    GroupInfo,
    lazyGroupsDiscover,
    UserType,
} from 'owa-groups-discover-integration';
import { getLeftNavGroupsStore } from 'owa-group-left-nav';
import { lazyLoadGroups } from 'owa-group-left-nav-actions';
import { lazySelectGroup } from 'owa-mail-folder-forest-actions';
import { getCurrentCulture } from 'owa-localize';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { orchestrator } from 'satcheljs';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import { initializeUserSettings } from 'owa-groups-adaptors';

async function onGroupsDiscoverClosed(group: GroupInfo | EnterpriseGroup) {
    if (group) {
        const groupSmtpAddress = group.smtpAddress.toLowerCase();
        const leftNavGroupsStore = getLeftNavGroupsStore();
        if (!leftNavGroupsStore.myOrgGroups.includes(groupSmtpAddress)) {
            // joined group, reload left nav
            const loadGroups = await lazyLoadGroups.import();
            loadGroups();
        }

        lazySelectGroup.importAndExecute(groupSmtpAddress, 'groups' /* treeType */);
    }
}

orchestrator(openDiscoverGroups, async actionMessage => {
    const discoverGroups = await lazyGroupsDiscover.import();
    const userConfig = getUserConfiguration();
    initializeUserSettings(userConfig.SessionSettings.UserEmailAddress, getCurrentCulture());

    discoverGroups(
        isConsumer() ? UserType.Consumer : UserType.Enterprise,
        getCurrentCulture(),
        'OWA',
        onGroupsDiscoverClosed
    );
});
